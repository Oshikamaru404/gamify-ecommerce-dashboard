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
    const callbackUrl = `${supabaseUrl}/functions/v1/paygate-callback?order_id=${orderId}`;
    const encodedCallback = encodeURIComponent(callbackUrl);

    // Step 1: Create encrypted wallet address (same for both credit card and crypto)
    // Both use the Instant Payment Gateway: https://paygate.to/instant-payment-gateway/
    const walletUrl = `https://api.paygate.to/control/wallet.php?address=${encodeURIComponent(usdcWallet)}&callback=${encodedCallback}`;
    console.log('Creating PayGate wallet:', walletUrl);

    const walletResponse = await fetch(walletUrl);
    const contentType = walletResponse.headers.get('content-type');
    if (!walletResponse.ok || !contentType?.includes('application/json')) {
      const errorText = await walletResponse.text();
      console.error('PayGate wallet creation failed:', walletResponse.status, errorText.substring(0, 200));
      throw new Error(`PayGate wallet creation failed: ${walletResponse.status}`);
    }

    const walletData = await walletResponse.json();
    console.log('PayGate wallet created:', walletData);

    if (!walletData.address_in) {
      throw new Error('PayGate did not return an encrypted address');
    }

    const amount = packageData.price.toFixed(2);
    const email = encodeURIComponent(customerInfo.customerEmail);
    const addressIn = walletData.address_in;

    let checkoutUrl: string;

    if (paymentType === 'credit_card') {
      // Credit Card: Use process-payment.php with provider=stripe for direct card checkout
      checkoutUrl = `https://checkout.paygate.to/process-payment.php?address=${addressIn}&amount=${amount}&provider=stripe&email=${email}&currency=USD`;
      console.log('PayGate credit card checkout URL generated for order:', orderId);
    } else if (paymentType === 'crypto') {
      // Crypto: Use pay.php (multi-provider mode) so customer can choose their payment method
      checkoutUrl = `https://checkout.paygate.to/pay.php?address=${addressIn}&amount=${amount}&email=${email}&currency=USD`;
      console.log('PayGate crypto/multi-provider checkout URL generated for order:', orderId);
    } else {
      throw new Error(`Unknown payment type: ${paymentType}`);
    }

    return new Response(JSON.stringify({
      success: true,
      checkoutUrl,
      addressIn: walletData.address_in,
      polygonAddress: walletData.polygon_address_in,
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
