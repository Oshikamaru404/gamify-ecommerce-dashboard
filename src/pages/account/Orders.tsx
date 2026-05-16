import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Package as PackageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserOrders } from '@/hooks/useUserOrders';

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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{title || 'My Orders'}</h1>
        <p className="text-muted-foreground text-sm">{filtered.length} order{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by package…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
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
        <Card className="p-10 text-center">
          <PackageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">No orders found.</p>
          <Button asChild><Link to="/">Browse packages</Link></Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map(o => (
            <Link key={o.id} to={`/account/orders/${o.id}`}>
              <Card className="p-4 hover:shadow-md hover:border-primary/40 transition">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold truncate">{o.package_name}</span>
                      <Badge variant="outline" className="text-[10px] uppercase">{o.package_category}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleString()} · {o.duration_months}M · {o.order_type}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <div className="text-lg font-bold">${Number(o.amount).toFixed(2)}</div>
                    <div className="flex gap-1">
                      <Badge variant={o.payment_status === 'paid' ? 'default' : 'secondary'}>{o.payment_status}</Badge>
                      <Badge variant="outline">{o.status}</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
