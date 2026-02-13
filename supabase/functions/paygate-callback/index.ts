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
    // PayGate sends a GET request with callback parameters
    const url = new URL(req.url);
    const orderId = url.searchParams.get('order_id');
    const valueCoin = url.searchParams.get('value_coin');
    const coin = url.searchParams.get('coin');
    const txidIn = url.searchParams.get('txid_in');

    console.log('PayGate callback received:', { orderId, valueCoin, coin, txidIn });

    if (!orderId) {
      throw new Error('Missing order_id in callback');
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
        customer_whatsapp: undefined, // We'll append payment info
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      // Still return ok to prevent PayGate from retrying
    } else {
      console.log('Order updated successfully:', data);

      // Store payment details by updating the order with transaction info
      const paymentInfo = `paygate:${valueCoin || ''}:${coin || ''}:${txidIn || ''}`;
      
      // Get existing whatsapp value to append
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('customer_whatsapp')
        .eq('id', orderId)
        .single();

      const existingWhatsapp = existingOrder?.customer_whatsapp || '';
      const updatedWhatsapp = existingWhatsapp ? `${existingWhatsapp}|${paymentInfo}` : paymentInfo;

      await supabase
        .from('orders')
        .update({ customer_whatsapp: updatedWhatsapp })
        .eq('id', orderId);
    }

    // PayGate expects a plain text "ok" response to confirm receipt
    return new Response('ok', {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });

  } catch (error) {
    console.error('Error in paygate-callback:', error);
    // Return ok anyway to prevent retries
    return new Response('ok', {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }
});
