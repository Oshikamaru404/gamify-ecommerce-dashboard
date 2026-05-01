import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
    const { orderId, network, coin, address, amountUsd } = await req.json();

    if (!orderId || !network || !coin || !address || !amountUsd) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const sb = createClient(supabaseUrl, serviceKey);

    // Get USD price via crypto-price function
    const priceRes = await fetch(
      `${supabaseUrl}/functions/v1/crypto-price?coin=${encodeURIComponent(coin)}&network=${encodeURIComponent(network)}&amount=${amountUsd}`,
      { headers: { Authorization: `Bearer ${serviceKey}` } }
    );
    if (!priceRes.ok) throw new Error(`Price lookup failed: ${priceRes.status}`);
    const priceData = await priceRes.json();
    const baseAmount: number = priceData.cryptoAmount;
    const decimals = COIN_DECIMALS[coin.toLowerCase()] ?? 6;

    // Dust offset: count pending intents on same (network, coin) with similar amount
    const lower = baseAmount * 0.98;
    const upper = baseAmount * 1.02;
    const { data: collisions } = await sb
      .from('crypto_payment_intents')
      .select('id')
      .eq('network', network)
      .eq('coin', coin)
      .eq('status', 'pending')
      .gte('expected_amount', lower)
      .lte('expected_amount', upper);

    const collisionCount = (collisions?.length ?? 0);
    const smallestUnit = Math.pow(10, -decimals);
    const expectedAmount = parseFloat(
      (baseAmount + collisionCount * smallestUnit).toFixed(decimals)
    );

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
        tolerance_pct: 2,
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
