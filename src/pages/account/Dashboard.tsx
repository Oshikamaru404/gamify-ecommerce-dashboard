import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Calendar, Clock, Wallet, ArrowRight, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useUserOrders, computeSubscriptionStatus } from '@/hooks/useUserOrders';
import { CategoryBadge, PaymentBadge, SubStateBadge, ProductIcon } from '@/components/account/AccountUI';
import { usePackageIcons } from '@/hooks/usePackageIcons';
import { cn } from '@/lib/utils';

const DashboardPage: React.FC = () => {
  const { profile, user } = useUserAuth();
  const { orders, loading } = useUserOrders();
  const icons = usePackageIcons(orders.map(o => o.package_id));

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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-red-500" /></div>;

  const name = profile?.display_name || user?.email?.split('@')[0];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Hero welcome */}
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-orange-500" />
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-20 bottom-0 w-32 h-32 rounded-full bg-amber-300/20 blur-2xl" />
        <div className="relative p-5 sm:p-8 text-white">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
            <Sparkles className="h-3 w-3" /> Welcome back
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">{name} 👋</h1>
          <p className="text-white/90 text-sm mt-1">Here's an overview of your account.</p>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI icon={Package} label="Total orders" value={stats.total} gradient="from-red-500 to-orange-500" />
        <KPI icon={Calendar} label="Active subs" value={stats.active} gradient="from-emerald-500 to-teal-500" />
        <KPI icon={Clock} label="Next expiry" value={stats.next === null ? '—' : `${stats.next}d`} gradient="from-amber-500 to-orange-500" />
        <KPI icon={Wallet} label="Total spent" value={`$${stats.totalSpent.toFixed(0)}`} gradient="from-purple-500 to-pink-500" />
      </div>

      {/* Active subscriptions */}
      <Card className="overflow-hidden border-red-100 shadow-md">
        <div className="flex items-center justify-between p-4 sm:px-6 border-b bg-gradient-to-r from-red-50 to-white">
          <h2 className="font-bold flex items-center gap-2 text-red-700"><TrendingUp className="h-4 w-4" /> Active subscriptions</h2>
          <Button asChild variant="link" size="sm" className="text-red-600"><Link to="/account/subscriptions">View all <ArrowRight className="h-3 w-3 ml-1" /></Link></Button>
        </div>
        <div className="p-3 sm:p-4">
          {activeSubs.length === 0 ? (
            <EmptyState label="No active subscription yet." cta={{ to: '/', label: 'Explore packages' }} />
          ) : (
            <div className="space-y-2">
              {activeSubs.map(({ o, s }) => {
                const c = getCategory(o.package_category);
                const Icon = c.icon;
                return (
                  <div key={o.id} className="flex items-center justify-between p-3 rounded-xl border-2 border-transparent hover:border-red-200 bg-gradient-to-r from-white to-red-50/40 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-md shrink-0', c.bg)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold truncate text-sm">{o.package_name}</div>
                        <div className="text-[11px] text-muted-foreground">{o.duration_months}M</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <SubStateBadge state={s.state} daysLeft={s.daysLeft} />
                      <Button size="sm" asChild className="bg-red-600 hover:bg-red-700 hidden sm:inline-flex"><Link to={`/`}>Renew</Link></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Recent orders */}
      <Card className="overflow-hidden border-orange-100 shadow-md">
        <div className="flex items-center justify-between p-4 sm:px-6 border-b bg-gradient-to-r from-orange-50 to-white">
          <h2 className="font-bold flex items-center gap-2 text-orange-700"><Package className="h-4 w-4" /> Recent orders</h2>
          <Button asChild variant="link" size="sm" className="text-orange-600"><Link to="/account/orders">View all <ArrowRight className="h-3 w-3 ml-1" /></Link></Button>
        </div>
        <div className="divide-y">
          {recent.length === 0 ? (
            <div className="p-4"><EmptyState label="No orders yet." cta={{ to: '/', label: 'Browse packages' }} /></div>
          ) : (
            recent.map(o => (
              <Link key={o.id} to={`/account/orders/${o.id}`} className="flex items-center justify-between p-3 sm:px-6 hover:bg-red-50/40 transition">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold truncate text-sm">{o.package_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <CategoryBadge category={o.package_category} className="text-[10px] py-0 px-1.5" />
                    <span>{new Date(o.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-sm font-bold text-red-600">${Number(o.amount).toFixed(2)}</div>
                  <PaymentBadge status={o.payment_status} />
                </div>
              </Link>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

const KPI: React.FC<{ icon: any; label: string; value: React.ReactNode; gradient: string }> = ({ icon: Icon, label, value, gradient }) => (
  <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
    <div className={cn('absolute inset-0 opacity-10 bg-gradient-to-br', gradient)} />
    <div className="relative p-3 sm:p-4">
      <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center text-white shadow-md mb-2 bg-gradient-to-br', gradient)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-xl sm:text-2xl font-extrabold">{value}</div>
      <div className="text-[11px] sm:text-xs text-muted-foreground font-medium">{label}</div>
    </div>
  </Card>
);

const EmptyState: React.FC<{ label: string; cta?: { to: string; label: string } }> = ({ label, cta }) => (
  <div className="text-center py-6">
    <p className="text-sm text-muted-foreground mb-3">{label}</p>
    {cta && <Button asChild size="sm" className="bg-red-600 hover:bg-red-700"><Link to={cta.to}>{cta.label}</Link></Button>}
  </div>
);

export default DashboardPage;
