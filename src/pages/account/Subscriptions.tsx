import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Loader2, Calendar, RefreshCw } from 'lucide-react';
import { useUserOrders, computeSubscriptionStatus } from '@/hooks/useUserOrders';

const SubscriptionsPage: React.FC = () => {
  const { orders, loading } = useUserOrders();

  const subs = useMemo(() =>
    orders
      .filter(o => ['iptv_subscription', 'iptv_panel', 'player_panel'].includes(o.package_category) || o.duration_months > 0)
      .map(o => ({ o, s: computeSubscriptionStatus(o) }))
      .filter(x => x.s.expiresAt !== null)
      .sort((a, b) => (a.s.daysLeft ?? 9999) - (b.s.daysLeft ?? 9999)),
    [orders]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">My Subscriptions</h1>
        <p className="text-muted-foreground text-sm">{subs.length} subscription{subs.length !== 1 ? 's' : ''}</p>
      </div>

      {subs.length === 0 ? (
        <Card className="p-10 text-center">
          <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">No subscription yet.</p>
          <Button asChild><Link to="/">Browse packages</Link></Button>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {subs.map(({ o, s }) => {
            const totalDays = (o.duration_months || 1) * 30;
            const pct = s.daysLeft !== null ? Math.max(0, Math.min(100, (s.daysLeft / totalDays) * 100)) : 0;
            const stateColor = s.state === 'expired' ? 'destructive' : s.state === 'expiring' ? 'secondary' : 'default';
            return (
              <Card key={o.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{o.package_name}</div>
                    <div className="text-xs text-muted-foreground">{o.duration_months}M · {o.package_category}</div>
                  </div>
                  <Badge variant={stateColor as any}>{s.state}</Badge>
                </div>
                <div className="mt-3 mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {s.daysLeft !== null && s.daysLeft >= 0
                      ? `${s.daysLeft} days left`
                      : 'Expired'}
                  </span>
                  <span className="text-muted-foreground">Expires {s.expiresAt?.toLocaleDateString()}</span>
                </div>
                <Progress value={pct} className="h-2" />
                <div className="mt-4 flex gap-2">
                  <Button size="sm" asChild className="flex-1"><Link to="/"><RefreshCw className="h-4 w-4 mr-1" /> Renew</Link></Button>
                  <Button size="sm" variant="outline" asChild><Link to={`/account/orders/${o.id}`}>Details</Link></Button>
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
