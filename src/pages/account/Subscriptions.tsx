import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2, Calendar, RefreshCw } from 'lucide-react';
import { useUserOrders, computeSubscriptionStatus } from '@/hooks/useUserOrders';
import { usePackageIcons } from '@/hooks/usePackageIcons';
import { CategoryBadge, SubStateBadge, getCategory, progressColor, ProductIcon } from '@/components/account/AccountUI';
import { cn } from '@/lib/utils';

const SubscriptionsPage: React.FC = () => {
  const { orders, loading } = useUserOrders();
  const icons = usePackageIcons(orders.map(o => o.package_id));

  const subs = useMemo(() =>
    orders
      .filter(o =>
        ['iptv_subscription', 'iptv_panel'].includes(o.package_category)
        && o.order_type !== 'activation'
        && !(o.credentials_notes && /mac/i.test(o.credentials_notes))
      )
      .map(o => ({ o, s: computeSubscriptionStatus(o) }))
      .sort((a, b) => (a.s.daysLeft ?? 9999) - (b.s.daysLeft ?? 9999)),
    [orders]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-red-500" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">My Subscriptions</h1>
        <p className="text-muted-foreground text-sm">{subs.length} subscription{subs.length !== 1 ? 's' : ''}</p>
      </div>

      {subs.length === 0 ? (
        <Card className="p-10 text-center border-dashed border-2 border-red-200">
          <Calendar className="h-12 w-12 mx-auto text-red-300 mb-3" />
          <p className="text-muted-foreground mb-4">No subscription yet.</p>
          <Button asChild className="bg-red-600 hover:bg-red-700"><Link to="/">Browse packages</Link></Button>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {subs.map(({ o, s }) => {
            const totalDays = (o.duration_months || 1) * 30;
            const pct = s.daysLeft !== null ? Math.max(0, Math.min(100, (s.daysLeft / totalDays) * 100)) : 0;
            const c = getCategory(o.package_category);
            const iconUrl = o.package_id ? icons[o.package_id] : undefined;
            return (
              <Card key={o.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all border-0">
                <div className={cn('h-1.5 w-full', c.bg)} />
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <ProductIcon iconUrl={iconUrl} category={o.package_category} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{o.package_name}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <CategoryBadge category={o.package_category} className="text-[10px]" />
                        <span className="text-[11px] text-muted-foreground">{o.duration_months}M</span>
                      </div>
                    </div>
                    <SubStateBadge state={s.state} />
                  </div>

                  <div className="rounded-lg bg-muted/40 p-3 mb-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold">
                        {s.daysLeft !== null && s.daysLeft >= 0 ? `${s.daysLeft} days left` : 'Expired'}
                      </span>
                      <span className="text-muted-foreground">{s.expiresAt?.toLocaleDateString()}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all', progressColor(s.state))} style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" asChild className="flex-1 bg-red-600 hover:bg-red-700"><Link to="/"><RefreshCw className="h-4 w-4 mr-1" /> Renew</Link></Button>
                    <Button size="sm" variant="outline" asChild className="border-red-200 hover:bg-red-50 hover:text-red-600"><Link to={`/account/orders/${o.id}`}>Details</Link></Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
