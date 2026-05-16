import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Key, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserOrders } from '@/hooks/useUserOrders';
import { useToast } from '@/hooks/use-toast';
import { CategoryBadge, getCategory, ProductIcon } from '@/components/account/AccountUI';
import { usePackageIcons } from '@/hooks/usePackageIcons';
import { cn } from '@/lib/utils';

const ActivationsPage: React.FC = () => {
  const { orders, loading } = useUserOrders();
  const icons = usePackageIcons(orders.map(o => o.package_id));
  const { toast } = useToast();
  const acts = useMemo(() => orders.filter(o =>
    o.order_type === 'activation'
    || o.package_category === 'activation'
    || o.package_category === 'player'
    || (o.credentials_notes && /mac/i.test(o.credentials_notes))
  ), [orders]);

  const copy = (v: string) => { navigator.clipboard.writeText(v); toast({ title: 'Copied' }); };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-red-500" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Activation Details</h1>
        <p className="text-muted-foreground text-sm">Your player activations and device credentials.</p>
      </div>

      {acts.length === 0 ? (
        <Card className="p-10 text-center border-dashed border-2 border-blue-200">
          <Key className="h-12 w-12 mx-auto text-blue-300 mb-3" />
          <p className="text-muted-foreground mb-4">No activation yet.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700"><Link to="/activation">Browse activations</Link></Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          {acts.map(o => {
            const macMatch = o.credentials_notes?.match(/([0-9A-F]{2}:){5}[0-9A-F]{2}/i);
            const c = getCategory(o.package_category || 'activation');
            const iconUrl = o.package_id ? icons[o.package_id] : undefined;
            return (
              <Card key={o.id} className="overflow-hidden shadow-md hover:shadow-lg transition-all border-0">
                <div className={cn('h-1.5 w-full', c.bg)} />
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <ProductIcon iconUrl={iconUrl} category={o.package_category || 'activation'} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-bold truncate">{o.package_name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <CategoryBadge category={o.package_category || 'activation'} className="text-[10px]" />
                            <span className="text-[11px] text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button asChild size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50 hover:text-blue-600 w-full sm:w-auto">
                          <Link to={`/account/orders/${o.id}`}>View details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {macMatch && (
                    <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
                        <Key className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-blue-700">MAC Address</div>
                        <div className="font-mono text-sm font-bold text-blue-900 truncate">{macMatch[0]}</div>
                      </div>
                      <Button size="icon" variant="ghost" className="hover:bg-blue-100 text-blue-700 shrink-0" onClick={() => copy(macMatch[0])}><Copy className="h-4 w-4" /></Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivationsPage;
