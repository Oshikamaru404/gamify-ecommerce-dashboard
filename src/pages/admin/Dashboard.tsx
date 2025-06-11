
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign,
  Tv,
  Crown,
  Monitor
} from 'lucide-react';
import MetricCard from '@/components/admin/MetricCard';
import SalesChart from '@/components/admin/SalesChart';
import RecentOrdersTable from '@/components/admin/RecentOrdersTable';
import { useDashboardMetrics, usePackagesByCategory } from '@/hooks/useDashboardMetrics';
import { useInitializeSubscriptions } from '@/hooks/useInitializeSubscriptions';

const Dashboard = () => {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: packagesByCategory, isLoading: packagesLoading } = usePackagesByCategory();
  
  // Initialize subscriptions if none exist
  useInitializeSubscriptions();
  
  // Calculate totals from real data
  const totalPackages = packagesByCategory 
    ? Object.values(packagesByCategory).reduce((sum, count) => sum + count, 0)
    : 0;

  const mainMetrics = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up" as const,
      icon: DollarSign,
    },
    {
      title: "Active Subscriptions", 
      value: "2,350",
      change: "+180.1%",
      trend: "up" as const,
      icon: Users,
    },
    {
      title: "IPTV Packages",
      value: totalPackages.toString(),
      change: "+19%",
      trend: "up" as const,
      icon: Package,
    },
    {
      title: "Monthly Growth",
      value: "12.5%",
      change: "+4.75%", 
      trend: "up" as const,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your IPTV business performance and key metrics.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mainMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tv className="h-5 w-5" />
              Package Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!packagesLoading && packagesByCategory ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tv className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Subscriptions</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">
                      {packagesByCategory.subscription || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Reseller</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700">
                      {packagesByCategory.reseller || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Player</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {packagesByCategory.player || 0}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrdersTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
