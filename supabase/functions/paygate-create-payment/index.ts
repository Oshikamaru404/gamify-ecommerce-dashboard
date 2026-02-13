import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Build callback URL - PayGate sends GET request to this URL
    const callbackUrl = `${supabaseUrl}/functions/v1/paygate-callback?order_id=${orderId}`;
    const encodedCallback = encodeURIComponent(callbackUrl);

    if (paymentType === 'credit_card') {
      // Step 1: Create encrypted wallet address
      const walletUrl = `https://api.paygate.to/control/wallet.php?address=${encodeURIComponent(usdcWallet)}&callback=${encodedCallback}`;
      console.log('Creating PayGate wallet:', walletUrl);

      const walletResponse = await fetch(walletUrl);
      if (!walletResponse.ok) {
        const errorText = await walletResponse.text();
        console.error('PayGate wallet creation failed:', walletResponse.status, errorText);
        throw new Error(`PayGate wallet creation failed: ${walletResponse.status}`);
      }

      const walletData = await walletResponse.json();
      console.log('PayGate wallet created:', walletData);

      if (!walletData.address_in) {
        throw new Error('PayGate did not return an encrypted address');
      }

      // Step 2: Build checkout URL (multi-provider mode so customer can choose)
      const amount = packageData.price.toFixed(2);
      const email = encodeURIComponent(customerInfo.customerEmail);
      const addressIn = walletData.address_in; // already URL-encoded from PayGate

      const checkoutUrl = `https://checkout.paygate.to/pay.php?address=${addressIn}&amount=${amount}&email=${email}&currency=USD`;

      console.log('PayGate checkout URL generated for order:', orderId);

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
      // Crypto: Use the hosted multi-coin checkout page (same flow as credit card but through crypto gateway)
      // Step 1: Create encrypted wallet for crypto
      const walletUrl = `https://api.paygate.to/control/wallet.php?address=${encodeURIComponent(usdcWallet)}&callback=${encodedCallback}`;
      console.log('Creating PayGate crypto wallet:', walletUrl);

      const walletResponse = await fetch(walletUrl);
      if (!walletResponse.ok) {
        const errorText = await walletResponse.text();
        console.error('PayGate crypto wallet creation failed:', walletResponse.status, errorText);
        throw new Error(`PayGate crypto wallet creation failed: ${walletResponse.status}`);
      }

      const walletData = await walletResponse.json();
      console.log('PayGate crypto wallet created:', walletData);

      if (!walletData.address_in) {
        throw new Error('PayGate did not return an encrypted address');
      }

      // For crypto, use the multi-coin hosted page
      const amount = packageData.price.toFixed(2);
      const email = encodeURIComponent(customerInfo.customerEmail);
      const addressIn = walletData.address_in;

      // Use pay.php for multi-provider/multi-coin selection
      const checkoutUrl = `https://checkout.paygate.to/pay.php?address=${addressIn}&amount=${amount}&email=${email}&currency=USD`;

      console.log('PayGate crypto checkout URL generated for order:', orderId);

      return new Response(JSON.stringify({
        success: true,
        checkoutUrl,
        addressIn: walletData.address_in,
        polygonAddress: walletData.polygon_address_in,
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
