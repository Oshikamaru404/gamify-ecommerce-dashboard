import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { validateStormPanelOrder } from "../_shared/storm-panel-order-validation.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

function getDefaultTicker(network: string, coin: string): string {
  const net = network.toLowerCase();
  const symbol = coin.toLowerCase();
  if (net === 'btc' || symbol === 'btc') return 'btc';
  if ((net === 'eth' || net === 'erc20') && symbol === 'eth') return 'eth';
  if (net === 'eth' || net === 'erc20') return `erc20/${symbol}`;
  if (net === 'bep20' || net === 'bsc') return `bep20/${symbol}`;
  if (net === 'polygon' || net === 'matic') return `polygon/${symbol}`;
  if (net === 'base') return `base/${symbol}`;
  if (net === 'arbitrum') return `arbitrum/${symbol}`;
  if (net === 'optimism') return `optimism/${symbol}`;
  if (net === 'linea') return `linea/${symbol}`;
  if (net === 'avax-c' || net === 'avalanche') return `avax-c/${symbol}`;
  if (net === 'solana' || net === 'sol') return `sol/${symbol === 'sol' ? 'sol' : symbol}`;
  if (net === 'trc20' || net === 'tron') return `trc20/${symbol}`;
  return `${net}/${symbol}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ticker, merchantAddress, amountUsd, orderId, network, coin } = await req.json();

    if (
      typeof orderId !== 'string' ||
      !/^[0-9a-f-]{36}$/i.test(orderId) ||
      typeof ticker !== 'string' ||
      !/^[a-z0-9/_-]+$/i.test(ticker) ||
      typeof merchantAddress !== 'string' ||
      typeof network !== 'string' ||
      typeof coin !== 'string' ||
      !Number.isFinite(Number(amountUsd)) ||
      Number(amountUsd) <= 0
    ) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();
    if (orderError) throw orderError;
    if (!order || order.payment_status !== 'pending') {
      return Response.json({ error: 'Order not found or no longer awaiting payment' }, {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const orderValidation = await validateStormPanelOrder(supabase, order);
    if (orderValidation.error) {
      return Response.json({ error: orderValidation.error }, {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (Math.abs(Number(order.amount) - Number(amountUsd)) > 0.01) {
      return Response.json({ error: 'Payment amount does not match the order' }, {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { data: walletSetting, error: walletError } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'crypto_wallets')
      .maybeSingle();
    if (walletError) throw walletError;
    let wallets: Array<{ network?: string; coin?: string; address?: string; ticker?: string }> = [];
    try {
      const parsed: unknown = JSON.parse(walletSetting?.setting_value ?? '[]');
      if (Array.isArray(parsed)) wallets = parsed;
    } catch {
      throw new Error('Configured crypto wallets are invalid');
    }
    const configuredWallet = wallets.find((wallet) =>
      wallet.network?.toLowerCase() === network.toLowerCase() &&
      wallet.coin?.toLowerCase() === coin.toLowerCase() &&
      (wallet.address === merchantAddress ||
        (/^0x[0-9a-f]{40}$/i.test(wallet.address ?? '') &&
          wallet.address?.toLowerCase() === merchantAddress.toLowerCase()))
    );
    if (!configuredWallet) {
      return Response.json({ error: 'The selected payment wallet is not configured for this store' }, {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const expectedTicker = configuredWallet.ticker || getDefaultTicker(network, coin);
    if (ticker.toLowerCase() !== expectedTicker.toLowerCase()) {
      return Response.json({ error: 'The selected crypto ticker does not match the configured wallet' }, {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const convertUrl = `https://api.paygate.to/crypto/${ticker}/convert.php?from=USD&value=${encodeURIComponent(String(Number(order.amount)))}`;
    const convertResponse = await fetch(convertUrl, { signal: AbortSignal.timeout(12_000) });
    if (!convertResponse.ok) {
      throw new Error(`PayGate conversion failed: ${convertResponse.status}`);
    }
    const convertData = await convertResponse.json();
    const cryptoAmount = convertData.value_coin?.toString() ?? convertData.value?.toString() ?? null;
    if (!cryptoAmount || !Number.isFinite(Number(cryptoAmount)) || Number(cryptoAmount) <= 0) {
      throw new Error('PayGate returned an invalid crypto amount');
    }

    const callbackUrl = `${supabaseUrl}/functions/v1/paygate-callback?order_id=${orderId}&provider=paygate_crypto`;
    const encodedCallback = encodeURIComponent(callbackUrl);

    // 1. Generate receiving wallet for the chosen ticker
    const walletUrl = `https://api.paygate.to/crypto/${ticker}/wallet.php?address=${encodeURIComponent(merchantAddress)}&callback=${encodedCallback}`;
    const walletRes = await fetch(walletUrl);
    const walletText = await walletRes.text();

    if (!walletRes.ok) {
      throw new Error(`PayGate wallet creation failed [${walletRes.status}]: ${walletText.substring(0, 200)}`);
    }

    let walletData: any;
    try {
      walletData = JSON.parse(walletText);
    } catch {
      throw new Error(`Non-JSON wallet response: ${walletText.substring(0, 200)}`);
    }

    if (!walletData.address_in) {
      throw new Error(`No address_in returned: ${JSON.stringify(walletData)}`);
    }
    const { error: intentError } = await supabase
      .from('storm_panel_payment_intents')
      .insert({
        order_id: orderId,
        provider: 'paygate_crypto',
        address_in: walletData.address_in,
        expected_amount: Number(cryptoAmount),
      });
    if (intentError) throw intentError;

    // 3. QR code URL (PayGate hosted)
    const qrUrl = `https://api.paygate.to/qrgen.php?data=${encodeURIComponent(walletData.address_in)}&size=240`;

    return new Response(JSON.stringify({
      success: true,
      addressIn: walletData.address_in,
      ipnToken: walletData.ipn_token,
      callbackUrl: walletData.callback_url,
      cryptoAmount,
      qrUrl,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in paygate-create-direct-payment:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Payment creation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
