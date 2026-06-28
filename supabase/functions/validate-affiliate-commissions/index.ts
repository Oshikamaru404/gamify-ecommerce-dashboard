// Scheduled daily — promotes pending commissions to approved (or rejects them).
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const { data: pendings } = await admin
    .from('affiliate_commissions')
    .select('id, affiliate_id, order_id, amount')
    .eq('status', 'pending')
    .lte('validation_available_at', new Date().toISOString());

  let approved = 0, rejected = 0;
  for (const c of pendings ?? []) {
    const { data: order } = await admin.from('orders').select('payment_status,status').eq('id', c.order_id).maybeSingle();
    if (!order) continue;
    if (order.payment_status === 'paid' && order.status !== 'cancelled') {
      await admin.from('affiliate_commissions').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', c.id);
      await admin.rpc('increment_affiliate_totals', { p_affiliate_id: c.affiliate_id, p_pending_delta: -Number(c.amount), p_approved_delta: Number(c.amount) }).catch(async () => {
        // fallback if RPC missing
        const { data: a } = await admin.from('affiliates').select('total_pending,total_approved').eq('id', c.affiliate_id).single();
        await admin.from('affiliates').update({
          total_pending: Math.max(0, Number(a?.total_pending ?? 0) - Number(c.amount)),
          total_approved: Number(a?.total_approved ?? 0) + Number(c.amount),
        }).eq('id', c.affiliate_id);
      });
      approved++;
    } else {
      await admin.from('affiliate_commissions').update({ status: 'rejected', rejected_at: new Date().toISOString(), rejection_reason: 'order_not_valid' }).eq('id', c.id);
      const { data: a } = await admin.from('affiliates').select('total_pending').eq('id', c.affiliate_id).single();
      await admin.from('affiliates').update({ total_pending: Math.max(0, Number(a?.total_pending ?? 0) - Number(c.amount)) }).eq('id', c.affiliate_id);
      rejected++;
    }
  }
  return new Response(JSON.stringify({ ok: true, approved, rejected }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
