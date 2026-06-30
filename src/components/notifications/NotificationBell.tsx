import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Check, Archive, ShoppingBag, CreditCard, Package, KeyRound, Tag, Users, DollarSign, CheckCircle, Banknote, MessageCircle, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useNotifications, type AppNotification } from '@/hooks/useNotifications';
import { useUserAuth } from '@/contexts/UserAuthContext';
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

interface NotificationBellProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ variant = 'desktop', className }) => {
  const { user } = useUserAuth();
  const { items, unreadCount, markRead, markAllRead, archive } = useNotifications({ limit: 10 });
  const navigate = useNavigate();

  if (!user) {
    return (
      <Link
        to="/account"
        aria-label="Notifications"
        className={cn('relative h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700', className)}
      >
        <Bell size={18} />
      </Link>
    );
  }

  const handleClick = async (n: AppNotification) => {
    if (!n.read_at) await markRead(n.id);
    if (n.link) navigate(n.link);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className={cn(
            'relative inline-flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700',
            variant === 'mobile' ? 'h-9 w-9' : 'h-10 w-10',
            className,
          )}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="font-semibold text-sm">Notifications</div>
          {unreadCount > 0 && (
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => markAllRead()}>
              <Check className="h-3.5 w-3.5 mr-1" />Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[420px]">
          {items.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
              You're all caught up
            </div>
          ) : (
            <ul className="divide-y">
              {items.filter((n) => !n.archived_at).map((n) => {
                const Icon = ICON_MAP[n.icon || ''] || Info;
                return (
                  <li
                    key={n.id}
                    className={cn(
                      'group flex gap-3 p-3 cursor-pointer hover:bg-accent/40 transition',
                      !n.read_at && 'bg-blue-50/40',
                    )}
                    onClick={() => handleClick(n)}
                  >
                    <div className={cn('h-9 w-9 rounded-full flex items-center justify-center shrink-0', SEVERITY_COLOR[n.severity] || SEVERITY_COLOR.info)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium text-sm truncate">{n.title}</div>
                        {!n.read_at && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                      </div>
                      {n.body && <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.body}</div>}
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); archive(n.id); }}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
                      aria-label="Archive"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
        <div className="p-2 border-t">
          <Link
            to="/account/notifications"
            className="block text-center text-sm text-primary hover:underline py-1.5"
          >
            See all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
