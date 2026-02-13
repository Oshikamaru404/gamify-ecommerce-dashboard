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
    const { packageData, customerInfo, orderId, paymentType } = await req.json();

    const usdcWallet = Deno.env.get('PAYGATE_USDC_WALLET');
    if (!usdcWallet) {
      throw new Error('PAYGATE_USDC_WALLET is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;

    // Build callback URL - PayGate sends GET request to this URL
    // Must have a unique GET parameter (order_id) per the API docs
    const callbackUrl = `${supabaseUrl}/functions/v1/paygate-callback?order_id=${orderId}`;
    const encodedCallback = encodeURIComponent(callbackUrl);

    // ─── Step 1: Create encrypted wallet via GET wallet.php ───
    // Docs: https://documenter.getpostman.com/view/14826208/2sA3Bj9aBi#9f7c5d95-9ca3-495a-931a-128d76ecd92e
    // Params: address (USDC Polygon wallet), callback (urlencoded unique callback URL)
    const walletUrl = `https://api.paygate.to/control/wallet.php?address=${encodeURIComponent(usdcWallet)}&callback=${encodedCallback}`;
    console.log('Step 1 - Creating PayGate wallet:', walletUrl);

    const walletResponse = await fetch(walletUrl);
    const contentType = walletResponse.headers.get('content-type');
    if (!walletResponse.ok || !contentType?.includes('application/json')) {
      const errorText = await walletResponse.text();
      console.error('PayGate wallet creation failed:', walletResponse.status, errorText.substring(0, 500));
      throw new Error(`PayGate wallet creation failed: ${walletResponse.status}`);
    }

    const walletData = await walletResponse.json();
    console.log('Step 1 - Wallet created:', JSON.stringify(walletData));

    // Validate response per docs: must have address_in
    if (!walletData.address_in) {
      throw new Error('PayGate did not return an encrypted address_in');
    }

    // ─── Step 2: Build checkout URL ───
    // address_in may need json_decode() per docs - use as-is since it's already a string
    const addressIn = walletData.address_in;
    const amount = packageData.price.toFixed(2);
    const email = encodeURIComponent(customerInfo.customerEmail);

    let checkoutUrl: string;

    if (paymentType === 'credit_card') {
      // Docs: GET process-payment.php
      // https://documenter.getpostman.com/view/14826208/2sA3Bj9aBi#d9a2f09d-2103-42e5-989d-3717be050c09
      // Params: address (encrypted address_in), amount, provider, email, currency
      // provider=stripe for direct credit card checkout (USD only)
      checkoutUrl = `https://checkout.paygate.to/process-payment.php?address=${addressIn}&amount=${amount}&provider=stripe&email=${email}&currency=USD`;
      console.log('Step 2 - Credit card checkout URL generated for order:', orderId);
    } else if (paymentType === 'crypto') {
      // Docs: GET pay.php (Multi-provider Mode)
      // https://documenter.getpostman.com/view/14826208/2sA3Bj9aBi#365839e7-152a-4839-a094-6372f44ae6b2
      // Params: address (encrypted address_in), amount, email, currency
      // This shows a hosted page with multi-provider selection list
      checkoutUrl = `https://checkout.paygate.to/pay.php?address=${addressIn}&amount=${amount}&email=${email}&currency=USD`;
      console.log('Step 2 - Multi-provider checkout URL generated for order:', orderId);
    } else {
      throw new Error(`Unknown payment type: ${paymentType}`);
    }

    // Return checkout URL and wallet data for tracking
    return new Response(JSON.stringify({
      success: true,
      checkoutUrl,
      addressIn: walletData.address_in,
      polygonAddress: walletData.polygon_address_in,
      callbackUrl: walletData.callback_url,
      ipnToken: walletData.ipn_token,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in paygate-create-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
