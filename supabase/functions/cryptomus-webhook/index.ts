
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookData = await req.json();
    console.log('Received Cryptomus webhook:', webhookData);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { uuid, order_id, payment_status, status } = webhookData;
    
    if (!uuid && !order_id) {
      throw new Error('Missing UUID or order_id in webhook data');
    }
    
    // Find the order in our database
    let query = supabase.from('orders').select('*');
    
    if (order_id) {
      query = query.eq('id', order_id);
    } else if (uuid) {
      query = query.like('customer_whatsapp', `%cryptomus:${uuid}%`);
    }
    
    const { data: orders, error: fetchError } = await query.single();
    
    if (fetchError) {
      console.error('Error finding order:', fetchError);
      throw new Error('Order not found');
    }
    
    // Update order status based on payment status
    let newStatus = 'pending';
    let newPaymentStatus = 'pending';
    
    if (payment_status === 'paid' && status === 'paid') {
      newStatus = 'processing';
      newPaymentStatus = 'paid';
    } else if (payment_status === 'cancel' || payment_status === 'fail') {
      newStatus = 'cancelled';
      newPaymentStatus = 'failed';
    }
    
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        payment_status: newPaymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orders.id);
    
    if (updateError) {
      console.error('Error updating order:', updateError);
      throw updateError;
    }
    
    console.log(`Order ${orders.id} updated: payment_status=${newPaymentStatus}, status=${newStatus}`);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in cryptomus-webhook function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
