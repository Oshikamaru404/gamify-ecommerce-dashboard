import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PRIORITY_META,
  STATUS_META,
  CHAT_CATEGORIES,
  getCategory,
  getSubcategoryLabel,
} from '@/lib/chatCategories';
import {
  useConversation,
  useConversationMessages,
  sendChatMessage,
  type ChatConversation,
} from '@/hooks/useChat';
import { toast } from 'sonner';
import {
  Loader2, Send, Search, Mail, MessageSquare, X, Trash2,
  Pin, Archive, BellOff, Copy, User as UserIcon, ShoppingBag,
  CreditCard, Phone, Globe, Calendar,
} from 'lucide-react';

const PRIORITY_ORDER: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

const ChatAdmin: React.FC = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [filterPrio, setFilterPrio] = useState<string>('all');
  const [tab, setTab] = useState<'support' | 'general_room'>('support');
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await (supabase as any)
        .from('chat_conversations')
        .select('*')
        .order('last_message_at', { ascending: false })
        .limit(500);
      if (mounted) {
        setConversations((data || []) as ChatConversation[]);
        setLoading(false);
      }
    }
    load();

    const channel = supabase
      .channel('admin-chat-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_conversations' }, () => load())
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    return conversations
      .filter((c) => {
        const t = c.conversation_type || 'support';
        return tab === 'general_room' ? t === 'general_room' : t !== 'general_room';
      })
      .filter((c) => (showArchived ? true : !c.archived))
      .filter((c) => filterStatus === 'all' || c.status === filterStatus)
      .filter((c) => filterCat === 'all' || c.category === filterCat)
      .filter((c) => filterPrio === 'all' || c.priority === filterPrio)
      .filter((c) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
          (c.display_name || '').toLowerCase().includes(s) ||
          (c.guest_name || '').toLowerCase().includes(s) ||
          c.guest_email.toLowerCase().includes(s) ||
          c.id.includes(s) ||
          (c.tags || []).some((t) => t.toLowerCase().includes(s))
        );
      })
      .sort((a, b) => {
        if ((b.pinned ? 1 : 0) !== (a.pinned ? 1 : 0)) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
        const pa = PRIORITY_ORDER[a.priority] ?? 99;
        const pb = PRIORITY_ORDER[b.priority] ?? 99;
        if (pa !== pb) return pa - pb;
        return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime();
      });
  }, [conversations, filterStatus, filterCat, filterPrio, search, tab, showArchived]);

  const supportUnread = conversations
    .filter((c) => (c.conversation_type || 'support') !== 'general_room' && !c.archived)
    .reduce((s, c) => s + (c.unread_admin || 0), 0);
  const generalUnread = conversations
    .filter((c) => c.conversation_type === 'general_room' && !c.archived)
    .reduce((s, c) => s + (c.unread_admin || 0), 0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Chat Center</h1>
          <p className="text-sm text-gray-600">{conversations.length} total</p>
        </div>
        <label className="text-xs flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
          Show archived
        </label>
      </div>

      <Tabs value={tab} onValueChange={(v) => { setTab(v as any); setSelectedId(null); }} className="mb-3">
        <TabsList>
          <TabsTrigger value="support" className="gap-2">
            Support Chat
            {supportUnread > 0 && <span className="bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold">{supportUnread}</span>}
          </TabsTrigger>
          <TabsTrigger value="general_room" className="gap-2">
            General Room
            {generalUnread > 0 && <span className="bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold">{generalUnread}</span>}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_320px] gap-3 h-[calc(100vh-240px)]">
        {/* List */}
        <Card className="flex flex-col overflow-hidden">
          <div className="p-3 border-b space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, tag…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="waiting_customer">Waiting Customer</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPrio} onValueChange={setFilterPrio}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              {tab === 'support' ? (
                <Select value={filterCat} onValueChange={setFilterCat}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All topics</SelectItem>
                    {CHAT_CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.icon} {c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : <div />}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No conversations</div>
            ) : (
              filtered.map((c) => {
                const cat = getCategory(c.category);
                const prio = PRIORITY_META[c.priority as keyof typeof PRIORITY_META];
                const status = STATUS_META[c.status];
                const isSelected = selectedId === c.id;
                const name = c.display_name || c.guest_name || c.guest_email;
                const online = c.last_seen_user_at && Date.now() - new Date(c.last_seen_user_at).getTime() < 60_000;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full text-left p-3 border-b hover:bg-accent/30 transition ${isSelected ? 'bg-accent/50' : ''} ${c.archived ? 'opacity-60' : ''}`}
                    style={c.color ? { borderLeft: `3px solid ${c.color}` } : undefined}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-semibold text-sm truncate flex-1 flex items-center gap-1.5">
                        {c.pinned && <Pin className="h-3 w-3 text-amber-500" />}
                        {c.emoji && <span>{c.emoji}</span>}
                        <span className={`h-2 w-2 rounded-full ${online ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        <span className="truncate">{name}</span>
                      </div>
                      {c.unread_admin > 0 && (
                        <span className="bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold">
                          {c.unread_admin}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap mb-1">
                      <Badge className={`text-[10px] ${prio?.bg} ${prio?.color} border-0 px-1.5 py-0`}>{prio?.label}</Badge>
                      <Badge className={`text-[10px] ${status?.color} px-1.5 py-0`}>{status?.label}</Badge>
                      {tab === 'support' && <span className="text-[10px] text-muted-foreground">{cat?.icon} {cat?.label}</span>}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(c.last_message_at).toLocaleString()}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {/* Detail */}
        <Card className="flex flex-col overflow-hidden">
          {selectedId ? (
            <AdminChatDetail conversationId={selectedId} onClose={() => setSelectedId(null)} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-30" />
                Select a conversation
              </div>
            </div>
          )}
        </Card>

        {/* CRM Side panel */}
        <Card className="flex flex-col overflow-hidden">
          {selectedId ? <CrmPanel conversationId={selectedId} /> : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs p-4 text-center">
              Customer details appear here
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const AdminChatDetail: React.FC<{ conversationId: string; onClose: () => void }> = ({ conversationId, onClose }) => {
  const { conversation, refresh } = useConversation(conversationId);
  const { messages } = useConversationMessages(conversationId);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [notes, setNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation) {
      setNewName(conversation.display_name || conversation.guest_name || '');
      setNotes(conversation.admin_notes || '');
      setInternalNotes(conversation.internal_notes || '');
    }
  }, [conversation?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  // Mark as read + heartbeat
  useEffect(() => {
    if (!conversation) return;
    const patch: any = { last_seen_admin_at: new Date().toISOString() };
    if (conversation.unread_admin > 0) patch.unread_admin = 0;
    (supabase.from('chat_conversations') as any).update(patch).eq('id', conversation.id).then(() => {});
    const unreadIds = messages.filter((m) => m.sender_type === 'user' && !(m as any).read_at).map((m) => m.id);
    if (unreadIds.length > 0) {
      (supabase.from('chat_messages') as any).update({ read_at: new Date().toISOString() }).in('id', unreadIds).then(() => {});
    }
  }, [conversation?.id, conversation?.unread_admin, messages.length]);

  const typingTimer = useRef<any>(null);
  function onType(v: string) {
    setText(v);
    if (!conversation) return;
    if (typingTimer.current) return;
    (supabase.from('chat_conversations') as any).update({ typing_admin_at: new Date().toISOString() }).eq('id', conversation.id).then(() => {});
    typingTimer.current = setTimeout(() => { typingTimer.current = null; }, 2000);
  }

  async function send() {
    if (!text.trim() || !conversation) return;
    setSending(true);
    try {
      await sendChatMessage({
        conversationId: conversation.id,
        senderType: 'admin',
        senderName: 'BWIVOX Support',
        content: text.trim(),
      });
      setText('');
    } catch (e: any) {
      toast.error(e.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  }

  async function updateConv(patch: Partial<ChatConversation> | Record<string, any>) {
    if (!conversation) return;
    const { error } = await (supabase.from('chat_conversations') as any).update(patch).eq('id', conversation.id);
    if (error) toast.error(error.message);
    else { toast.success('Updated'); refresh(); }
  }

  async function addTag() {
    if (!tagInput.trim() || !conversation) return;
    const tags = Array.from(new Set([...(conversation.tags || []), tagInput.trim()]));
    await updateConv({ tags });
    setTagInput('');
  }
  async function removeTag(t: string) {
    if (!conversation) return;
    await updateConv({ tags: conversation.tags.filter((x) => x !== t) });
  }

  async function deleteConv() {
    if (!conversation || !confirm('Delete this conversation permanently?')) return;
    const { error } = await supabase.from('chat_conversations').delete().eq('id', conversation.id);
    if (error) toast.error(error.message);
    else { toast.success('Deleted'); onClose(); }
  }

  if (!conversation) return <div className="flex-1 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  const cat = getCategory(conversation.category);
  const displayName = conversation.display_name || conversation.guest_name || conversation.guest_email;
  const userTyping = conversation.typing_user_at && Date.now() - new Date(conversation.typing_user_at).getTime() < 5000;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {renaming ? (
              <div className="flex gap-2">
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="h-8" />
                <Button size="sm" onClick={async () => { await updateConv({ display_name: newName }); setRenaming(false); }}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setRenaming(false)}>X</Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-base truncate">{conversation.emoji} {displayName}</h2>
                  <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setRenaming(true)}>Rename</Button>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Mail className="h-3 w-3" /> {conversation.guest_email}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" title="Pin" onClick={() => updateConv({ pinned: !conversation.pinned } as any)}>
              <Pin className={`h-4 w-4 ${conversation.pinned ? 'text-amber-500' : ''}`} />
            </Button>
            <Button size="sm" variant="ghost" title="Mute" onClick={() => updateConv({ muted: !conversation.muted } as any)}>
              <BellOff className={`h-4 w-4 ${conversation.muted ? 'text-purple-500' : ''}`} />
            </Button>
            <Button size="sm" variant="ghost" title="Archive" onClick={() => updateConv({ archived: !conversation.archived } as any)}>
              <Archive className={`h-4 w-4 ${conversation.archived ? 'text-blue-500' : ''}`} />
            </Button>
            <Button size="sm" variant="ghost" onClick={deleteConv} className="text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">{cat?.icon} {cat?.label}</Badge>
          {conversation.subcategory && (
            <Badge variant="outline" className="text-xs">
              {getSubcategoryLabel(conversation.category, conversation.subcategory)}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Select value={conversation.priority} onValueChange={(v) => updateConv({ priority: v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">🔴 Urgent</SelectItem>
              <SelectItem value="high">🟠 High</SelectItem>
              <SelectItem value="medium">🔵 Medium</SelectItem>
              <SelectItem value="low">🟢 Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={conversation.status} onValueChange={(v) => updateConv({ status: v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="waiting_customer">Waiting Customer</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input
            type="color"
            value={conversation.color || '#999999'}
            onChange={(e) => updateConv({ color: e.target.value } as any)}
            className="h-8 p-1"
            title="Color label"
          />
          <Input
            value={conversation.emoji || ''}
            onChange={(e) => updateConv({ emoji: e.target.value } as any)}
            placeholder="emoji"
            className="h-8 text-xs"
            maxLength={2}
          />
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {conversation.tags?.map((t) => (
            <Badge key={t} variant="outline" className="text-[10px] gap-1">
              {t}
              <button onClick={() => removeTag(t)}><X className="h-2.5 w-2.5" /></button>
            </Badge>
          ))}
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            placeholder="+ tag"
            className="h-6 text-xs w-20"
          />
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/20">
        {messages.map((m) => {
          const isMine = m.sender_type === 'admin';
          const readAt = (m as any).read_at as string | null;
          return (
            <div key={m.id} className={`group flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                isMine ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card border rounded-bl-sm'
              }`}>
                {m.sender_name && <div className="text-[10px] font-semibold mb-0.5 opacity-70">{m.sender_name}</div>}
                {m.content}
                <div className="flex items-center gap-1 text-[10px] opacity-60 mt-1">
                  <span>{new Date(m.created_at).toLocaleString()}</span>
                  {isMine && <span>{readAt ? '✓✓' : '✓'}</span>}
                  <button
                    onClick={() => { navigator.clipboard.writeText(m.content); toast.success('Copied'); }}
                    className="opacity-0 group-hover:opacity-100 hover:underline ml-1"
                  >copy</button>
                </div>
              </div>
            </div>
          );
        })}
        {userTyping && (
          <div className="flex justify-start">
            <div className="bg-card border rounded-2xl px-3 py-1.5 text-xs text-muted-foreground italic">
              Customer is typing…
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t p-2 flex gap-2">
        <Textarea
          value={text}
          onChange={(e) => onType(e.target.value)}
          placeholder="Reply to customer…  (Ctrl/⌘+Enter to send)"
          rows={2}
          className="resize-none min-h-[40px]"
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }}
        />
        <Button onClick={send} disabled={sending || !text.trim()}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>

      {/* Notes */}
      <div className="border-t p-2 grid grid-cols-2 gap-2">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => notes !== (conversation.admin_notes || '') && updateConv({ admin_notes: notes })}
          placeholder="Admin notes (auto-saved)…"
          rows={2}
          className="text-xs resize-none bg-yellow-50"
        />
        <Textarea
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          onBlur={() => internalNotes !== (conversation.internal_notes || '') && updateConv({ internal_notes: internalNotes } as any)}
          placeholder="🔒 Internal private notes (admin-only)…"
          rows={2}
          className="text-xs resize-none bg-red-50"
        />
      </div>
    </div>
  );
};

const CrmPanel: React.FC<{ conversationId: string }> = ({ conversationId }) => {
  const { conversation } = useConversation(conversationId);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<{ orders: number; spent: number; subs: number; affiliate: boolean } | null>(null);

  useEffect(() => {
    if (!conversation) return;
    (async () => {
      const email = conversation.guest_email;
      let prof: any = null;
      if (conversation.user_id) {
        const { data } = await supabase.from('profiles').select('*').eq('id', conversation.user_id).maybeSingle();
        prof = data;
      } else if (email) {
        const { data } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle();
        prof = data;
      }
      setProfile(prof);

      // Orders summary
      const { data: orders } = await (supabase as any)
        .from('orders')
        .select('total_amount, status, created_at')
        .eq('customer_email', email);
      const spent = (orders || []).filter((o: any) => o.status === 'paid' || o.status === 'completed').reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0);

      let isAff = false;
      try {
        const { data: aff } = await (supabase as any).from('affiliates').select('id').eq('user_id', prof?.id).maybeSingle();
        isAff = !!aff;
      } catch {}

      setStats({ orders: (orders || []).length, spent, subs: 0, affiliate: isAff });
    })();
  }, [conversation?.id]);

  if (!conversation) return null;
  const email = conversation.guest_email;
  const phone = profile?.phone || profile?.whatsapp || '';
  const online = conversation.last_seen_user_at && Date.now() - new Date(conversation.last_seen_user_at).getTime() < 60_000;

  const copy = (val: string, label: string) => { navigator.clipboard.writeText(val); toast.success(`${label} copied`); };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-3 border-b">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{profile?.display_name || conversation.guest_name || 'Guest'}</div>
            <div className="text-[11px] flex items-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              <span className="text-muted-foreground">{online ? 'Online' : conversation.last_seen_user_at ? `Last seen ${new Date(conversation.last_seen_user_at).toLocaleString()}` : 'Offline'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2 text-xs border-b">
        <Row icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={email} onCopy={() => copy(email, 'Email')} />
        {phone && <Row icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={phone} onCopy={() => copy(phone, 'Phone')} />}
        {profile?.country && <Row icon={<Globe className="h-3.5 w-3.5" />} label="Country" value={profile.country} />}
        {profile?.preferred_language && <Row icon={<Globe className="h-3.5 w-3.5" />} label="Language" value={profile.preferred_language} />}
        {profile?.created_at && <Row icon={<Calendar className="h-3.5 w-3.5" />} label="Member since" value={new Date(profile.created_at).toLocaleDateString()} />}
      </div>

      <div className="p-3 grid grid-cols-2 gap-2 border-b">
        <Stat icon={<ShoppingBag className="h-3.5 w-3.5" />} label="Orders" value={stats?.orders ?? '…'} />
        <Stat icon={<CreditCard className="h-3.5 w-3.5" />} label="Spent" value={stats ? `€${stats.spent.toFixed(2)}` : '…'} />
        <Stat icon={<UserIcon className="h-3.5 w-3.5" />} label="Affiliate" value={stats?.affiliate ? 'Yes' : 'No'} />
        <Stat icon={<Calendar className="h-3.5 w-3.5" />} label="Convs" value="—" />
      </div>

      <div className="p-3 space-y-1.5">
        <div className="text-[11px] uppercase text-muted-foreground font-semibold mb-1">Quick actions</div>
        {profile?.id && (
          <>
            <a href={`/diza/users/${profile.id}`} className="block text-xs text-primary hover:underline">→ Open profile</a>
            <a href={`/diza/orders?email=${encodeURIComponent(email)}`} className="block text-xs text-primary hover:underline">→ View orders</a>
            <a href={`/diza/subscriptions?email=${encodeURIComponent(email)}`} className="block text-xs text-primary hover:underline">→ Subscriptions</a>
            <a href={`/diza/payments?email=${encodeURIComponent(email)}`} className="block text-xs text-primary hover:underline">→ Payments</a>
          </>
        )}
        <button onClick={() => copy(email, 'Email')} className="block text-xs text-primary hover:underline"><Copy className="h-3 w-3 inline mr-1" />Copy email</button>
        {phone && <button onClick={() => copy(phone, 'Phone')} className="block text-xs text-primary hover:underline"><Copy className="h-3 w-3 inline mr-1" />Copy phone</button>}
      </div>
    </div>
  );
};

const Row: React.FC<{ icon: React.ReactNode; label: string; value: string; onCopy?: () => void }> = ({ icon, label, value, onCopy }) => (
  <div className="flex items-center gap-2">
    <span className="text-muted-foreground">{icon}</span>
    <span className="text-muted-foreground">{label}:</span>
    <span className="flex-1 truncate">{value}</span>
    {onCopy && <button onClick={onCopy} title="Copy"><Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" /></button>}
  </div>
);

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <div className="rounded border p-2 bg-muted/30">
    <div className="text-[10px] text-muted-foreground flex items-center gap-1">{icon} {label}</div>
    <div className="text-sm font-semibold">{value}</div>
  </div>
);

export default ChatAdmin;
