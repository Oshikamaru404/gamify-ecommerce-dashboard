import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserAuth } from '@/contexts/UserAuthContext';

export interface UserOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_whatsapp?: string | null;
  package_id?: string | null;
  package_name: string;
  package_category: string;
  duration_months: number;
  order_type: string;
  amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at?: string | null;
  m3u_url?: string | null;
  xtream_host?: string | null;
  xtream_port?: string | null;
  xtream_username?: string | null;
  xtream_password?: string | null;
  credentials_expiration?: string | null;
  credentials_notes?: string | null;
  credentials_delivered_at?: string | null;
}

export function useUserOrders() {
  const { user } = useUserAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.email) { setOrders([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', user.email)
      .order('created_at', { ascending: false });
    if (!error && data) setOrders(data as UserOrder[]);
    setLoading(false);
  }, [user?.email]);

  useEffect(() => { refresh(); }, [refresh]);

  return { orders, loading, refresh };
}

export function computeSubscriptionStatus(o: UserOrder): {
  expiresAt: Date | null;
  daysLeft: number | null;
  state: 'active' | 'expiring' | 'expired' | 'pending';
} {
  if (o.status !== 'completed' && o.payment_status !== 'paid' && !o.credentials_delivered_at) {
    return { expiresAt: null, daysLeft: null, state: 'pending' };
  }
  const start = o.credentials_delivered_at ? new Date(o.credentials_delivered_at) : new Date(o.created_at);
  const expires = new Date(start);
  expires.setMonth(expires.getMonth() + (o.duration_months || 1));
  const days = Math.ceil((expires.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  let state: 'active' | 'expiring' | 'expired' = 'active';
  if (days < 0) state = 'expired';
  else if (days <= 7) state = 'expiring';
  return { expiresAt: expires, daysLeft: days, state };
}
