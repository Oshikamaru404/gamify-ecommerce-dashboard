
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Metric } from '@/lib/types';

type MetricCardProps = {
  metric: Metric;
  className?: string;
};

const MetricCard: React.FC<MetricCardProps> = ({ metric, className }) => {
  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    if (Number.isInteger(value)) {
      return value.toString();
    }
    return value.toFixed(2);
  };

  const formatCurrency = (value: number) => {
    return `$${formatValue(value)}`;
  };

  const getFormattedValue = () => {
    if (metric.label.toLowerCase().includes('revenue') || 
        metric.label.toLowerCase().includes('order value')) {
      return formatCurrency(metric.value);
    }
    if (metric.label.toLowerCase().includes('rate') || 
        metric.label.toLowerCase().includes('percentage')) {
      return `${formatValue(metric.value)}%`;
    }
    return formatValue(metric.value);
  };

  return (
    <Card className={cn("h-full overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
          <div 
            className={cn(
              "flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium",
              metric.trend === 'up' ? "bg-soft-green text-emerald-700" : "bg-soft-pink text-red-700",
              metric.trend === 'neutral' && "bg-soft-gray text-slate-700"
            )}
          >
            {metric.trend === 'up' ? (
              <ArrowUpIcon size={12} className="mr-1" />
            ) : metric.trend === 'down' ? (
              <ArrowDownIcon size={12} className="mr-1" />
            ) : null}
            {Math.abs(metric.change)}%
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold">{getFormattedValue()}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
