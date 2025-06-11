
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
          <h1 className="text-3xl font-bold tracking-tight">BWIVOX IPTV Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive management center for your IPTV business operations.
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
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>Track your IPTV business performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Package Distribution</CardTitle>
            <CardDescription>Active packages by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData && Object.entries(categoryData).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="capitalize font-medium">{category} Packages</span>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
              {(!categoryData || Object.keys(categoryData).length === 0) && (
                <p className="text-muted-foreground text-sm">No packages found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Featured IPTV Packages
            </CardTitle>
            <CardDescription>Premium packages highlighted for customers</CardDescription>
          </CardHeader>
          <CardContent>
            {!packagesLoading && featuredPackages.length > 0 ? (
              <div className="space-y-3">
                {featuredPackages.slice(0, 3).map((pkg) => (
                  <div key={pkg.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border">
                    {pkg.icon && <span className="text-2xl">{pkg.icon}</span>}
                    <div className="flex-1">
                      <p className="font-medium">{pkg.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{pkg.category} Package</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700">Featured</Badge>
                  </div>
                ))}
                {featuredPackages.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    +{featuredPackages.length - 3} more featured packages
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No featured packages yet</p>
                <p className="text-sm text-muted-foreground">Mark packages as featured to highlight them</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              Recent IPTV Packages
            </CardTitle>
            <CardDescription>Newly added packages in your catalog</CardDescription>
          </CardHeader>
          <CardContent>
            {!packagesLoading && activePackages.length > 0 ? (
              <div className="space-y-3">
                {activePackages.slice(0, 3).map((pkg) => (
                  <div key={pkg.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border">
                    {pkg.icon && <span className="text-2xl">{pkg.icon}</span>}
                    <div className="flex-1">
                      <p className="font-medium">{pkg.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{pkg.category} Package</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                  </div>
                ))}
                {activePackages.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    +{activePackages.length - 3} more active packages
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No active packages</p>
                <p className="text-sm text-muted-foreground">Create your first IPTV package to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks for your IPTV business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border">
              <Tv className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium">IPTV Subscriptions</p>
                <p className="text-sm text-muted-foreground">Manage customer subscriptions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border">
              <GamepadIcon className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-medium">Player Licenses</p>
                <p className="text-sm text-muted-foreground">Handle player software licenses</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border">
              <Crown className="h-8 w-8 text-orange-600" />
              <div>
                <p className="font-medium">Reseller Accounts</p>
                <p className="text-sm text-muted-foreground">Manage reseller partnerships</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
