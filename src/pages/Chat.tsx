import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CHAT_CATEGORIES, PRIORITY_META, STATUS_META, getSubcategoryLabel, getCategory } from '@/lib/chatCategories';
import {
  createConversation,
  findOrCreateGeneralRoom,
  sendChatMessage,
  useConversation,
  useConversationMessages,
  getStoredChatToken,
  clearChatToken,
  type ChatConversation,
} from '@/hooks/useChat';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Send, ArrowLeft, LogOut } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

type Step = 'category' | 'subcategory' | 'form' | 'chat';

const Chat: React.FC = () => {
  const { user, profile } = useUserAuth();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('token');
  const quickParam = searchParams.get('quick');

  const [step, setStep] = useState<Step>('category');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string>('');
  const [subcategoryId, setSubcategoryId] = useState<string>('');
  const [name, setName] = useState(profile?.display_name || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [firstMsg, setFirstMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Resume existing conv by token (URL param OR localStorage)
  useEffect(() => {
    (async () => {
      // Quick General Room mode — requires auth, reuse or create the single per-user general_room
      if (quickParam === '1') {
        if (!user) return; // wait for auth
        try {
          const conv = await findOrCreateGeneralRoom({
            userId: user.id,
            displayName: profile?.display_name || user.email?.split('@')[0] || 'Customer',
            email: profile?.email || user.email || '',
          });
          setConversationId(conv.id);
          setStep('chat');
        } catch (e: any) {
          toast.error(e.message || 'Could not open chat');
        }
        return;
      }

      const stored = getStoredChatToken();
      const token = tokenParam || stored.token;
      if (token) {
        const { data } = await supabase
          .from('chat_conversations')
          .select('id')
          .eq('guest_token', token)
          .maybeSingle();
        if (data?.id) {
          setConversationId(data.id);
          setStep('chat');
        }
      }
    })();
  }, [tokenParam, quickParam, user, profile]);

  // Auto-fill from profile when it loads
  useEffect(() => {
    if (profile?.display_name && !name) setName(profile.display_name);
    if ((profile?.email || user?.email) && !email) setEmail(profile?.email || user?.email || '');
  }, [profile, user]);

  const category = getCategory(categoryId);

  async function handleSubmit() {
    if (!name.trim() || !email.trim() || !firstMsg.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      const priority = category?.priority || 'medium';
      const conv = await createConversation({
        userId: user?.id || null,
        guestName: name.trim(),
        guestEmail: email.trim(),
        category: categoryId,
        subcategory: subcategoryId || null,
        priority,
        firstMessage: firstMsg.trim(),
      });
      setConversationId(conv.id);
      setStep('chat');
      toast.success('Conversation started — we will reply shortly');
    } catch (e: any) {
      toast.error(e.message || 'Failed to start conversation');
    } finally {
      setSubmitting(false);
    }
  }

  function handleLeave() {
    clearChatToken();
    setConversationId(null);
    setStep('category');
    setCategoryId('');
    setSubcategoryId('');
    setFirstMsg('');
  }

  return (
    <StoreLayout>
      <Helmet>
        <title>Support Chat — BWIVOX</title>
        <meta name="description" content="Get real-time support from BWIVOX. Choose your topic and chat with our team." />
      </Helmet>
      <div className="container mx-auto max-w-3xl px-4 py-6 sm:py-12">
        {quickParam === '1' && !user ? (
          <Card className="p-8 text-center space-y-3">
            <h1 className="text-xl font-bold">Sign in to open General Room</h1>
            <p className="text-sm text-muted-foreground">
              The General Room is a private one-to-one chat with our team. Sign in to your account to access it.
            </p>
          </Card>
        ) : step === 'chat' && conversationId ? (
          <ChatRoom conversationId={conversationId} onLeave={handleLeave} />
        ) : (
          <Card className="p-5 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Support Chat</h1>
            <p className="text-muted-foreground mb-6 text-sm">
              Choose your topic so we can route you to the right team.
            </p>

            {step === 'category' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CHAT_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCategoryId(c.id);
                      setStep('subcategory');
                    }}
                    className="flex items-start gap-3 p-4 border rounded-lg hover:border-primary hover:bg-accent/30 text-left transition"
                  >
                    <div className="text-2xl">{c.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{c.label}</div>
                      <div className="mt-1">
                        <Badge variant="outline" className={`text-xs ${PRIORITY_META[c.priority].bg} ${PRIORITY_META[c.priority].color} border-0`}>
                          {PRIORITY_META[c.priority].label} priority
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 'subcategory' && category && (
              <div>
                <Button variant="ghost" size="sm" onClick={() => setStep('category')} className="mb-3">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h2 className="text-lg font-semibold">{category.label}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {category.subcategories?.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSubcategoryId(s.id);
                        setStep('form');
                      }}
                      className="text-left px-3 py-2.5 border rounded-md hover:border-primary hover:bg-accent/30 text-sm transition"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <Button variant="link" className="mt-3 px-0" onClick={() => { setSubcategoryId(''); setStep('form'); }}>
                  Skip — none of these
                </Button>
              </div>
            )}

            {step === 'form' && category && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setStep('subcategory')} className="mb-1">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{category.icon} {category.label}</Badge>
                  {subcategoryId && <Badge variant="outline">{getSubcategoryLabel(categoryId, subcategoryId)}</Badge>}
                  <Badge className={`${PRIORITY_META[category.priority].bg} ${PRIORITY_META[category.priority].color} border-0`}>
                    {PRIORITY_META[category.priority].label}
                  </Badge>
                </div>
                <div>
                  <Label htmlFor="chat-name">Your name</Label>
                  <Input id="chat-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                </div>
                <div>
                  <Label htmlFor="chat-email">Email (for notifications)</Label>
                  <Input id="chat-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <Label htmlFor="chat-msg">Describe your issue</Label>
                  <Textarea id="chat-msg" value={firstMsg} onChange={(e) => setFirstMsg(e.target.value)} rows={5} placeholder="Tell us what's going on…" />
                </div>
                <Button onClick={handleSubmit} disabled={submitting} className="w-full">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  Start conversation
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  You'll receive an email when we reply. Save this page link to come back later.
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </StoreLayout>
  );
};

const ChatRoom: React.FC<{ conversationId: string; onLeave: () => void }> = ({ conversationId, onLeave }) => {
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

  // Mark messages from admin as read + heartbeat last_seen_user_at
  useEffect(() => {
    if (!conversation) return;
    const patch: any = { last_seen_user_at: new Date().toISOString() };
    if (conversation.unread_user > 0) patch.unread_user = 0;
    (supabase.from('chat_conversations') as any).update(patch).eq('id', conversation.id).then(() => {});
    // Mark unread admin messages as read
    const unreadIds = messages.filter((m) => m.sender_type === 'admin' && !(m as any).read_at).map((m) => m.id);
    if (unreadIds.length > 0) {
      (supabase.from('chat_messages') as any)
        .update({ read_at: new Date().toISOString() })
        .in('id', unreadIds)
        .then(() => {});
    }
  }, [conversation?.id, conversation?.unread_user, messages.length]);

  // Typing indicator: write timestamp on input
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

  const isGeneralRoom = conversation.conversation_type === 'general_room' || conversation.category === 'general_room';

  return (
    <Card className="flex flex-col h-[75vh] max-h-[700px] overflow-hidden">
      <div className="border-b p-3 sm:p-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">{getCategory(conversation.category)?.icon} {isGeneralRoom ? 'General Room' : getCategory(conversation.category)?.label}</Badge>
          {conversation.subcategory && (
            <Badge variant="outline" className="text-xs">{getSubcategoryLabel(conversation.category, conversation.subcategory)}</Badge>
          )}
          {!isGeneralRoom && (
            <Badge className={`text-xs ${PRIORITY_META[conversation.priority as keyof typeof PRIORITY_META]?.bg} ${PRIORITY_META[conversation.priority as keyof typeof PRIORITY_META]?.color} border-0`}>
              {PRIORITY_META[conversation.priority as keyof typeof PRIORITY_META]?.label}
            </Badge>
          )}
          <Badge className={`text-xs ${STATUS_META[conversation.status]?.color}`}>
            {STATUS_META[conversation.status]?.label}
          </Badge>
          <span className={`inline-flex items-center gap-1 text-[11px] ${adminOnline ? 'text-emerald-600' : 'text-muted-foreground'}`}>
            <span className={`h-2 w-2 rounded-full ${adminOnline ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            {adminOnline ? 'Support online' : 'Offline'}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onLeave}>
          <LogOut className="h-4 w-4 mr-1" /> Leave
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-muted/30">
        {messages.map((m) => {
          const isMine = m.sender_type === 'user';
          const readAt = (m as any).read_at as string | null;
          return (
            <div key={m.id} className={`group flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap relative ${
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
        {conversation.status === 'open' && messages.length <= 1 && !adminTyping && (
          <div className="text-center text-xs text-muted-foreground py-4">
            Waiting for an agent. You'll be emailed when we reply.
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

