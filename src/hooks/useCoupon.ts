import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getDeviceFingerprint, getReferralCookieId } from '@/lib/affiliate';
import type { ValidateCouponResponse } from '@/lib/coupons';

export interface AppliedCoupon {
  id: string;
  code: string;
  discount_amount: number;
  original_amount: number;
  final_amount: number;
  linked_affiliate_id: string | null;
}

export function useCoupon() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState<AppliedCoupon | null>(null);

  const apply = useCallback(async (code: string, amount: number, product_type?: string, product_id?: string) => {
    setLoading(true); setError(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke<ValidateCouponResponse>('validate-coupon', {
        body: {
          code, order_amount: amount, product_type, product_id,
          device_fingerprint: getDeviceFingerprint(),
          cookie_id: getReferralCookieId(),
        },
      });
      if (fnErr) throw new Error(fnErr.message);
      if (!data?.valid || !data.coupon) { setError(data?.error ?? 'Invalid coupon'); setApplied(null); return null; }
      const a: AppliedCoupon = {
        id: data.coupon.id,
        code: data.coupon.code,
        discount_amount: data.discount_amount ?? 0,
        original_amount: data.original_amount ?? amount,
        final_amount: data.final_amount ?? amount,
        linked_affiliate_id: data.coupon.linked_affiliate_id,
      };
      setApplied(a);
      return a;
    } catch (e) {
      setError((e as Error).message); setApplied(null); return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => { setApplied(null); setError(null); }, []);

  return { loading, error, applied, apply, clear };
}
