import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface Body {
  code: string;
  product_type?: string;
  product_id?: string;
  order_amount: number;
  currency?: string;
  device_fingerprint?: string;
  cookie_id?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const body: Body = await req.json();
    if (!body.code || typeof body.order_amount !== 'number') {
      return json({ valid: false, error: 'invalid_input' }, 400);
    }
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // resolve user (optional)
    let userId: string | null = null;
    const auth = req.headers.get('Authorization');
    if (auth?.startsWith('Bearer ')) {
      const pub = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
        global: { headers: { Authorization: auth } },
      });
      const { data } = await pub.auth.getClaims(auth.replace('Bearer ', ''));
      userId = data?.claims?.sub ?? null;
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
    const ua = req.headers.get('user-agent') ?? null;
    const code = body.code.trim().toUpperCase();

    const log = async (success: boolean, reason: string | null, coupon_id: string | null) => {
      await admin.from('coupon_usage_attempts').insert({
        coupon_id, user_id: userId, code, success, failure_reason: reason,
        ip_address: ip, user_agent: ua,
        device_fingerprint: body.device_fingerprint ?? null,
        cookie_id: body.cookie_id ?? null,
      });
    };

    const { data: coupon, error } = await admin
      .from('coupons').select('*').ilike('code', code).maybeSingle();
    if (error || !coupon) { await log(false, 'not_found', null); return json({ valid: false, error: 'Coupon not found' }); }

    if (coupon.status !== 'active') { await log(false, 'inactive', coupon.id); return json({ valid: false, error: 'Coupon inactive' }); }
    const now = new Date();
    if (coupon.starts_at && new Date(coupon.starts_at) > now) { await log(false, 'not_started', coupon.id); return json({ valid: false, error: 'Coupon not yet valid' }); }
    if (coupon.expires_at && new Date(coupon.expires_at) < now) { await log(false, 'expired', coupon.id); return json({ valid: false, error: 'Coupon expired' }); }

    if (body.product_type && coupon.applicable_product_types?.length && !coupon.applicable_product_types.includes(body.product_type)) {
      await log(false, 'product_type_mismatch', coupon.id); return json({ valid: false, error: 'Not applicable to this product' });
    }
    if (body.product_id && coupon.excluded_product_ids?.includes(body.product_id)) {
      await log(false, 'excluded_product', coupon.id); return json({ valid: false, error: 'Not applicable to this product' });
    }
    if (body.product_id && coupon.applicable_product_ids?.length && !coupon.applicable_product_ids.includes(body.product_id)) {
      await log(false, 'product_id_mismatch', coupon.id); return json({ valid: false, error: 'Not applicable to this product' });
    }
    if (coupon.minimum_order_amount && body.order_amount < Number(coupon.minimum_order_amount)) {
      await log(false, 'min_amount', coupon.id); return json({ valid: false, error: `Minimum order ${coupon.minimum_order_amount} required` });
    }
    if (coupon.max_total_uses && coupon.total_uses >= coupon.max_total_uses) {
      await log(false, 'max_total', coupon.id); return json({ valid: false, error: 'Coupon usage limit reached' });
    }
    if (userId) {
      if (coupon.excluded_user_ids?.includes(userId)) { await log(false, 'excluded_user', coupon.id); return json({ valid: false, error: 'Not eligible' }); }
      if (coupon.allowed_user_ids?.length && !coupon.allowed_user_ids.includes(userId)) { await log(false, 'not_allowed_user', coupon.id); return json({ valid: false, error: 'Not eligible' }); }
      if (coupon.max_uses_per_user) {
        const { count } = await admin.from('coupon_redemptions').select('id', { count: 'exact', head: true }).eq('coupon_id', coupon.id).eq('user_id', userId);
        if ((count ?? 0) >= coupon.max_uses_per_user) { await log(false, 'max_per_user', coupon.id); return json({ valid: false, error: 'You already used this coupon' }); }
      }
      // affiliate self-use
      if (coupon.linked_affiliate_id) {
        const { data: aff } = await admin.from('affiliates').select('user_id').eq('id', coupon.linked_affiliate_id).maybeSingle();
        if (aff?.user_id === userId) { await log(false, 'self_affiliate_use', coupon.id); return json({ valid: false, error: 'You cannot use your own affiliate coupon' }); }
      }
    }
    if (coupon.max_uses_per_device && body.device_fingerprint) {
      const { count } = await admin.from('coupon_redemptions').select('id', { count: 'exact', head: true }).eq('coupon_id', coupon.id).eq('device_fingerprint', body.device_fingerprint);
      if ((count ?? 0) >= coupon.max_uses_per_device) { await log(false, 'max_per_device', coupon.id); return json({ valid: false, error: 'Device limit reached' }); }
    }

    // compute discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') discount = body.order_amount * (Number(coupon.discount_value) / 100);
    else discount = Number(coupon.discount_value);
    discount = Math.min(discount, body.order_amount);
    discount = Math.round(discount * 100) / 100;
    const final = Math.round((body.order_amount - discount) * 100) / 100;

    await log(true, null, coupon.id);

    return json({
      valid: true,
      coupon: {
        id: coupon.id, code: coupon.code, name: coupon.name,
        discount_type: coupon.discount_type, discount_value: coupon.discount_value,
        linked_affiliate_id: coupon.linked_affiliate_id,
      },
      original_amount: body.order_amount,
      discount_amount: discount,
      final_amount: final,
    });
  } catch (e) {
    return json({ valid: false, error: (e as Error).message }, 500);
  }
});

function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
