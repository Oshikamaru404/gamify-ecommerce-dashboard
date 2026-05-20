import React from 'react';
import { Package, AlertTriangle, XCircle, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockBadgeProps {
  enabled?: boolean;
  quantity?: number;
  threshold?: number;
  className?: string;
  /** sm = card chip · md = inline badge · lg = hero CTA · cta = bold animated banner */
  size?: 'sm' | 'md' | 'lg' | 'cta';
}

/**
 * Clear, attention-grabbing stock indicator displayed next to a product.
 * Hidden when stock tracking is disabled.
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

  // Label
  let label: string;
  let Icon: React.ElementType = Package;
  if (isOut) {
    label = 'Rupture de stock';
    Icon = XCircle;
  } else if (isLow) {
    label = `🔥 Plus que ${qty} restant${qty > 1 ? 's' : ''} !`;
    Icon = Flame;
  } else {
    label = `${qty} en stock`;
    Icon = Package;
  }

  // Color palettes
  const palette = isOut
    ? 'bg-red-600 text-white border-red-700 shadow-red-500/40'
    : isLow
      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-600 shadow-orange-500/40'
      : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-600 shadow-emerald-500/30';

  // Sizes
  const sizeCls = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1 gap-1.5',
    cta: 'text-sm px-3 py-1 gap-1.5 font-semibold',
  }[size];

  const iconCls = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
    cta: 'w-4 h-4',
  }[size];

  const animate = (isLow || isOut) ? 'animate-pulse' : '';
  const ring = isLow ? 'ring-2 ring-orange-300/60' : isOut ? 'ring-2 ring-red-300/60' : '';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold shadow-lg whitespace-nowrap',
        palette,
        sizeCls,
        animate,
        ring,
        className,
      )}
      aria-label={label}
      role="status"
    >
      <Icon className={cn(iconCls, 'shrink-0')} />
      <span>{label}</span>
    </span>
  );
};

export default StockBadge;
