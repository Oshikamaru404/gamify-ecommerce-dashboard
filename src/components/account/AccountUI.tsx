import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tv, Monitor, Smartphone, Key, Package as PackageIcon, Zap, Crown } from 'lucide-react';

// Brand: vivid red gradients with category-coded accents
export const CATEGORY_STYLES: Record<string, { label: string; bg: string; ring: string; icon: React.ComponentType<any>; text: string }> = {
  iptv_subscription: { label: 'IPTV', bg: 'bg-gradient-to-br from-red-500 to-red-600', ring: 'ring-red-300', icon: Tv, text: 'text-red-700' },
  iptv_panel: { label: 'IPTV Panel', bg: 'bg-gradient-to-br from-orange-500 to-red-500', ring: 'ring-orange-300', icon: Crown, text: 'text-orange-700' },
  player_panel: { label: 'Player Panel', bg: 'bg-gradient-to-br from-purple-500 to-pink-500', ring: 'ring-purple-300', icon: Monitor, text: 'text-purple-700' },
  activation: { label: 'Activation', bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', ring: 'ring-blue-300', icon: Key, text: 'text-blue-700' },
  player: { label: 'Player', bg: 'bg-gradient-to-br from-cyan-500 to-blue-500', ring: 'ring-cyan-300', icon: Smartphone, text: 'text-cyan-700' },
  credits: { label: 'Credits', bg: 'bg-gradient-to-br from-amber-500 to-orange-500', ring: 'ring-amber-300', icon: Zap, text: 'text-amber-700' },
};

export const getCategory = (key?: string) => (key && CATEGORY_STYLES[key]) || { label: key || 'Other', bg: 'bg-gradient-to-br from-slate-500 to-slate-600', ring: 'ring-slate-300', icon: PackageIcon, text: 'text-slate-700' };

// Renders the real product icon (uploaded image) if available, else the category icon.
export const ProductIcon: React.FC<{ iconUrl?: string | null; category?: string; size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ iconUrl, category, size = 'md', className }) => {
  const c = getCategory(category);
  const Icon = c.icon;
  const sizes = { sm: 'h-9 w-9', md: 'h-11 w-11', lg: 'h-14 w-14' };
  const iconSizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-7 w-7' };
  const imgSizes = { sm: 'h-7 w-7', md: 'h-8 w-8', lg: 'h-10 w-10' };

  if (iconUrl) {
    return (
      <div className={cn(sizes[size], 'rounded-xl flex items-center justify-center shrink-0 shadow-md bg-white border-2 p-1 overflow-hidden', className)}
           style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
        <img src={iconUrl} alt="" className={cn(imgSizes[size], 'object-contain')} loading="lazy" />
      </div>
    );
  }
  return (
    <div className={cn(sizes[size], 'rounded-xl flex items-center justify-center text-white shadow-md shrink-0', c.bg, className)}>
      <Icon className={iconSizes[size]} />
    </div>
  );
};

export const CategoryBadge: React.FC<{ category?: string; className?: string }> = ({ category, className }) => {
  const c = getCategory(category);
  const Icon = c.icon;
  return (
    <Badge className={cn(c.bg, 'text-white border-0 gap-1 font-semibold shadow-sm', className)}>
      <Icon className="h-3 w-3" />
      {c.label}
    </Badge>
  );
};

export const CategoryFrame: React.FC<{ category?: string; className?: string; children: React.ReactNode }> = ({ category, className, children }) => {
  const c = getCategory(category);
  return (
    <div className={cn('relative rounded-xl border-l-4 bg-card overflow-hidden', className)} style={{ borderLeftColor: 'currentColor' }}>
      <div className={cn('absolute left-0 top-0 bottom-0 w-1', c.bg)} />
      {children}
    </div>
  );
};

// Payment status: paid=green, pending=amber, failed=red
export const PaymentBadge: React.FC<{ status?: string }> = ({ status }) => {
  const map: Record<string, string> = {
    paid: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    pending: 'bg-amber-500 hover:bg-amber-600 text-white',
    failed: 'bg-red-600 hover:bg-red-700 text-white',
    refunded: 'bg-slate-500 hover:bg-slate-600 text-white',
  };
  return <Badge className={cn('border-0 font-semibold capitalize', map[status || ''] || 'bg-slate-400 text-white')}>{status || 'unknown'}</Badge>;
};

// Order status: completed=green, processing=blue, pending=amber, cancelled=red
export const OrderStatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const map: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    delivered: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    processing: 'bg-blue-100 text-blue-700 border-blue-300',
    pending: 'bg-amber-100 text-amber-700 border-amber-300',
    cancelled: 'bg-red-100 text-red-700 border-red-300',
  };
  return <Badge variant="outline" className={cn('font-semibold capitalize', map[status || ''] || 'bg-slate-100 text-slate-700')}>{status || 'unknown'}</Badge>;
};

// Subscription state: active=green, expiring=amber, expired=red
export const SubStateBadge: React.FC<{ state: string; daysLeft?: number | null }> = ({ state, daysLeft }) => {
  const map: Record<string, string> = {
    active: 'bg-emerald-500 text-white',
    expiring: 'bg-amber-500 text-white',
    expired: 'bg-red-600 text-white',
  };
  const labelMap: Record<string, string> = {
    active: daysLeft !== undefined && daysLeft !== null ? `Active · ${daysLeft}d` : 'Active',
    expiring: daysLeft !== undefined && daysLeft !== null ? `Expiring · ${daysLeft}d` : 'Expiring',
    expired: 'Expired',
  };
  return <Badge className={cn('border-0 font-semibold', map[state] || 'bg-slate-500 text-white')}>{labelMap[state] || state}</Badge>;
};

export const progressColor = (state: string) =>
  state === 'expired' ? 'bg-red-500' : state === 'expiring' ? 'bg-amber-500' : 'bg-emerald-500';
