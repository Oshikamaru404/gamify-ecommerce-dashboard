import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { referral_code, cookie_id, device_fingerprint, landing_page } = await req.json();
    if (!referral_code || !cookie_id) return json({ ok: false, error: 'missing_fields' }, 400);

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
    const ua = req.headers.get('user-agent') ?? null;

    const { data: aff } = await admin.from('affiliates').select('id,status').eq('referral_code', referral_code).maybeSingle();
    if (!aff || aff.status !== 'active') return json({ ok: false, error: 'invalid_code' }, 404);

    await admin.from('affiliate_referral_clicks').insert({
      affiliate_id: aff.id, referral_code, ip_address: ip, user_agent: ua,
      device_fingerprint, cookie_id, landing_page,
    });
    return json({ ok: true, affiliate_id: aff.id });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});

function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
