
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sendPaymentEmails(supabaseUrl: string, serviceKey: string, order: any, paymentMethod: string, txHash?: string) {
  const shortId = String(order.id).slice(0, 8).toUpperCase();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${serviceKey}`,
    apikey: serviceKey,
  };
  const calls: Promise<any>[] = [];
  if (order.customer_email) {
    calls.push(fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: 'POST', headers,
      body: JSON.stringify({
        templateName: 'payment-confirmed',
        recipientEmail: order.customer_email,
        idempotencyKey: `payment-confirmed-${order.id}`,
        templateData: { customerName: order.customer_name, orderId: shortId, packageName: order.package_name, amount: order.amount },
      }),
    }).catch((e) => console.warn('client payment email failed', e)));
  }
  calls.push(fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
    method: 'POST', headers,
    body: JSON.stringify({
      templateName: 'admin-payment-received',
      recipientEmail: 'bwivox@gmail.com',
      idempotencyKey: `admin-payment-${order.id}`,
      templateData: {
        orderId: shortId, customerName: order.customer_name, customerEmail: order.customer_email,
        packageName: order.package_name, amount: order.amount, paymentMethod, txHash,
      },
    }),
  }).catch((e) => console.warn('admin payment email failed', e)));
  await Promise.all(calls);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookData = await req.json();
    console.log('Received Cryptomus webhook:', webhookData);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceKey)

    const { uuid, order_id, payment_status, status, txid } = webhookData;

    if (!uuid && !order_id) {
      throw new Error('Missing UUID or order_id in webhook data');
    }

    let query = supabase.from('orders').select('*');
    if (order_id) query = query.eq('id', order_id);
    else if (uuid) query = query.like('customer_whatsapp', `%cryptomus:${uuid}%`);

    const { data: orders, error: fetchError } = await query.single();
    if (fetchError) {
      console.error('Error finding order:', fetchError);
      throw new Error('Order not found');
    }

    let newStatus = 'pending';
    let newPaymentStatus = 'pending';
    if (payment_status === 'paid' && status === 'paid') {
      newStatus = 'processing';
      newPaymentStatus = 'paid';
    } else if (payment_status === 'cancel' || payment_status === 'fail') {
      newStatus = 'cancelled';
      newPaymentStatus = 'failed';
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        payment_status: newPaymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orders.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      throw updateError;
    }

    console.log(`Order ${orders.id} updated: payment_status=${newPaymentStatus}, status=${newStatus}`);

    if (newPaymentStatus === 'paid' && updatedOrder) {
      await sendPaymentEmails(supabaseUrl, serviceKey, updatedOrder, 'Crypto (Cryptomus)', txid);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in cryptomus-webhook function:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message, success: false }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
