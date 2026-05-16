import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Package as PackageIcon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserOrders } from '@/hooks/useUserOrders';
import { usePackageIcons } from '@/hooks/usePackageIcons';
import { CategoryBadge, PaymentBadge, OrderStatusBadge, ProductIcon } from '@/components/account/AccountUI';
import { cn } from '@/lib/utils';

interface Props { paidOnly?: boolean; title?: string; }

const OrdersPage: React.FC<Props> = ({ paidOnly = false, title }) => {
  const { orders, loading } = useUserOrders();
  const icons = usePackageIcons(orders.map(o => o.package_id));
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (paidOnly && o.payment_status !== 'paid') return false;
      if (status !== 'all' && o.status !== status) return false;
      if (search && !o.package_name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [orders, search, status, paidOnly]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-red-500" /></div>;

  const counts = useMemo(() => {
    const base = orders.filter(o => !paidOnly || o.payment_status === 'paid');
    return {
      all: base.length,
      pending: base.filter(o => o.status === 'pending').length,
      processing: base.filter(o => o.status === 'processing').length,
      completed: base.filter(o => o.status === 'completed' || o.status === 'delivered').length,
      cancelled: base.filter(o => o.status === 'cancelled').length,
    };
  }, [orders, paidOnly]);

  const statusChips: { key: string; label: string; cls: string; activeCls: string }[] = [
    { key: 'all', label: 'All', cls: 'bg-slate-100 text-slate-700 hover:bg-slate-200', activeCls: 'bg-slate-700 text-white' },
    { key: 'pending', label: 'Pending', cls: 'bg-amber-100 text-amber-700 hover:bg-amber-200', activeCls: 'bg-amber-500 text-white' },
    { key: 'processing', label: 'Processing', cls: 'bg-blue-100 text-blue-700 hover:bg-blue-200', activeCls: 'bg-blue-600 text-white' },
    { key: 'completed', label: 'Completed', cls: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200', activeCls: 'bg-emerald-600 text-white' },
    { key: 'cancelled', label: 'Cancelled', cls: 'bg-red-100 text-red-700 hover:bg-red-200', activeCls: 'bg-red-600 text-white' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">{title || 'My Orders'}</h1>
        <p className="text-muted-foreground text-sm">{filtered.length} order{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusChips.map(chip => {
          const active = status === chip.key;
          const count = counts[chip.key as keyof typeof counts];
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => setStatus(chip.key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                active ? chip.activeCls + ' shadow-md scale-105' : chip.cls
              )}
            >
              {chip.label}
              <span className={cn('ml-1.5 inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 rounded-full text-[10px] font-bold', active ? 'bg-white/25 text-white' : 'bg-white/80')}>{count}</span>
            </button>
          );
        })}
      </div>

      <Card className="p-3 border-red-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400" />
          <Input placeholder="Search by package…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 border-red-100 focus-visible:ring-red-400" />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center border-dashed border-2 border-red-200">
          <PackageIcon className="h-12 w-12 mx-auto text-red-300 mb-3" />
          <p className="text-muted-foreground mb-4">No orders found.</p>
          <Button asChild className="bg-red-600 hover:bg-red-700"><Link to="/">Browse packages</Link></Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map(o => {
            const iconUrl = o.package_id ? icons[o.package_id] : undefined;
            return (
              <Link key={o.id} to={`/account/orders/${o.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all active:scale-[0.99]">
                  <div className="flex items-stretch">
                    <div className="flex-1 p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <ProductIcon iconUrl={iconUrl} category={o.package_category} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-bold text-sm sm:text-base truncate">{o.package_name}</span>
                            <div className="text-base sm:text-lg font-extrabold text-red-600 shrink-0">${Number(o.amount).toFixed(2)}</div>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            <CategoryBadge category={o.package_category} className="text-[10px]" />
                            <span className="text-[11px] text-muted-foreground">{o.duration_months}M · #{o.id.slice(0, 6)}</span>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <PaymentBadge status={o.payment_status} />
                              <OrderStatusBadge status={o.status} />
                            </div>
                            <div className="flex items-center text-[11px] text-muted-foreground">
                              <span>{new Date(o.created_at).toLocaleDateString()}</span>
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
