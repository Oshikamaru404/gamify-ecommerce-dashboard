import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Package, DollarSign, User, X, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type NewOrder = {
  id: string;
  customer_name: string;
  package_name: string;
  amount: number;
  created_at: string;
  status: string;
};

type OrderNotificationProps = {
  onNewOrder?: () => void;
};

const OrderNotification: React.FC<OrderNotificationProps> = ({ onNewOrder }) => {
  const [notifications, setNotifications] = useState<NewOrder[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Subscribe to real-time order updates
    const channel = supabase
      .channel('new-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          const newOrder = payload.new as NewOrder;
          setNotifications(prev => [newOrder, ...prev].slice(0, 5));
          setIsVisible(true);
          onNewOrder?.();
          
          // Auto-hide after 10 seconds
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== newOrder.id));
          }, 10000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewOrder]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const dismissAll = () => {
    setNotifications([]);
    setIsVisible(false);
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((order, index) => (
        <div
          key={order.id}
          className={cn(
            "animate-in slide-in-from-right-5 fade-in duration-300",
            "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-2xl p-4",
            "border border-green-400/30 backdrop-blur-sm"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  New Order!
                </p>
                <p className="text-white/90 text-xs truncate mt-0.5">
                  {order.customer_name}
                </p>
              </div>
            </div>
            <button
              onClick={() => dismissNotification(order.id)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 bg-white/10 rounded px-2 py-1">
              <Package className="h-3 w-3" />
              <span className="truncate max-w-[120px]">{order.package_name}</span>
            </div>
            <div className="flex items-center gap-1 font-bold bg-white/20 rounded px-2 py-1">
              <DollarSign className="h-3 w-3" />
              <span>{Number(order.amount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
      
      {notifications.length > 1 && (
        <button
          onClick={dismissAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors text-right"
        >
          Dismiss all
        </button>
      )}
    </div>
  );
};

export default OrderNotification;
