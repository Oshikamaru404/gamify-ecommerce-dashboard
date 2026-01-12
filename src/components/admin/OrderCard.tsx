import React from 'react';
import { Order, OrderStatus, PaymentStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { Package, User, Clock, DollarSign, CreditCard, Truck } from 'lucide-react';

type OrderCardProps = {
  order: Order;
  className?: string;
};

const OrderCard: React.FC<OrderCardProps> = ({ order, className }) => {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return { 
          bg: 'bg-amber-100 border-amber-300', 
          text: 'text-amber-700',
          icon: Clock,
          label: 'Pending'
        };
      case 'processing':
        return { 
          bg: 'bg-blue-100 border-blue-300', 
          text: 'text-blue-700',
          icon: Package,
          label: 'Processing'
        };
      case 'shipped':
        return { 
          bg: 'bg-purple-100 border-purple-300', 
          text: 'text-purple-700',
          icon: Truck,
          label: 'Shipped'
        };
      case 'delivered':
        return { 
          bg: 'bg-green-100 border-green-300', 
          text: 'text-green-700',
          icon: Package,
          label: 'Delivered'
        };
      case 'cancelled':
        return { 
          bg: 'bg-red-100 border-red-300', 
          text: 'text-red-700',
          icon: Package,
          label: 'Cancelled'
        };
      default:
        return { 
          bg: 'bg-gray-100 border-gray-300', 
          text: 'text-gray-700',
          icon: Package,
          label: status
        };
    }
  };

  const getPaymentConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-amber-500', text: 'Pending' };
      case 'paid':
        return { bg: 'bg-green-500', text: 'Paid' };
      case 'failed':
        return { bg: 'bg-red-500', text: 'Failed' };
      case 'refunded':
        return { bg: 'bg-gray-500', text: 'Refunded' };
      default:
        return { bg: 'bg-gray-500', text: status };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const paymentConfig = getPaymentConfig(order.paymentStatus);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  return (
    <div
      className={cn(
        "group relative p-4 rounded-xl border-2 transition-all duration-200",
        "hover:shadow-lg hover:scale-[1.02] cursor-pointer",
        statusConfig.bg,
        className
      )}
    >
      {/* Payment status indicator */}
      <div className={cn(
        "absolute -top-1 -right-1 w-3 h-3 rounded-full ring-2 ring-white",
        paymentConfig.bg
      )} />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            statusConfig.text,
            "bg-white/60"
          )}>
            <StatusIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              #{order.id.slice(0, 8)}
            </p>
            <p className={cn("text-xs font-medium", statusConfig.text)}>
              {statusConfig.label}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">
            ${order.total.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            {paymentConfig.text}
          </p>
        </div>
      </div>

      {/* Customer info */}
      <div className="flex items-center gap-2 mb-2">
        <User className="h-3 w-3 text-muted-foreground" />
        <p className="text-sm font-medium truncate">{order.customerName}</p>
      </div>

      {/* Package info */}
      <div className="flex items-center gap-2 mb-3">
        <Package className="h-3 w-3 text-muted-foreground" />
        <p className="text-xs text-muted-foreground truncate">
          {order.packageName}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-current/10">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/50 text-muted-foreground">
          {order.durationMonths}mo
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
