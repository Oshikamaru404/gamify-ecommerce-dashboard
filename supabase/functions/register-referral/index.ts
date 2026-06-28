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

    const { referral_code, cookie_id, device_fingerprint } = await req.json();
    if (!referral_code) return json({ ok: false, error: 'missing_code' }, 400);

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;

    const { data: aff } = await admin.from('affiliates').select('id,user_id,status').eq('referral_code', referral_code).maybeSingle();
    if (!aff || aff.status !== 'active') return json({ ok: false, error: 'invalid_code' }, 404);
    if (aff.user_id === userId) {
      await admin.from('affiliate_fraud_flags').insert({ affiliate_id: aff.id, referred_user_id: userId, reason: 'self_referral_signup', severity: 'high' });
      return json({ ok: false, error: 'self_referral' });
    }

    const { data: existing } = await admin.from('affiliate_referrals').select('id').eq('referred_user_id', userId).maybeSingle();
    if (existing) return json({ ok: true, already: true });

    await admin.from('affiliate_referrals').insert({
      affiliate_id: aff.id, referred_user_id: userId, referral_code,
      cookie_id, device_fingerprint, ip_address: ip, status: 'registered',
    });
    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});

function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
