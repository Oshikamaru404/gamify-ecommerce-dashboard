
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type MetricCardProps = {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  className?: string;
};

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  className 
}) => {
  return (
    <Card className={cn("h-full overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
          <div 
            className={cn(
              "flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium",
              trend === 'up' ? "bg-soft-green text-emerald-700" : "bg-soft-pink text-red-700",
              trend === 'neutral' && "bg-soft-gray text-slate-700"
            )}
          >
            {trend === 'up' ? (
              <ArrowUpIcon size={12} className="mr-1" />
            ) : trend === 'down' ? (
              <ArrowDownIcon size={12} className="mr-1" />
            ) : null}
            {Math.abs(change)}%
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
