
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetricCard from '@/components/admin/MetricCard';
import SalesChart from '@/components/admin/SalesChart';
import { useDashboardMetrics, usePackagesByCategory } from '@/hooks/useDashboardMetrics';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';
import { Badge } from '@/components/ui/badge';
import { Package, Users, DollarSign, TrendingUp, Tv, GamepadIcon, Crown } from 'lucide-react';
import { TimeRange } from '@/lib/types';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: packages, isLoading: packagesLoading } = useIPTVPackages();
  const { data: categoryData } = usePackagesByCategory();

  // Transform metrics data for display
  const dashboardMetrics = metrics ? [
    {
      label: 'Total Revenue',
      value: metrics.find(m => m.metric_name === 'total_revenue')?.metric_value || 0,
      change: 12.5,
      trend: 'up' as const,
    },
    {
      label: 'Total Orders',
      value: metrics.find(m => m.metric_name === 'total_orders')?.metric_value || 0,
      change: 8.2,
      trend: 'up' as const,
    },
    {
      label: 'Active Subscriptions',
      value: metrics.find(m => m.metric_name === 'active_subscriptions')?.metric_value || 0,
      change: 5.1,
      trend: 'up' as const,
    },
    {
      label: 'New Customers',
      value: metrics.find(m => m.metric_name === 'new_customers')?.metric_value || 0,
      change: 15.3,
      trend: 'up' as const,
    },
  ] : [];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'subscription': return <Tv className="h-5 w-5" />;
      case 'player': return <GamepadIcon className="h-5 w-5" />;
      case 'reseller': return <Crown className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const featuredPackages = packages?.filter(pkg => pkg.status === 'featured') || [];
  const activePackages = packages?.filter(pkg => pkg.status === 'active') || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">BWIVOX IPTV Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your IPTV packages, subscriptions, and business metrics.
          </p>
        </div>
        <Tabs defaultValue={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <TabsList>
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {!metricsLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardMetrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-7">
        <SalesChart className="lg:col-span-5" />
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Package Categories</CardTitle>
            <CardDescription>Distribution of active packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData && Object.entries(categoryData).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="capitalize font-medium">{category}</span>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Featured Packages
            </CardTitle>
            <CardDescription>Your premium highlighted packages</CardDescription>
          </CardHeader>
          <CardContent>
            {!packagesLoading && featuredPackages.length > 0 ? (
              <div className="space-y-3">
                {featuredPackages.slice(0, 3).map((pkg) => (
                  <div key={pkg.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border">
                    {pkg.icon && <span className="text-2xl">{pkg.icon}</span>}
                    <div className="flex-1">
                      <p className="font-medium">{pkg.name}</p>
                      <p className="text-sm text-muted-foreground">{pkg.category}</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700">Featured</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No featured packages</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              Recent Packages
            </CardTitle>
            <CardDescription>Recently added packages</CardDescription>
          </CardHeader>
          <CardContent>
            {!packagesLoading && activePackages.length > 0 ? (
              <div className="space-y-3">
                {activePackages.slice(0, 3).map((pkg) => (
                  <div key={pkg.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border">
                    {pkg.icon && <span className="text-2xl">{pkg.icon}</span>}
                    <div className="flex-1">
                      <p className="font-medium">{pkg.name}</p>
                      <p className="text-sm text-muted-foreground">{pkg.category}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No active packages</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
