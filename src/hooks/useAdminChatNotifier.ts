import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Admin-side chat notifier:
 *  - Tracks total unread admin messages (badge)
 *  - Plays a sound + fires a browser Notification when a new user message arrives
 *  - Uses the Web Notifications API only (works whenever the browser is running
 *    and the admin tab has been opened at least once this session — no service worker)
 */
export function useAdminChatNotifier() {
  const [unread, setUnread] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastNotifiedRef = useRef<Set<string>>(new Set());

  // Ask permission once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      // Request on first user interaction to avoid browser blocking
      const handler = () => {
        Notification.requestPermission().catch(() => {});
        window.removeEventListener('click', handler);
      };
      window.addEventListener('click', handler, { once: true });
      return () => window.removeEventListener('click', handler);
    }
  }, []);

  const playBeep = useCallback(() => {
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AC();
      const ctx = audioCtxRef.current!;
      const now = ctx.currentTime;
      const beep = (freq: number, start: number, dur: number) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, now + start);
        g.gain.exponentialRampToValueAtTime(0.25, now + start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
        o.connect(g).connect(ctx.destination);
        o.start(now + start);
        o.stop(now + start + dur + 0.02);
      };
      beep(880, 0, 0.15);
      beep(1320, 0.16, 0.18);
    } catch {}
  }, []);

  const showNotification = useCallback((title: string, body: string, tag: string) => {
    try {
      if (!('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;
      const n = new Notification(title, {
        body,
        tag,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
      n.onclick = () => {
        window.focus();
        window.location.href = '/diza/chat';
        n.close();
      };
    } catch {}
  }, []);

  // Load initial unread count
  const refreshUnread = useCallback(async () => {
    const { data } = await (supabase as any)
      .from('chat_conversations')
      .select('unread_admin')
      .eq('archived', false);
    const total = (data || []).reduce((s: number, r: any) => s + (r.unread_admin || 0), 0);
    setUnread(total);
  }, []);

  useEffect(() => {
    refreshUnread();

    // Realtime: any new user message → notify + refresh count
    const msgChannel = supabase
      .channel(`admin-chat-notifier-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        async (payload) => {
          const m: any = payload.new;
          if (m.sender_type !== 'user') return;
          if (lastNotifiedRef.current.has(m.id)) return;
          lastNotifiedRef.current.add(m.id);
          // Focus-aware: sound + notif even if the admin is browsing another admin page
          playBeep();
          const senderName = m.sender_name || 'Customer';
          showNotification(
            `New chat message from ${senderName}`,
            String(m.content || '').slice(0, 140),
            `chat-${m.conversation_id}`,
          );
          refreshUnread();
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_conversations' },
        () => refreshUnread(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(msgChannel);
    };
  }, [playBeep, showNotification, refreshUnread]);

  return { unread };
}
