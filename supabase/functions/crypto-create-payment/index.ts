import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { validateStormPanelOrder } from "../_shared/storm-panel-order-validation.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Decimals per coin (defines smallest unit for dust offset)
const COIN_DECIMALS: Record<string, number> = {
  btc: 8, eth: 6, bnb: 6, sol: 6, trx: 6, pol: 6, matic: 6,
  usdt: 4, usdc: 4,
};

// Default min confirmations per network
const DEFAULT_CONFIRMATIONS: Record<string, number> = {
  btc: 1,
  erc20: 6, eth: 6, base: 6, linea: 6, polygon: 30, matic: 30,
  bep20: 12, bsc: 12,
  solana: 1, sol: 1,
  trc20: 19, tron: 19,
};

// Intent expiry window
const INTENT_TTL_MIN = 30;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { orderId, network, coin, address } = await req.json();

    if (
      typeof orderId !== 'string' ||
      !/^[0-9a-f-]{36}$/i.test(orderId) ||
      typeof network !== 'string' ||
      typeof coin !== 'string' ||
      typeof address !== 'string'
    ) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const sb = createClient(supabaseUrl, serviceKey);

    const { data: order, error: orderError } = await sb
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();
    if (orderError) throw orderError;
    if (!order || order.payment_status !== 'pending') {
      return new Response(JSON.stringify({ error: 'Order not found or no longer awaiting payment' }), {
        status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const orderValidation = await validateStormPanelOrder(sb, order);
    if (orderValidation.error) {
      return new Response(JSON.stringify({ error: orderValidation.error }), {
        status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const amountUsd = Number(order.amount);
    if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
      return new Response(JSON.stringify({ error: 'Order has an invalid payment amount' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: walletSetting, error: walletError } = await sb
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'crypto_wallets')
      .maybeSingle();
    if (walletError) throw walletError;

    let configuredWallets: Array<{ network?: string; coin?: string; address?: string }> = [];
    try {
      const parsed: unknown = JSON.parse(walletSetting?.setting_value ?? '[]');
      if (Array.isArray(parsed)) configuredWallets = parsed;
    } catch {
      throw new Error('Configured crypto wallets are invalid');
    }
    const addressMatches = (configured: string, requested: string) =>
      configured === requested || (/^0x[0-9a-f]{40}$/i.test(configured) && configured.toLowerCase() === requested.toLowerCase());
    const walletIsConfigured = configuredWallets.some((wallet) =>
      wallet.network?.toLowerCase() === network.toLowerCase() &&
      wallet.coin?.toLowerCase() === coin.toLowerCase() &&
      typeof wallet.address === 'string' &&
      addressMatches(wallet.address, address)
    );
    if (!walletIsConfigured) {
      return new Response(JSON.stringify({ error: 'The selected payment wallet is not configured for this store' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get USD price via crypto-price function
    const priceRes = await fetch(
      `${supabaseUrl}/functions/v1/crypto-price?coin=${encodeURIComponent(coin)}&network=${encodeURIComponent(network)}&amount=${amountUsd}`,
      { headers: { Authorization: `Bearer ${serviceKey}` } }
    );
    if (!priceRes.ok) throw new Error(`Price lookup failed: ${priceRes.status}`);
    const priceData = await priceRes.json();
    const baseAmount: number = priceData.cryptoAmount;
    const decimals = COIN_DECIMALS[coin.toLowerCase()] ?? 6;

    const { data: activeIntents, error: activeIntentsError } = await sb
      .from('crypto_payment_intents')
      .select('expected_amount')
      .eq('network', network)
      .eq('coin', coin)
      .eq('receiving_address', address)
      .in('status', ['pending', 'detected']);
    if (activeIntentsError) throw activeIntentsError;

    const smallestUnit = Math.pow(10, -decimals);
    const occupiedAmounts = new Set((activeIntents ?? []).map((intent) =>
      Number(intent.expected_amount).toFixed(decimals)
    ));
    let expectedAmount = Number(baseAmount.toFixed(decimals));
    for (let offset = 0; offset < 1000 && occupiedAmounts.has(expectedAmount.toFixed(decimals)); offset++) {
      expectedAmount = Number((expectedAmount + smallestUnit).toFixed(decimals));
    }
    if (occupiedAmounts.has(expectedAmount.toFixed(decimals))) {
      throw new Error('Unable to allocate a unique crypto amount; try again shortly');
    }

    const networkKey = network.toLowerCase();
    const minConfirmations =
      DEFAULT_CONFIRMATIONS[networkKey] ?? DEFAULT_CONFIRMATIONS[coin.toLowerCase()] ?? 6;

    const expiresAt = new Date(Date.now() + INTENT_TTL_MIN * 60_000).toISOString();

    const { data: intent, error } = await sb
      .from('crypto_payment_intents')
      .insert({
        order_id: orderId,
        network,
        coin,
        receiving_address: address,
        expected_amount: expectedAmount,
        amount_usd: amountUsd,
        tolerance_pct: 0,
        min_confirmations: minConfirmations,
        status: 'pending',
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) throw error;

    // QR payload — plain address (most wallets ignore amount in URI for non-BTC chains)
    const qrUrl = `https://api.paygate.to/qrgen.php?data=${encodeURIComponent(address)}&size=240`;

    return new Response(JSON.stringify({
      success: true,
      intentId: intent.id,
      address,
      expectedAmount,
      coin,
      network,
      amountUsd,
      usdPerCoin: priceData.usdPerCoin,
      priceSource: priceData.source,
      qrUrl,
      expiresAt,
      minConfirmations,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('crypto-create-payment error:', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
