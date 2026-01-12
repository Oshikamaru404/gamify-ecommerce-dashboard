import React from 'react';
import { Order } from '@/lib/types';
import OrderCard from './OrderCard';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';

type RecentOrdersGridProps = {
  orders: Order[];
  className?: string;
  isLoading?: boolean;
};

const RecentOrdersGrid: React.FC<RecentOrdersGridProps> = ({ 
  orders, 
  className,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className={cn("grid gap-3 md:grid-cols-2", className)}>
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className="h-40 rounded-xl bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}>
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">No orders yet</p>
        <p className="text-sm text-muted-foreground/70">
          New orders will appear here
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-3 md:grid-cols-2", className)}>
      {orders.slice(0, 6).map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default RecentOrdersGrid;
