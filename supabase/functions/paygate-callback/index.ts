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
    // PayGate Callback Event - sends a GET request with all original params + payment data
    // Docs: https://documenter.getpostman.com/view/14826208/2sA3Bj9aBi#5e5d4429-f645-4e30-9be6-e6748466d872
    const url = new URL(req.url);

    // Original parameter we set in the callback URL
    const orderId = url.searchParams.get('order_id');

    // Payment data parameters added by PayGate per docs:
    const valueCoin = url.searchParams.get('value_coin');           // Amount of USDC paid by the provider
    const coin = url.searchParams.get('coin');                       // Payout coin type (e.g. polygon_usdc)
    const txidIn = url.searchParams.get('txid_in');                 // Polygon TXID from provider to order wallet
    const txidOut = url.searchParams.get('txid_out');               // Payout TXID from order wallet to merchant wallet
    const addressIn = url.searchParams.get('address_in');           // Should match polygon_address_in from step 1
    const valueForwardedCoin = url.searchParams.get('value_forwarded_coin'); // Total forwarded to merchant

    console.log('PayGate callback received:', {
      orderId,
      valueCoin,
      coin,
      txidIn,
      txidOut,
      addressIn,
      valueForwardedCoin,
    });

    if (!orderId) {
      console.error('Missing order_id in callback');
      return new Response('ok', { headers: { 'Content-Type': 'text/plain' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update order status to paid
    const { data, error } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'processing',
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
    } else {
      console.log('Order updated successfully:', data.id, '| value_coin:', valueCoin, '| txid_out:', txidOut);
    }

    // Return plain text response - PayGate expects this to confirm receipt
    return new Response('ok', {
      headers: { 'Content-Type': 'text/plain' },
    });

  } catch (error) {
    console.error('Error in paygate-callback:', error);
    // Return ok anyway to prevent PayGate from retrying
    return new Response('ok', {
      headers: { 'Content-Type': 'text/plain' },
    });
  }
});
