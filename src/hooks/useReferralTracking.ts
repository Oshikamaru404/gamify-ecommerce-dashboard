import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { persistReferral, getReferralCode, getReferralCookieId, getDeviceFingerprint } from '@/lib/affiliate';

export function useReferralTracking() {
  const [params] = useSearchParams();
  useEffect(() => {
    const ref = params.get('ref');
    if (ref) persistReferral(ref);
    const code = ref || getReferralCode();
    if (!code) return;
    const cookieId = getReferralCookieId();
    const fp = getDeviceFingerprint();
    // fire-and-forget
    supabase.functions.invoke('track-referral-click', {
      body: {
        referral_code: code,
        cookie_id: cookieId,
        device_fingerprint: fp,
        landing_page: typeof window !== 'undefined' ? window.location.pathname : null,
      },
    }).catch(() => { /* noop */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.get('ref')]);
}
