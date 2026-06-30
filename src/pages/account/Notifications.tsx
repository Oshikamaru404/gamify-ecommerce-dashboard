import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Archive, ArchiveRestore, ShoppingBag, CreditCard, Package, KeyRound, Tag, Users, DollarSign, CheckCircle, Banknote, MessageCircle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications, type AppNotification, type NotificationFilter } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  ShoppingBag, CreditCard, Package, KeyRound, Tag, Users, DollarSign, CheckCircle, Banknote, MessageCircle, Info,
};

const SEVERITY_COLOR: Record<string, string> = {
  info: 'text-blue-600 bg-blue-50',
  success: 'text-emerald-600 bg-emerald-50',
  warning: 'text-amber-600 bg-amber-50',
  error: 'text-red-600 bg-red-50',
};

const NotificationsPage: React.FC = () => {
  const { items, loading, unreadCount, markRead, markAllRead, archive, unarchive } = useNotifications({ limit: 200 });
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return items.filter((n) => {
      if (filter === 'archived') return !!n.archived_at;
      if (n.archived_at) return false;
      if (filter === 'unread') return !n.read_at;
      if (filter === 'read') return !!n.read_at;
      return true;
    });
  }, [items, filter]);

  const handleClick = async (n: AppNotification) => {
    if (!n.read_at) await markRead(n.id);
    if (n.link) navigate(n.link);
  };

  return (
    <AccountUI>
      <Helmet><title>Notifications — BWIVOX</title></Helmet>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6 text-red-600" /> Notifications
            </h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => markAllRead()}>
              <Check className="h-4 w-4 mr-1.5" /> Mark all read
            </Button>
          )}
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as NotificationFilter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadCount > 0 && <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
              No notifications in this view
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((n) => {
                const Icon = ICON_MAP[n.icon || ''] || Info;
                const isArchived = !!n.archived_at;
                return (
                  <li
                    key={n.id}
                    className={cn(
                      'group flex gap-3 p-4 cursor-pointer hover:bg-accent/40 transition',
                      !n.read_at && !isArchived && 'bg-blue-50/40',
                    )}
                    onClick={() => handleClick(n)}
                  >
                    <div className={cn('h-10 w-10 rounded-full flex items-center justify-center shrink-0', SEVERITY_COLOR[n.severity] || SEVERITY_COLOR.info)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium text-sm">{n.title}</div>
                        {!n.read_at && !isArchived && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                      </div>
                      {n.body && <div className="text-sm text-muted-foreground mt-0.5">{n.body}</div>}
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="text-[10px] capitalize">{n.category}</Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition">
                      {!n.read_at && !isArchived && (
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); markRead(n.id); }}>
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {isArchived ? (
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); unarchive(n.id); }}>
                          <ArchiveRestore className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); archive(n.id); }}>
                          <Archive className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </AccountUI>
  );
};

export default NotificationsPage;
