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
  linea: 'https://explorer.linea.build/api',
  arbitrum: 'https://arbitrum.blockscout.com/api',
  arb: 'https://arbitrum.blockscout.com/api',
  optimism: 'https://optimism.blockscout.com/api',
  op: 'https://optimism.blockscout.com/api',
  // BSC: no reliable free Blockscout — V2 only
};

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
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`[${network}] HTTP ${res.status} on ${url.split('?')[0]}`);
        continue;
      }
      const data = await res.json();
      if (Array.isArray(data?.result)) return data.result;
      // status="0" with empty message often means "no transactions found" — treat as success
      if (data?.status === '0' && /no transactions/i.test(data?.message || '')) return [];
      console.warn(`[${network}] Unexpected response from ${url.split('?')[0]}: ${JSON.stringify(data).slice(0, 200)}`);
    } catch (e) {
      console.warn(`[${network}] Fetch failed on ${url.split('?')[0]}:`, (e as Error).message);
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

// -- EVM native (ETH/BNB/POL/etc.)
async function fetchEvmNativeTxs(network: string, address: string, sinceTs: number): Promise<IncomingTx[]> {
  const base = ETHERSCAN_BASES[network.toLowerCase()];
  if (!base) return [];
  const url = `${base}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const result = Array.isArray(data?.result) ? data.result : [];
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

// -- EVM token (USDT/USDC on EVM chains)
async function fetchEvmTokenTxs(network: string, coin: string, address: string, sinceTs: number): Promise<IncomingTx[]> {
  const base = ETHERSCAN_BASES[network.toLowerCase()];
  const contract = TOKEN_CONTRACTS[network.toLowerCase()]?.[coin.toLowerCase()];
  if (!base || !contract) return [];
  const url = `${base}?module=account&action=tokentx&contractaddress=${contract}&address=${address}&sort=desc`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const result = Array.isArray(data?.result) ? data.result : [];
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
async function fetchSolanaTxs(coin: string, address: string, sinceTs: number): Promise<IncomingTx[]> {
  // Use public solscan; native SOL only for now; SPL tokens (USDC/USDT) skipped (would need indexer)
  if (coin.toLowerCase() !== 'sol') return [];
  const res = await fetch(`https://public-api.solscan.io/account/transactions?account=${address}&limit=20`);
  if (!res.ok) return [];
  const data = await res.json();
  const out: IncomingTx[] = [];
  for (const tx of (Array.isArray(data) ? data : [])) {
    const ts = tx.blockTime || 0;
    if (ts < sinceTs) continue;
    const lamportChange = tx.lamport ?? 0;
    if (lamportChange <= 0) continue;
    out.push({
      txHash: tx.txHash,
      amount: lamportChange / 1e9,
      confirmations: 1,
      timestamp: ts,
    });
  }
  return out;
}

async function getIncomingTxs(network: string, coin: string, address: string, sinceTs: number): Promise<IncomingTx[]> {
  const n = network.toLowerCase();
  const c = coin.toLowerCase();
  try {
    if (n === 'btc' || c === 'btc') return await fetchBtcTxs(address, sinceTs);
    if (n === 'trc20' || n === 'tron') return await fetchTronTxs(c, address, sinceTs);
    if (n === 'solana' || n === 'sol') return await fetchSolanaTxs(c, address, sinceTs);
    if (ETHERSCAN_BASES[n]) {
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
