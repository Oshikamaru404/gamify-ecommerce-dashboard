import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, Clock, Wallet, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useUserOrders, computeSubscriptionStatus } from '@/hooks/useUserOrders';

const DashboardPage: React.FC = () => {
  const { profile, user } = useUserAuth();
  const { orders, loading } = useUserOrders();

  const stats = useMemo(() => {
    const subs = orders.map(computeSubscriptionStatus);
    const active = subs.filter(s => s.state === 'active' || s.state === 'expiring').length;
    const upcoming = subs.filter(s => s.daysLeft !== null && s.daysLeft >= 0).sort((a, b) => (a.daysLeft! - b.daysLeft!))[0];
    const totalSpent = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.amount || 0), 0);
    return { total: orders.length, active, next: upcoming?.daysLeft ?? null, totalSpent };
  }, [orders]);

  const activeSubs = useMemo(() =>
    orders.map(o => ({ o, s: computeSubscriptionStatus(o) }))
      .filter(x => x.s.state === 'active' || x.s.state === 'expiring')
      .slice(0, 3),
    [orders]);

  const recent = orders.slice(0, 5);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {profile?.display_name || user?.email?.split('@')[0]} 👋</h1>
        <p className="text-muted-foreground text-sm">Here's an overview of your account.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI icon={Package} label="Total orders" value={stats.total} />
        <KPI icon={Calendar} label="Active subs" value={stats.active} />
        <KPI icon={Clock} label="Next expiry" value={stats.next === null ? '—' : `${stats.next}d`} />
        <KPI icon={Wallet} label="Total spent" value={`$${stats.totalSpent.toFixed(2)}`} />
      </div>

      {/* Active subscriptions */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Active subscriptions</h2>
          <Button asChild variant="link" size="sm"><Link to="/account/subscriptions">View all <ArrowRight className="h-3 w-3 ml-1" /></Link></Button>
        </div>
        {activeSubs.length === 0 ? (
          <EmptyState label="No active subscription yet." cta={{ to: '/', label: 'Explore packages' }} />
        ) : (
          <div className="space-y-2">
            {activeSubs.map(({ o, s }) => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="min-w-0">
                  <div className="font-medium truncate">{o.package_name}</div>
                  <div className="text-xs text-muted-foreground">{o.duration_months}M · {o.package_category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={s.state === 'expiring' ? 'destructive' : 'secondary'}>
                    {s.daysLeft}d left
                  </Badge>
                  <Button size="sm" asChild><Link to={`/products`}>Renew</Link></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent orders */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent orders</h2>
          <Button asChild variant="link" size="sm"><Link to="/account/orders">View all <ArrowRight className="h-3 w-3 ml-1" /></Link></Button>
        </div>
        {recent.length === 0 ? (
          <EmptyState label="No orders yet." cta={{ to: '/', label: 'Browse packages' }} />
        ) : (
          <div className="divide-y">
            {recent.map(o => (
              <Link key={o.id} to={`/account/orders/${o.id}`} className="flex items-center justify-between py-3 hover:bg-muted/30 -mx-2 px-2 rounded transition">
                <div className="min-w-0">
                  <div className="font-medium truncate text-sm">{o.package_name}</div>
                  <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">${Number(o.amount).toFixed(2)}</div>
                  <Badge variant={o.payment_status === 'paid' ? 'default' : 'secondary'} className="text-[10px]">{o.payment_status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const KPI: React.FC<{ icon: any; label: string; value: React.ReactNode }> = ({ icon: Icon, label, value }) => (
  <Card className="p-4">
    <Icon className="h-5 w-5 text-primary mb-2" />
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </Card>
);

const EmptyState: React.FC<{ label: string; cta?: { to: string; label: string } }> = ({ label, cta }) => (
  <div className="text-center py-8">
    <p className="text-sm text-muted-foreground mb-3">{label}</p>
    {cta && <Button asChild size="sm"><Link to={cta.to}>{cta.label}</Link></Button>}
  </div>
);

export default DashboardPage;
