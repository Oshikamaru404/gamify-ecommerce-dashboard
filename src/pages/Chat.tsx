import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  findOrCreateGeneralRoom,
  sendChatMessage,
  useConversation,
  useConversationMessages,
  getStoredChatToken,
} from '@/hooks/useChat';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Send, LogIn, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Chat: React.FC = () => {
  const { user, profile } = useUserAuth();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('token');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Auto-open (or create) the single general room
  useEffect(() => {
    (async () => {
      // Resume by explicit token param
      if (tokenParam) {
        const { data } = await supabase
          .from('chat_conversations')
          .select('id')
          .eq('guest_token', tokenParam)
          .maybeSingle();
        if (data?.id) {
          setConversationId(data.id);
          setInitializing(false);
          return;
        }
      }

      if (!user) {
        setInitializing(false);
        return;
      }

      try {
        const conv = await findOrCreateGeneralRoom({
          userId: user.id,
          displayName: profile?.display_name || user.email?.split('@')[0] || 'Customer',
          email: profile?.email || user.email || '',
        });
        setConversationId(conv.id);
      } catch (e: any) {
        toast.error(e.message || 'Could not open chat');
      } finally {
        setInitializing(false);
      }
    })();
  }, [tokenParam, user, profile]);

  return (
    <StoreLayout hideHeader hideFooter fullScreen>
      <Helmet>
        <title>Chat — BWIVOX</title>
        <meta name="description" content="Private chat with BWIVOX support." />
      </Helmet>
      <div className="h-full w-full">
        {initializing ? (
          <div className="h-full w-full flex items-center justify-center bg-muted/30">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : !user && !conversationId ? (
          <div className="h-full w-full flex items-center justify-center p-4 bg-muted/30">
            <Card className="p-8 text-center space-y-4 max-w-md w-full">
              <h1 className="text-xl font-bold">Sign in to chat</h1>
              <p className="text-sm text-muted-foreground">
                Chat is a private conversation between you and our team. Please sign in to continue.
              </p>
              <Button asChild>
                <Link to="/account"><LogIn className="h-4 w-4 mr-2" /> Sign in</Link>
              </Button>
            </Card>
          </div>
        ) : conversationId ? (
          <ChatRoom conversationId={conversationId} />
        ) : null}
      </div>
    </StoreLayout>
  );
};

const ChatRoom: React.FC<{ conversationId: string }> = ({ conversationId }) => {
  const navigate = useNavigate();
  const { conversation } = useConversation(conversationId);
  const { messages } = useConversationMessages(conversationId);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!conversation) return;
    const patch: any = { last_seen_user_at: new Date().toISOString() };
    if (conversation.unread_user > 0) patch.unread_user = 0;
    (supabase.from('chat_conversations') as any).update(patch).eq('id', conversation.id).then(() => {});
    const unreadIds = messages.filter((m) => m.sender_type === 'admin' && !(m as any).read_at).map((m) => m.id);
    if (unreadIds.length > 0) {
      (supabase.from('chat_messages') as any)
        .update({ read_at: new Date().toISOString() })
        .in('id', unreadIds)
        .then(() => {});
    }
  }, [conversation?.id, conversation?.unread_user, messages.length]);

  const typingTimeout = useRef<any>(null);
  function handleTyping(v: string) {
    setText(v);
    if (!conversation) return;
    if (typingTimeout.current) return;
    (supabase.from('chat_conversations') as any)
      .update({ typing_user_at: new Date().toISOString() })
      .eq('id', conversation.id)
      .then(() => {});
    typingTimeout.current = setTimeout(() => { typingTimeout.current = null; }, 2000);
  }

  const adminTyping = conversation?.typing_admin_at &&
    Date.now() - new Date(conversation.typing_admin_at).getTime() < 5000;
  const adminOnline = conversation?.last_seen_admin_at &&
    Date.now() - new Date(conversation.last_seen_admin_at).getTime() < 60_000;

  async function send() {
    if (!text.trim() || !conversation) return;
    setSending(true);
    try {
      await sendChatMessage({
        conversationId: conversation.id,
        senderType: 'user',
        senderName: conversation.guest_name || 'Customer',
        content: text.trim(),
      });
      setText('');
      taRef.current?.focus();
    } catch (e: any) {
      toast.error(e.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  }

  function copyMessage(content: string) {
    navigator.clipboard.writeText(content);
    toast.success('Copied');
  }

  function insertEmoji(emoji: string) {
    setText((prev) => prev + emoji);
    setShowEmoji(false);
    taRef.current?.focus();
  }

  if (!conversation) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-6.5rem)] overflow-hidden">
      <div className="border-b p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <div>
            <div className="font-semibold text-sm">Chat with BWIVOX</div>
            <div className={`text-[11px] inline-flex items-center gap-1 ${adminOnline ? 'text-emerald-600' : 'text-muted-foreground'}`}>
              <span className={`h-2 w-2 rounded-full ${adminOnline ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              {adminOnline ? 'Support online' : 'Offline — we reply by email too'}
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/30">
        {messages.map((m) => {
          const isMine = m.sender_type === 'user';
          const readAt = (m as any).read_at as string | null;
          return (
            <div key={m.id} className={`group flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap relative ${
                isMine
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : m.sender_type === 'system'
                  ? 'bg-muted text-muted-foreground text-xs italic'
                  : 'bg-card border rounded-bl-sm'
              }`}>
                {!isMine && m.sender_name && (
                  <div className="text-xs font-semibold mb-0.5 opacity-70">{m.sender_name}</div>
                )}
                {m.content}
                <div className="flex items-center gap-1.5 text-[10px] opacity-60 mt-1">
                  <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMine && (
                    <span title={readAt ? 'Seen' : 'Delivered'}>
                      {readAt ? '✓✓' : '✓'}
                    </span>
                  )}
                  <button
                    onClick={() => copyMessage(m.content)}
                    className="opacity-0 group-hover:opacity-100 ml-1 hover:underline"
                  >copy</button>
                </div>
              </div>
            </div>
          );
        })}
        {adminTyping && (
          <div className="flex justify-start">
            <div className="bg-card border rounded-2xl rounded-bl-sm px-3 py-2 text-xs text-muted-foreground italic">
              Support is typing…
            </div>
          </div>
        )}
        {messages.length === 0 && (
          <div className="text-center text-xs text-muted-foreground py-6">
            Say hi 👋 — we'll get back to you shortly.
          </div>
        )}
      </div>

      <div className="border-t p-3">
        {showEmoji && (
          <div className="flex flex-wrap gap-1 mb-2 p-2 rounded border bg-muted/40">
            {['😀','😅','😂','😍','🙏','👍','👌','🔥','❤️','🎉','😎','🤔','😢','✨','💪','📺','📱','💳','✅','⚠️'].map((e) => (
              <button key={e} onClick={() => insertEmoji(e)} className="text-xl hover:scale-125 transition">{e}</button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="icon" onClick={() => setShowEmoji((v) => !v)} className="shrink-0">
            😊
          </Button>
          <Textarea
            ref={taRef}
            value={text}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type your message…"
            rows={1}
            className="resize-none min-h-[40px] max-h-32"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            disabled={conversation.status === 'closed'}
          />
          <Button onClick={send} disabled={sending || !text.trim() || conversation.status === 'closed'}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Chat;
