import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const TOKEN_KEY = 'bwivox_chat_token';
const CONV_KEY = 'bwivox_chat_conv';

function uniqueRealtimeChannelName(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: 'user' | 'admin' | 'system';
  sender_name: string | null;
  content: string;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string | null;
  guest_name: string | null;
  guest_email: string;
  guest_token: string;
  display_name: string | null;
  category: string;
  subcategory: string | null;
  priority: string;
  status: string;
  tags: string[];
  admin_notes: string | null;
  unread_admin: number;
  unread_user: number;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  conversation_type?: string;
  assigned_admin_id?: string | null;
  color?: string | null;
  emoji?: string | null;
  pinned?: boolean;
  archived?: boolean;
  muted?: boolean;
  internal_notes?: string | null;
  last_seen_user_at?: string | null;
  last_seen_admin_at?: string | null;
  typing_user_at?: string | null;
  typing_admin_at?: string | null;
}

export function getStoredChatToken() {
  return {
    token: localStorage.getItem(TOKEN_KEY),
    convId: localStorage.getItem(CONV_KEY),
  };
}

export function storeChatToken(convId: string, token: string) {
  localStorage.setItem(CONV_KEY, convId);
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearChatToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CONV_KEY);
}

export function useConversationMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);

    supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages((data || []) as ChatMessage[]);
        setLoading(false);
      });

    const channel = supabase
      .channel(uniqueRealtimeChannelName(`chat-msg-${conversationId}`))
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === (payload.new as any).id)) return prev;
            return [...prev, payload.new as ChatMessage];
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return { messages, loading };
}

export function useConversation(conversationId: string | null) {
  const [conv, setConv] = useState<ChatConversation | null>(null);

  const refresh = useCallback(async () => {
    if (!conversationId) return;
    const { data } = await supabase.from('chat_conversations').select('*').eq('id', conversationId).maybeSingle();
    setConv(data as ChatConversation | null);
  }, [conversationId]);

  useEffect(() => {
    refresh();
    if (!conversationId) return;
    const channel = supabase
      .channel(uniqueRealtimeChannelName(`chat-conv-${conversationId}`))
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_conversations', filter: `id=eq.${conversationId}` },
        (payload) => setConv(payload.new as ChatConversation)
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversationId, refresh]);

  return { conversation: conv, refresh };
}

export async function sendChatMessage(params: {
  conversationId: string;
  senderType: 'user' | 'admin';
  senderName: string;
  content: string;
}) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: params.conversationId,
      sender_type: params.senderType,
      sender_name: params.senderName,
      content: params.content,
    })
    .select()
    .single();
  if (error) throw error;

  // Fire-and-forget notification
  supabase.functions
    .invoke('send-chat-notification', {
      body: { conversation_id: params.conversationId, message_id: data.id },
    })
    .catch((e) => console.warn('notify failed', e));

  return data;
}

export async function createConversation(params: {
  userId: string | null;
  guestName: string;
  guestEmail: string;
  category: string;
  subcategory: string | null;
  priority: string;
  firstMessage: string;
  conversationType?: 'support' | 'general_room';
}) {
  const insertRow: any = {
    user_id: params.userId,
    guest_name: params.guestName,
    guest_email: params.guestEmail,
    category: params.category,
    subcategory: params.subcategory,
    priority: params.priority,
    status: 'open',
    conversation_type: params.conversationType || 'support',
  };
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert(insertRow)
    .select()
    .single();
  if (error) throw error;

  storeChatToken(data.id, data.guest_token);

  await sendChatMessage({
    conversationId: data.id,
    senderType: 'user',
    senderName: params.guestName,
    content: params.firstMessage,
  });

  return data as ChatConversation;
}

export async function findOrCreateGeneralRoom(params: {
  userId: string;
  displayName: string;
  email: string;
}) {
  // Reuse existing general_room for this user if any
  const { data: existing } = await (supabase as any)
    .from('chat_conversations')
    .select('*')
    .eq('user_id', params.userId)
    .eq('conversation_type', 'general_room')
    .order('last_message_at', { ascending: false })
    .limit(1);
  if (existing && existing.length > 0) {
    const conv = existing[0] as any as ChatConversation;
    if (conv.guest_token) storeChatToken(conv.id, conv.guest_token);
    return conv;
  }
  const insertRow: any = {
    user_id: params.userId,
    guest_name: params.displayName,
    guest_email: params.email,
    category: 'general_room',
    subcategory: null,
    priority: 'medium',
    status: 'open',
    conversation_type: 'general_room',
    display_name: params.displayName,
  };
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert(insertRow)
    .select()
    .single();
  if (error) throw error;
  storeChatToken(data.id, data.guest_token);
  return data as ChatConversation;
}

