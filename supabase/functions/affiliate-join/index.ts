import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function genCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

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
    const { data: existing } = await admin.from('affiliates').select('*').eq('user_id', userId).maybeSingle();
    if (existing) return json({ ok: true, affiliate: existing });

    // unique code
    let code = genCode();
    for (let i = 0; i < 5; i++) {
      const { data } = await admin.from('affiliates').select('id').eq('referral_code', code).maybeSingle();
      if (!data) break;
      code = genCode();
    }

    const { data: created, error } = await admin.from('affiliates').insert({
      user_id: userId, referral_code: code, status: 'active',
      commission_type: 'percentage', commission_value: 10,
    }).select().single();
    if (error) return json({ ok: false, error: error.message }, 500);

    return json({ ok: true, affiliate: created });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});

function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
