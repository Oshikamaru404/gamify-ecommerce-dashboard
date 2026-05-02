import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Intent {
  id: string;
  order_id: string;
  network: string;
  coin: string;
  receiving_address: string;
  expected_amount: number;
  tolerance_pct: number;
  min_confirmations: number;
  status: string;
  tx_hash: string | null;
  created_at: string;
  expires_at: string;
}

interface IncomingTx {
  txHash: string;
  amount: number;       // in coin units
  confirmations: number;
  timestamp: number;    // unix sec
}

// ---------- Per-chain explorers (Etherscan V2 unified + Blockscout fallback) ----------

const ETHERSCAN_V2 = 'https://api.etherscan.io/v2/api';
const ETHERSCAN_KEY = Deno.env.get('ETHERSCAN_API_KEY') || '';

// Etherscan V2 chain IDs (one unified API + key for 60+ chains)
const CHAIN_IDS: Record<string, number> = {
  eth: 1, erc20: 1,
  bsc: 56, bep20: 56,
  polygon: 137, matic: 137,
  base: 8453,
  linea: 59144,
  arbitrum: 42161, arb: 42161,
  optimism: 10, op: 10,
};

// Free Blockscout fallbacks (no key required) — Etherscan-compatible API
const BLOCKSCOUT_BASES: Record<string, string> = {
  eth: 'https://eth.blockscout.com/api',
  erc20: 'https://eth.blockscout.com/api',
  base: 'https://base.blockscout.com/api',
  polygon: 'https://polygon.blockscout.com/api',
  matic: 'https://polygon.blockscout.com/api',
  linea: 'https://api-explorer.linea.build/api',
  arbitrum: 'https://arbitrum.blockscout.com/api',
  arb: 'https://arbitrum.blockscout.com/api',
  optimism: 'https://optimism.blockscout.com/api',
  op: 'https://optimism.blockscout.com/api',
  // BSC fallback (deprecated BscScan V1, kept as last resort)
  bsc: 'https://api.bscscan.com/api',
  bep20: 'https://api.bscscan.com/api',
};

// BSCTrace by NodeReal MegaNode — Etherscan-compatible, official BNB Chain replacement
const MEGANODE_KEY = Deno.env.get('MEGANODE_API_KEY') ?? '';
const BSCTRACE_BASE = MEGANODE_KEY
  ? `https://open-platform.nodereal.io/${MEGANODE_KEY}/bsctrace`
  : '';

function buildExplorerUrls(network: string, params: Record<string, string>): string[] {
  const n = network.toLowerCase();
  const urls: string[] = [];
  const chainId = CHAIN_IDS[n];
  if (chainId && ETHERSCAN_KEY) {
    const qs = new URLSearchParams({ chainid: String(chainId), ...params, apikey: ETHERSCAN_KEY });
    urls.push(`${ETHERSCAN_V2}?${qs.toString()}`);
  }
  const bs = BLOCKSCOUT_BASES[n];
  if (bs) {
    const qs = new URLSearchParams(params);
    urls.push(`${bs}?${qs.toString()}`);
  }
  return urls;
}

async function fetchWithFallback(network: string, params: Record<string, string>): Promise<any[]> {
  const urls = buildExplorerUrls(network, params);
  for (const url of urls) {
    const host = url.split('?')[0];
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`[${network}] HTTP ${res.status} on ${host} → trying next`);
        continue;
      }
      const data = await res.json();
      // Success: real array of results (status="1" or array directly)
      if (Array.isArray(data?.result) && (data?.status === '1' || data?.status === undefined)) {
        return data.result;
      }
      // Empty result: explicitly "no transactions found" — treat as success
      if (data?.status === '0' && /no transactions/i.test(data?.message || '')) {
        return [];
      }
      // Anything else (NOTOK, rate-limit, plan-not-allowed, etc.) → try next source
      console.warn(`[${network}] ${host} returned status="${data?.status}" message="${data?.message}" → trying next`);
    } catch (e) {
      console.warn(`[${network}] Fetch failed on ${host}:`, (e as Error).message);
    }
  }
  return [];
}

function isEvmSupported(network: string): boolean {
  const n = network.toLowerCase();
  return CHAIN_IDS[n] !== undefined || BLOCKSCOUT_BASES[n] !== undefined;
}

// Token contract addresses for stablecoins on each EVM chain
const TOKEN_CONTRACTS: Record<string, Record<string, string>> = {
  erc20: {
    usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  bep20: {
    usdt: '0x55d398326f99059fF775485246999027B3197955',
    usdc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  },
  polygon: {
    usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    usdc: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    pol: '',
    matic: '',
  },
  base: {
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    usdt: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
  },
  linea: {
    usdc: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
    usdt: '0xA219439258ca9da29E9Cc4cE5596924745e12B93',
  },
  arbitrum: {
    usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // native USDC
    usdt: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  arb: {
    usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    usdt: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  optimism: {
    usdc: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // native USDC
    usdt: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    op:   '0x4200000000000000000000000000000000000042',
  },
  op: {
    usdc: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    usdt: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    op:   '0x4200000000000000000000000000000000000042',
  },
};

const COIN_DECIMALS: Record<string, number> = {
  btc: 8, eth: 18, bnb: 18, pol: 18, matic: 18, sol: 9, trx: 6,
  usdt: 6, usdc: 6,
};
// USDT on BEP20 is 18 decimals
const TOKEN_DECIMALS_OVERRIDE: Record<string, Record<string, number>> = {
  bep20: { usdt: 18, usdc: 18 },
};

function decimalsFor(network: string, coin: string): number {
  const n = network.toLowerCase();
  const c = coin.toLowerCase();
  return TOKEN_DECIMALS_OVERRIDE[n]?.[c] ?? COIN_DECIMALS[c] ?? 18;
}

// -- BTC via blockstream.info
async function fetchBtcTxs(address: string, sinceTs: number): Promise<IncomingTx[]> {
  const res = await fetch(`https://blockstream.info/api/address/${address}/txs`);
  if (!res.ok) return [];
  const txs = await res.json();
  const tipRes = await fetch('https://blockstream.info/api/blocks/tip/height');
  const tipHeight = tipRes.ok ? parseInt(await tipRes.text()) : 0;
  const out: IncomingTx[] = [];
  for (const tx of txs) {
    const blockTime = tx.status?.block_time ?? Math.floor(Date.now() / 1000);
    if (blockTime < sinceTs) continue;
    let received = 0;
    for (const vout of tx.vout || []) {
      if (vout.scriptpubkey_address === address) received += vout.value;
    }
    if (received === 0) continue;
    const blockHeight = tx.status?.block_height ?? 0;
    const conf = tx.status?.confirmed && tipHeight && blockHeight ? tipHeight - blockHeight + 1 : 0;
    out.push({
      txHash: tx.txid,
      amount: received / 1e8,
      confirmations: conf,
      timestamp: blockTime,
    });
  }
  return out;
}

// -- BCH (Bitcoin Cash) via blockchair public API
async function fetchBchTxs(address: string, sinceTs: number): Promise<IncomingTx[]> {
  try {
    const res = await fetch(`https://api.blockchair.com/bitcoin-cash/dashboards/address/${address}?limit=20`);
    if (!res.ok) return [];
    const data = await res.json();
    const addrData = data?.data?.[address];
    if (!addrData) return [];
    const txHashes: string[] = addrData.transactions || [];
    const out: IncomingTx[] = [];
    for (const txid of txHashes.slice(0, 10)) {
      try {
        const txRes = await fetch(`https://api.blockchair.com/bitcoin-cash/dashboards/transaction/${txid}`);
        if (!txRes.ok) continue;
        const txData = await txRes.json();
        const tx = txData?.data?.[txid];
        if (!tx) continue;
        const ts = tx.transaction?.time ? Math.floor(new Date(tx.transaction.time).getTime() / 1000) : 0;
        if (ts < sinceTs) continue;
        let received = 0;
        for (const o of tx.outputs || []) {
          if (o.recipient === address) received += o.value;
        }
        if (received === 0) continue;
        out.push({
          txHash: txid,
          amount: received / 1e8,
          confirmations: (tx.transaction?.block_id ?? 0) > 0 ? 6 : 0,
          timestamp: ts,
        });
      } catch (_) { /* skip */ }
    }
    return out;
  } catch (e) {
    console.warn('BCH fetch failed:', (e as Error).message);
    return [];
  }
}

// -- TRX native via TronGrid
async function fetchTrxNativeTxs(address: string, sinceTs: number): Promise<IncomingTx[]> {
  const minTs = sinceTs * 1000;
  const url = `https://api.trongrid.io/v1/accounts/${address}/transactions?limit=50&min_timestamp=${minTs}&only_to=true`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const out: IncomingTx[] = [];
  for (const tx of (data?.data || [])) {
    const contract = tx.raw_data?.contract?.[0];
    if (contract?.type !== 'TransferContract') continue;
    const value = contract.parameter?.value;
    if (!value) continue;
    out.push({
      txHash: tx.txID,
      amount: (value.amount || 0) / 1e6,
      confirmations: tx.ret?.[0]?.contractRet === 'SUCCESS' ? 20 : 0,
      timestamp: Math.floor((tx.block_timestamp || 0) / 1000),
    });
  }
  return out;
}


async function fetchEvmNativeTxs(network: string, address: string, sinceTs: number): Promise<IncomingTx[]> {
  if (!isEvmSupported(network)) return [];
  const result = await fetchWithFallback(network, {
    module: 'account',
    action: 'txlist',
    address,
    startblock: '0',
    endblock: '99999999',
    sort: 'desc',
  });
  const out: IncomingTx[] = [];
  for (const tx of result) {
    const ts = parseInt(tx.timeStamp || '0');
    if (ts < sinceTs) continue;
    if ((tx.to || '').toLowerCase() !== address.toLowerCase()) continue;
    if (tx.isError === '1') continue;
    if (tx.value === '0') continue;
    out.push({
      txHash: tx.hash,
      amount: parseFloat(tx.value) / 1e18,
      confirmations: parseInt(tx.confirmations || '0'),
      timestamp: ts,
    });
  }
  return out;
}

// -- EVM token (USDT/USDC on EVM chains) — uses Etherscan V2 → Blockscout fallback
async function fetchEvmTokenTxs(network: string, coin: string, address: string, sinceTs: number): Promise<IncomingTx[]> {
  const contract = TOKEN_CONTRACTS[network.toLowerCase()]?.[coin.toLowerCase()];
  if (!contract || !isEvmSupported(network)) return [];
  const result = await fetchWithFallback(network, {
    module: 'account',
    action: 'tokentx',
    contractaddress: contract,
    address,
    sort: 'desc',
  });
  const dec = decimalsFor(network, coin);
  const out: IncomingTx[] = [];
  for (const tx of result) {
    const ts = parseInt(tx.timeStamp || '0');
    if (ts < sinceTs) continue;
    if ((tx.to || '').toLowerCase() !== address.toLowerCase()) continue;
    out.push({
      txHash: tx.hash,
      amount: parseFloat(tx.value) / Math.pow(10, dec),
      confirmations: parseInt(tx.confirmations || '0'),
      timestamp: ts,
    });
  }
  return out;
}

// -- Tron / TRC20
async function fetchTronTxs(coin: string, address: string, sinceTs: number): Promise<IncomingTx[]> {
  const minTs = sinceTs * 1000;
  const url = `https://api.trongrid.io/v1/accounts/${address}/transactions/trc20?limit=50&min_timestamp=${minTs}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const out: IncomingTx[] = [];
  for (const tx of (data?.data || [])) {
    if ((tx.to || '').toLowerCase() !== address.toLowerCase()) continue;
    if ((tx.token_info?.symbol || '').toLowerCase() !== coin.toLowerCase()) continue;
    const dec = tx.token_info?.decimals ?? 6;
    out.push({
      txHash: tx.transaction_id,
      amount: parseFloat(tx.value) / Math.pow(10, dec),
      confirmations: 20, // TRC20 tx returned by trongrid are already finalized
      timestamp: Math.floor((tx.block_timestamp || 0) / 1000),
    });
  }
  return out;
}

// -- Solana
// SPL token mints on Solana
const SOLANA_SPL_MINTS: Record<string, string> = {
  usdc: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  usdt: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
};

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

async function rpc(method: string, params: any[]): Promise<any> {
  const res = await fetch(SOLANA_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`Solana RPC ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function fetchSolanaTxs(coin: string, address: string, sinceTs: number): Promise<IncomingTx[]> {
  const c = coin.toLowerCase();
  try {
    // For SPL tokens (USDC/USDT), find the Associated Token Account first
    let monitorAddress = address;
    let isSpl = false;
    let mint = '';
    if (c === 'usdc' || c === 'usdt') {
      mint = SOLANA_SPL_MINTS[c];
      isSpl = true;
      // Find token accounts owned by this wallet for this mint
      const tokenAccounts = await rpc('getTokenAccountsByOwner', [
        address,
        { mint },
        { encoding: 'jsonParsed' },
      ]);
      const accounts = tokenAccounts?.value || [];
      if (accounts.length === 0) return []; // no token account => no transfers possible
      monitorAddress = accounts[0].pubkey;
    }

    // Get recent signatures for the monitored address
    const sigs = await rpc('getSignaturesForAddress', [monitorAddress, { limit: 20 }]);
    const out: IncomingTx[] = [];

    for (const sig of (sigs || [])) {
      const ts = sig.blockTime || 0;
      if (ts < sinceTs) continue;
      if (sig.err) continue;

      const tx = await rpc('getTransaction', [
        sig.signature,
        { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 },
      ]);
      if (!tx) continue;

      let amount = 0;
      if (isSpl) {
        // Compare pre/post token balances for our token account
        const pre = tx.meta?.preTokenBalances || [];
        const post = tx.meta?.postTokenBalances || [];
        const findBal = (arr: any[]) => arr.find((b: any) =>
          b.owner === address && b.mint === mint
        );
        const preBal = parseFloat(findBal(pre)?.uiTokenAmount?.uiAmountString || '0');
        const postBal = parseFloat(findBal(post)?.uiTokenAmount?.uiAmountString || '0');
        amount = postBal - preBal;
      } else {
        // Native SOL: compare pre/post lamports for our address
        const accountKeys = tx.transaction?.message?.accountKeys || [];
        const idx = accountKeys.findIndex((k: any) => (k.pubkey || k) === address);
        if (idx >= 0) {
          const pre = tx.meta?.preBalances?.[idx] ?? 0;
          const post = tx.meta?.postBalances?.[idx] ?? 0;
          amount = (post - pre) / 1e9;
        }
      }
      if (amount <= 0) continue;

      out.push({
        txHash: sig.signature,
        amount,
        confirmations: sig.confirmationStatus === 'finalized' ? 32 : sig.confirmationStatus === 'confirmed' ? 1 : 0,
        timestamp: ts,
      });
    }
    return out;
  } catch (e) {
    console.warn(`Solana fetch failed [${c}]:`, (e as Error).message);
    return [];
  }
}

async function getIncomingTxs(network: string, coin: string, address: string, sinceTs: number): Promise<IncomingTx[]> {
  const n = network.toLowerCase();
  const c = coin.toLowerCase();
  try {
    if (n === 'btc' && c === 'btc') return await fetchBtcTxs(address, sinceTs);
    if (n === 'bch' || c === 'bch') return await fetchBchTxs(address, sinceTs);
    if ((n === 'trc20' || n === 'tron') && c === 'trx') return await fetchTrxNativeTxs(address, sinceTs);
    if (n === 'trc20' || n === 'tron') return await fetchTronTxs(c, address, sinceTs);
    if (n === 'solana' || n === 'sol') return await fetchSolanaTxs(c, address, sinceTs);
    if (isEvmSupported(n)) {
      // Stablecoin on EVM => token; else native
      if (TOKEN_CONTRACTS[n]?.[c]) return await fetchEvmTokenTxs(network, coin, address, sinceTs);
      return await fetchEvmNativeTxs(network, address, sinceTs);
    }
    return [];
  } catch (e) {
    console.error(`Explorer error [${n}/${c}]`, e);
    return [];
  }
}

// ---------- Main ----------
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const sb = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    // Mark expired
    await sb
      .from('crypto_payment_intents')
      .update({ status: 'expired' })
      .lt('expires_at', new Date().toISOString())
      .in('status', ['pending', 'detected']);

    // Load active intents
    const { data: intents, error } = await sb
      .from('crypto_payment_intents')
      .select('*')
      .in('status', ['pending', 'detected'])
      .gt('expires_at', new Date().toISOString());

    if (error) throw error;
    const list = (intents || []) as Intent[];
    console.log(`Watcher: ${list.length} active intents`);

    let processed = 0, confirmed = 0;
    for (const intent of list) {
      processed++;
      const sinceTs = Math.floor(new Date(intent.created_at).getTime() / 1000) - 60;
      const txs = await getIncomingTxs(intent.network, intent.coin, intent.receiving_address, sinceTs);

      const tol = intent.tolerance_pct / 100;
      const lower = intent.expected_amount * (1 - tol);
      const upper = intent.expected_amount * (1 + tol);

      // If we already have a tx_hash, just refresh confirmations
      let match: IncomingTx | undefined;
      if (intent.tx_hash) {
        match = txs.find(t => t.txHash === intent.tx_hash);
      }
      if (!match) {
        match = txs.find(t => t.amount >= lower && t.amount <= upper);
      }

      const update: Record<string, unknown> = { last_checked_at: new Date().toISOString() };

      if (match) {
        update.tx_hash = match.txHash;
        update.confirmations = match.confirmations;
        update.detected_amount = match.amount;

        if (match.confirmations >= intent.min_confirmations) {
          update.status = 'confirmed';
          update.confirmed_at = new Date().toISOString();
          // Mark order paid and fetch updated row.
          // NOTE: orders.status check constraint allows: pending|processing|shipped|delivered|cancelled
          const { data: paidOrder, error: orderUpdErr } = await sb
            .from('orders')
            .update({ payment_status: 'paid', status: 'processing' })
            .eq('id', intent.order_id)
            .select()
            .single();
          if (orderUpdErr) {
            console.error(`Order update failed for ${intent.order_id}:`, orderUpdErr);
          } else {
            console.log(`Order ${intent.order_id} marked paid/processing`);
          }
          // Best-effort WhatsApp notification
          try {
            await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-whatsapp-notification`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
              },
              body: JSON.stringify({ orderId: intent.order_id, event: 'payment_confirmed' }),
            });
          } catch (e) { console.warn('WhatsApp notify failed:', e); }
          // Send email notifications (client + admin)
          if (paidOrder) {
            const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
            const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
            const shortId = String(paidOrder.id).slice(0, 8).toUpperCase();
            const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${serviceKey}`, apikey: serviceKey };
            const method = `Crypto (${intent.coin.toUpperCase()} on ${intent.network.toUpperCase()})`;
            try {
              if (paidOrder.customer_email) {
                await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
                  method: 'POST', headers,
                  body: JSON.stringify({
                    templateName: 'payment-confirmed',
                    recipientEmail: paidOrder.customer_email,
                    idempotencyKey: `payment-confirmed-${paidOrder.id}`,
                    templateData: { customerName: paidOrder.customer_name, orderId: shortId, packageName: paidOrder.package_name, amount: paidOrder.amount },
                  }),
                });
              }
              await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
                method: 'POST', headers,
                body: JSON.stringify({
                  templateName: 'admin-payment-received',
                  recipientEmail: 'bwivox@gmail.com',
                  idempotencyKey: `admin-payment-${paidOrder.id}`,
                  templateData: {
                    orderId: shortId, customerName: paidOrder.customer_name, customerEmail: paidOrder.customer_email,
                    packageName: paidOrder.package_name, amount: paidOrder.amount, paymentMethod: method, txHash: match.txHash,
                  },
                }),
              });
            } catch (e) { console.warn('Email notify failed:', e); }
          }
          confirmed++;
        } else if (intent.status === 'pending') {
          update.status = 'detected';
        }
      }

      await sb.from('crypto_payment_intents').update(update).eq('id', intent.id);
    }

    return new Response(JSON.stringify({ ok: true, processed, confirmed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Watcher error:', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
