import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Loader2, Send, Search, Mail, MessageSquare, X, Trash2 } from 'lucide-react';

const PRIORITY_ORDER: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

const ChatAdmin: React.FC = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [filterPrio, setFilterPrio] = useState<string>('all');

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await supabase
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
          c.id.includes(s)
        );
      })
      .sort((a, b) => {
        const pa = PRIORITY_ORDER[a.priority] ?? 99;
        const pb = PRIORITY_ORDER[b.priority] ?? 99;
        if (pa !== pb) return pa - pb;
        return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime();
      });
  }, [conversations, filterStatus, filterCat, filterPrio, search]);

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_admin || 0), 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Support Chat</h1>
          <p className="text-sm text-gray-600">
            {conversations.length} total · {totalUnread > 0 && <span className="text-red-600 font-semibold">{totalUnread} unread</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 h-[calc(100vh-200px)]">
        {/* List */}
        <Card className="flex flex-col overflow-hidden">
          <div className="p-3 border-b space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, ID…"
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
              <Select value={filterCat} onValueChange={setFilterCat}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All topics</SelectItem>
                  {CHAT_CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.icon} {c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full text-left p-3 border-b hover:bg-accent/30 transition ${isSelected ? 'bg-accent/50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-semibold text-sm truncate flex-1">{name}</div>
                      {c.unread_admin > 0 && (
                        <span className="bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold">
                          {c.unread_admin}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap mb-1">
                      <Badge className={`text-[10px] ${prio?.bg} ${prio?.color} border-0 px-1.5 py-0`}>{prio?.label}</Badge>
                      <Badge className={`text-[10px] ${status?.color} px-1.5 py-0`}>{status?.label}</Badge>
                      <span className="text-[10px] text-muted-foreground">{cat?.icon} {cat?.label}</span>
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation) {
      setNewName(conversation.display_name || conversation.guest_name || '');
      setNotes(conversation.admin_notes || '');
    }
  }, [conversation?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  // Mark as read when viewing
  useEffect(() => {
    if (conversation && conversation.unread_admin > 0) {
      supabase.from('chat_conversations').update({ unread_admin: 0 }).eq('id', conversation.id).then(() => {});
    }
  }, [conversation?.id, conversation?.unread_admin]);

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

  async function updateConv(patch: Partial<ChatConversation>) {
    if (!conversation) return;
    const { error } = await supabase.from('chat_conversations').update(patch).eq('id', conversation.id);
    if (error) toast.error(error.message);
    else {
      toast.success('Updated');
      refresh();
    }
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
    else {
      toast.success('Deleted');
      onClose();
    }
  }

  if (!conversation) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  const cat = getCategory(conversation.category);
  const displayName = conversation.display_name || conversation.guest_name || conversation.guest_email;

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
                  <h2 className="font-semibold text-base truncate">{displayName}</h2>
                  <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setRenaming(true)}>Rename</Button>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Mail className="h-3 w-3" /> {conversation.guest_email}
                </div>
              </>
            )}
          </div>
          <Button size="sm" variant="ghost" onClick={deleteConv} className="text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
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
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
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
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
              m.sender_type === 'admin'
                ? 'bg-primary text-primary-foreground rounded-br-sm'
                : 'bg-card border rounded-bl-sm'
            }`}>
              {m.sender_name && <div className="text-[10px] font-semibold mb-0.5 opacity-70">{m.sender_name}</div>}
              {m.content}
              <div className="text-[10px] opacity-60 mt-1">{new Date(m.created_at).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="border-t p-2 flex gap-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Reply to customer…"
          rows={2}
          className="resize-none min-h-[40px]"
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }}
        />
        <Button onClick={send} disabled={sending || !text.trim()}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>

      {/* Notes */}
      <div className="border-t p-2">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => notes !== (conversation.admin_notes || '') && updateConv({ admin_notes: notes })}
          placeholder="Private admin notes (auto-saved)…"
          rows={2}
          className="text-xs resize-none bg-yellow-50"
        />
      </div>
    </div>
  );
};

export default ChatAdmin;
