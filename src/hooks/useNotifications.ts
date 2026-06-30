import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserAuth } from '@/contexts/UserAuthContext';

export interface AppNotification {
  id: string;
  user_id: string;
  type: string;
  category: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  title: string;
  body: string | null;
  link: string | null;
  icon: string | null;
  metadata: Record<string, any>;
  read_at: string | null;
  archived_at: string | null;
  created_at: string;
}

export type NotificationFilter = 'all' | 'unread' | 'read' | 'archived';

export function useNotifications(opts: { limit?: number } = {}) {
  const { user } = useUserAuth();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const limit = opts.limit ?? 50;

  const load = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('notifications' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    setItems(((data || []) as unknown) as AppNotification[]);
    setLoading(false);
  }, [user, limit]);

  useEffect(() => {
    load();
    if (!user) return;
    const channel = supabase
      .channel(`notif-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, load]);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read_at && !n.archived_at).length,
    [items],
  );

  const markRead = useCallback(async (id: string) => {
    await supabase
      .from('notifications' as any)
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);
  }, []);

  const markAllRead = useCallback(async () => {
    if (!user) return;
    await supabase
      .from('notifications' as any)
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .is('read_at', null);
  }, [user]);

  const archive = useCallback(async (id: string) => {
    await supabase
      .from('notifications' as any)
      .update({ archived_at: new Date().toISOString() })
      .eq('id', id);
  }, []);

  const unarchive = useCallback(async (id: string) => {
    await supabase
      .from('notifications' as any)
      .update({ archived_at: null })
      .eq('id', id);
  }, []);

  return { items, loading, unreadCount, markRead, markAllRead, archive, unarchive, refresh: load };
}
