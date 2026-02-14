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

    const amount = packageData.price.toFixed(2);
    const email = customerInfo.customerEmail;

    let checkoutUrl: string;

    if (paymentType === 'credit_card') {
      // ─── Credit Card: use original Instant Payment Gateway flow ───
      const encodedCallback = encodeURIComponent(callbackUrl);
      const walletUrl = `https://api.paygate.to/control/wallet.php?address=${encodeURIComponent(usdcWallet)}&callback=${encodedCallback}`;
      console.log('Credit card - Creating PayGate wallet:', walletUrl);

      const walletResponse = await fetch(walletUrl);
      const contentType = walletResponse.headers.get('content-type');
      if (!walletResponse.ok || !contentType?.includes('application/json')) {
        const errorText = await walletResponse.text();
        console.error('PayGate wallet creation failed:', walletResponse.status, errorText.substring(0, 500));
        throw new Error(`PayGate wallet creation failed: ${walletResponse.status}`);
      }

      const walletData = await walletResponse.json();
      console.log('Wallet created:', JSON.stringify(walletData));

      if (!walletData.address_in) {
        throw new Error('PayGate did not return an encrypted address_in');
      }

      const addressIn = walletData.address_in;
      checkoutUrl = `https://checkout.paygate.to/process-payment.php?address=${addressIn}&amount=${amount}&provider=stripe&email=${encodeURIComponent(email)}&currency=USD`;
      console.log('Credit card checkout URL generated for order:', orderId);

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

    } else if (paymentType === 'crypto') {
      // ─── Crypto: use Hosted Multi-Coin Mode (Crypto Payment Processor API) ───
      // Docs: POST https://api.paygate.to/crypto/multi-hosted-wallet.php
      // Accepts EVM wallet for all EVM chains (ERC20, BEP20, Polygon, Arbitrum, Base, Optimism, Avalanche)
      const body = {
        evm_address: usdcWallet,
        callback: callbackUrl,
        email: email,
        fiat_amount: amount,
        fiat_currency: 'USD',
      };

      console.log('Crypto - Creating multi-hosted wallet for order:', orderId);
      const hostedResponse = await fetch('https://api.paygate.to/crypto/multi-hosted-wallet.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const hostedText = await hostedResponse.text();
      console.log('Multi-hosted response:', hostedResponse.status, hostedText.substring(0, 500));

      if (!hostedResponse.ok) {
        throw new Error(`PayGate multi-hosted wallet failed: ${hostedResponse.status} - ${hostedText.substring(0, 200)}`);
      }

      let hostedData;
      try {
        hostedData = JSON.parse(hostedText);
      } catch {
        throw new Error(`PayGate returned non-JSON response: ${hostedText.substring(0, 200)}`);
      }

      if (!hostedData.payment_token) {
        throw new Error(`PayGate did not return payment_token: ${JSON.stringify(hostedData)}`);
      }

      checkoutUrl = `https://checkout.paygate.to/crypto/hosted.php?payment_token=${hostedData.payment_token}`;
      console.log('Crypto hosted checkout URL generated for order:', orderId);

      return new Response(JSON.stringify({
        success: true,
        checkoutUrl,
        paymentToken: hostedData.payment_token,
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
