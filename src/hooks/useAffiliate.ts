import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserAuth } from '@/contexts/UserAuthContext';

export interface AffiliateRow {
  id: string;
  user_id: string;
  referral_code: string;
  default_coupon_id: string | null;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  commission_type: 'percentage' | 'fixed';
  commission_value: number;
  total_pending: number;
  total_approved: number;
  total_paid: number;
}

export function useAffiliate() {
  const { user } = useUserAuth();
  const [affiliate, setAffiliate] = useState<AffiliateRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ clicks: 0, referrals: 0, converted: 0 });
  const [commissions, setCommissions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const { data: aff } = await supabase.from('affiliates').select('*').eq('user_id', user.id).maybeSingle();
    setAffiliate(aff as AffiliateRow | null);
    if (aff) {
      const [clicks, refs, conv, comms, pays] = await Promise.all([
        supabase.from('affiliate_referral_clicks').select('id', { count: 'exact', head: true }).eq('affiliate_id', aff.id),
        supabase.from('affiliate_referrals').select('id', { count: 'exact', head: true }).eq('affiliate_id', aff.id),
        supabase.from('affiliate_referrals').select('id', { count: 'exact', head: true }).eq('affiliate_id', aff.id).eq('status', 'converted'),
        supabase.from('affiliate_commissions').select('*').eq('affiliate_id', aff.id).order('created_at', { ascending: false }).limit(50),
        supabase.from('affiliate_payouts').select('*').eq('affiliate_id', aff.id).order('created_at', { ascending: false }).limit(20),
      ]);
      setStats({ clicks: clicks.count ?? 0, referrals: refs.count ?? 0, converted: conv.count ?? 0 });
      setCommissions(comms.data ?? []);
      setPayouts(pays.data ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const join = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke<{ ok: boolean; affiliate?: AffiliateRow; error?: string }>('affiliate-join', { body: {} });
    if (error) throw new Error(error.message);
    if (!data?.ok || !data.affiliate) throw new Error(data?.error ?? 'failed');
    setAffiliate(data.affiliate);
    await load();
    return data.affiliate;
  }, [load]);

  return { affiliate, loading, stats, commissions, payouts, join, reload: load };
}
