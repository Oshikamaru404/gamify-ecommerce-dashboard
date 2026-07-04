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

function uniqueRealtimeChannelName(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useNotifications(opts: { limit?: number; excludeCategories?: string[]; onlyCategories?: string[] } = {}) {
  const { user } = useUserAuth();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const limit = opts.limit ?? 50;
  const excludeCategories = opts.excludeCategories;
  const onlyCategories = opts.onlyCategories;

  const load = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    let query = supabase
      .from('notifications' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (onlyCategories && onlyCategories.length > 0) {
      query = query.in('category', onlyCategories);
    }
    const { data } = await query;
    let rows = ((data || []) as unknown) as AppNotification[];
    if (excludeCategories && excludeCategories.length > 0) {
      rows = rows.filter((n) => !excludeCategories.includes(n.category));
    }
    setItems(rows);
    setLoading(false);
  }, [user, limit, excludeCategories?.join(','), onlyCategories?.join(',')]);

  useEffect(() => {
    load();
    if (!user) return;
    const channel = supabase
      .channel(uniqueRealtimeChannelName(`notif-${user.id}`))
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
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
