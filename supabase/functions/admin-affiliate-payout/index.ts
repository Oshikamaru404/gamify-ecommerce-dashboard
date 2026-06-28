import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const auth = req.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) return json({ ok: false, error: 'unauthorized' }, 401);
    const pub = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: auth } },
    });
    const { data: claims } = await pub.auth.getClaims(auth.replace('Bearer ', ''));
    const userId = claims?.claims?.sub;
    if (!userId) return json({ ok: false, error: 'unauthorized' }, 401);

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: isAdmin } = await admin.from('admin_users').select('id').eq('user_id', userId).maybeSingle();
    if (!isAdmin) return json({ ok: false, error: 'forbidden' }, 403);

    const { affiliate_id, commission_ids, payout_method, payout_reference, admin_note, mark_paid } = await req.json();
    if (!affiliate_id || !commission_ids?.length) return json({ ok: false, error: 'missing_fields' }, 400);

    const { data: rows } = await admin
      .from('affiliate_commissions')
      .select('id, amount, currency, status, affiliate_id')
      .in('id', commission_ids);
    const valid = (rows ?? []).filter((r) => r.affiliate_id === affiliate_id && r.status === 'approved');
    if (!valid.length) return json({ ok: false, error: 'no_approved_commissions' }, 400);

    const total = valid.reduce((s, r) => s + Number(r.amount), 0);
    const currency = valid[0].currency;

    const { data: payout, error: pErr } = await admin.from('affiliate_payouts').insert({
      affiliate_id, amount: total, currency,
      status: mark_paid ? 'paid' : 'processing',
      payout_method, payout_reference, admin_note,
      paid_at: mark_paid ? new Date().toISOString() : null,
    }).select().single();
    if (pErr) return json({ ok: false, error: pErr.message }, 500);

    await admin.from('affiliate_commissions').update({
      status: mark_paid ? 'paid' : 'approved',
      paid_at: mark_paid ? new Date().toISOString() : null,
      payout_id: payout.id,
    }).in('id', valid.map((v) => v.id));

    if (mark_paid) {
      const { data: a } = await admin.from('affiliates').select('total_approved,total_paid').eq('id', affiliate_id).single();
      await admin.from('affiliates').update({
        total_approved: Math.max(0, Number(a?.total_approved ?? 0) - total),
        total_paid: Number(a?.total_paid ?? 0) + total,
      }).eq('id', affiliate_id);
    }

    return json({ ok: true, payout });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});

function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
