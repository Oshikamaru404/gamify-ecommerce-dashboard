import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Package as PackageIcon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserOrders } from '@/hooks/useUserOrders';
import { CategoryBadge, PaymentBadge, OrderStatusBadge, getCategory } from '@/components/account/AccountUI';
import { cn } from '@/lib/utils';

interface Props { paidOnly?: boolean; title?: string; }

const OrdersPage: React.FC<Props> = ({ paidOnly = false, title }) => {
  const { orders, loading } = useUserOrders();
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

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">{title || 'My Orders'}</h1>
        <p className="text-muted-foreground text-sm">{filtered.length} order{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      <Card className="p-3 flex flex-col sm:flex-row gap-2 border-red-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400" />
          <Input placeholder="Search by package…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 border-red-100 focus-visible:ring-red-400" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-44 border-red-100"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
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
            const c = getCategory(o.package_category);
            const Icon = c.icon;
            return (
              <Link key={o.id} to={`/account/orders/${o.id}`}>
                <Card className="overflow-hidden border-l-4 hover:shadow-lg transition-all active:scale-[0.99]" style={{ borderLeftColor: 'transparent' }}>
                  <div className="flex items-stretch">
                    {/* Category color rail */}
                    <div className={cn('w-1.5 shrink-0', c.bg)} />
                    <div className="flex-1 p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center text-white shadow-md shrink-0', c.bg)}>
                          <Icon className="h-5 w-5" />
                        </div>
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
