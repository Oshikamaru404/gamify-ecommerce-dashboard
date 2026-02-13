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

    if (paymentType === 'credit_card') {
      // CREDIT CARD: Use process-payment.php with provider=stripe for direct card checkout
      // Step 1: Create encrypted wallet address
      const walletUrl = `https://api.paygate.to/control/wallet.php?address=${encodeURIComponent(usdcWallet)}&callback=${encodedCallback}`;
      console.log('Creating PayGate wallet for credit card:', walletUrl);

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

      // Step 2: Build checkout URL using process-payment.php with provider=stripe
      const amount = packageData.price.toFixed(2);
      const email = encodeURIComponent(customerInfo.customerEmail);
      const addressIn = walletData.address_in;

      const checkoutUrl = `https://checkout.paygate.to/process-payment.php?address=${addressIn}&amount=${amount}&provider=stripe&email=${email}&currency=USD`;

      console.log('PayGate credit card checkout URL generated for order:', orderId);

      return new Response(JSON.stringify({
        success: true,
        checkoutUrl,
        addressIn: walletData.address_in,
        polygonAddress: walletData.polygon_address_in,
        ipnToken: walletData.ipn_token,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (paymentType === 'crypto') {
      // CRYPTO: Use the separate Crypto Payment Gateway API with hosted multi-coin mode
      // Step 1: Create hosted multi-coin wallet via POST to multi-hosted-wallet.php
      const amount = packageData.price;

      const cryptoPayload = {
        evm: usdcWallet, // EVM wallet covers Polygon, ERC20, BEP20, Arbitrum, etc.
        fiat_amount: amount,
        fiat_currency: "USD",
        callback: callbackUrl
      };

      console.log('Creating PayGate crypto hosted wallet for order:', orderId);

      const walletResponse = await fetch('https://api.paygate.to/crypto/multi-hosted-wallet.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cryptoPayload),
      });

      const contentType = walletResponse.headers.get('content-type');
      if (!walletResponse.ok || !contentType?.includes('application/json')) {
        const errorText = await walletResponse.text();
        console.error('PayGate crypto wallet creation failed:', walletResponse.status, errorText.substring(0, 200));
        throw new Error(`PayGate crypto wallet creation failed: ${walletResponse.status}`);
      }

      const walletData = await walletResponse.json();
      console.log('PayGate crypto wallet created:', walletData);

      if (!walletData.payment_token) {
        throw new Error('PayGate did not return a payment token');
      }

      // Step 2: Build hosted crypto checkout URL
      const checkoutUrl = `https://checkout.paygate.to/crypto/hosted.php?payment_token=${walletData.payment_token}&add_fees=1`;

      console.log('PayGate crypto checkout URL generated for order:', orderId);

      return new Response(JSON.stringify({
        success: true,
        checkoutUrl,
        ipnToken: walletData.ipn_token,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      throw new Error(`Unknown payment type: ${paymentType}`);
    }

  } catch (error) {
    console.error('Error in paygate-create-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
