import React from 'react';
import { Package, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockBadgeProps {
  enabled?: boolean;
  quantity?: number;
  threshold?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Displays a clear stock indicator next to a product.
 * - Hidden when stock tracking is disabled.
 * - "X restant(s)" when in stock.
 * - "Stock faible" highlight when at/below threshold.
 * - "Rupture de stock" when 0.
 */
const StockBadge: React.FC<StockBadgeProps> = ({
  enabled,
  quantity = 0,
  threshold = 5,
  className,
  size = 'md',
}) => {
  if (!enabled) return null;

  const qty = Math.max(0, Number(quantity) || 0);
  const isOut = qty <= 0;
  const isLow = !isOut && qty <= threshold;

  const sizeCls =
    size === 'sm' ? 'text-xs px-2 py-0.5' :
    size === 'lg' ? 'text-base px-3 py-1.5' :
    'text-sm px-2.5 py-1';

  const iconCls = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  let label: string;
  let Icon = Package;
  let colorCls = 'bg-green-50 text-green-700 border-green-200';

  if (isOut) {
    label = 'Rupture de stock';
    Icon = XCircle;
    colorCls = 'bg-red-50 text-red-700 border-red-200';
  } else if (isLow) {
    label = `Plus que ${qty} restant${qty > 1 ? 's' : ''} !`;
    Icon = AlertTriangle;
    colorCls = 'bg-orange-50 text-orange-700 border-orange-200 animate-pulse';
  } else {
    label = `${qty} en stock`;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-semibold whitespace-nowrap',
        colorCls,
        sizeCls,
        className,
      )}
      aria-label={label}
    >
      <Icon className={iconCls} />
      {label}
    </span>
  );
};

export default StockBadge;
