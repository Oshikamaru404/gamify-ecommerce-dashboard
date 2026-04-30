import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ticker, merchantAddress, amountUsd, orderId } = await req.json();

    if (!ticker || !merchantAddress || !amountUsd || !orderId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const callbackUrl = `${supabaseUrl}/functions/v1/paygate-callback?order_id=${orderId}`;
    const encodedCallback = encodeURIComponent(callbackUrl);

    // 1. Generate receiving wallet for the chosen ticker
    const walletUrl = `https://api.paygate.to/crypto/${ticker}/wallet.php?address=${encodeURIComponent(merchantAddress)}&callback=${encodedCallback}`;
    console.log('Creating PayGate wallet:', walletUrl);

    const walletRes = await fetch(walletUrl);
    const walletText = await walletRes.text();
    console.log('Wallet response:', walletRes.status, walletText.substring(0, 400));

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

    // 2. Convert USD amount to crypto amount
    const convertUrl = `https://api.paygate.to/crypto/${ticker}/convert.php?from=USD&value=${amountUsd}`;
    console.log('Converting amount:', convertUrl);
    let cryptoAmount: string | null = null;
    try {
      const convertRes = await fetch(convertUrl);
      const convertData = await convertRes.json();
      console.log('Convert response:', convertData);
      cryptoAmount = convertData.value_coin?.toString() ?? convertData.value?.toString() ?? null;
    } catch (e) {
      console.error('Convert call failed (non-fatal):', e);
    }

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
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
