
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Tv, 
  Monitor, 
  GamepadIcon, 
  Crown,
  Star,
  Activity
} from 'lucide-react';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import MetricCard from '@/components/admin/MetricCard';
import SalesChart from '@/components/admin/SalesChart';
import RecentOrdersTable from '@/components/admin/RecentOrdersTable';

const Dashboard = () => {
  const { data: packages = [] } = useIPTVPackages();
  const { data: metrics = [] } = useDashboardMetrics();

  // Calculate package statistics
  const packageStats = {
    total: packages.length,
    active: packages.filter(p => p.status === 'active').length,
    featured: packages.filter(p => p.status === 'featured').length,
    inactive: packages.filter(p => p.status === 'inactive').length,
    subscription: packages.filter(p => p.category === 'subscription').length,
    panelIptv: packages.filter(p => p.category === 'panel-iptv').length,
    player: packages.filter(p => p.category === 'player').length,
    activationPlayer: packages.filter(p => p.category === 'activation-player').length,
  };

  // Calculate revenue metrics (example calculations based on packages)
  const revenueMetrics = {
    totalRevenue: packages.reduce((sum, pkg) => {
      return sum + (pkg.price_25_credits || 0);
    }, 0),
    avgPackagePrice: packages.length > 0 
      ? packages.reduce((sum, pkg) => sum + (pkg.price_25_credits || 0), 0) / packages.length 
      : 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your IPTV service management</p>
        </div>
        <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
          <Activity size={12} />
          System Online
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Packages"
          value={packageStats.total.toString()}
          change="+12%"
          trend="up"
          icon={Package}
        />
        <MetricCard
          title="Active Packages"
          value={packageStats.active.toString()}
          change="+8%"
          trend="up"
          icon={TrendingUp}
        />
        <MetricCard
          title="Featured Packages"
          value={packageStats.featured.toString()}
          change="+23%"
          trend="up"
          icon={Star}
        />
        <MetricCard
          title="Avg Package Price"
          value={`$${revenueMetrics.avgPackagePrice.toFixed(2)}`}
          change="+5%"
          trend="up"
          icon={DollarSign}
        />
      </div>

      {/* Package Categories Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Package Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Tv className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Subscription Packages</span>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  {packageStats.subscription}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Panel IPTV Packages</span>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  {packageStats.panelIptv}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <GamepadIcon className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Player Packages</span>
                </div>
                <Badge className="bg-purple-100 text-purple-700">
                  {packageStats.player}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">Activation Player</span>
                </div>
                <Badge className="bg-orange-100 text-orange-700">
                  {packageStats.activationPlayer}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Package Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Packages</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(packageStats.active / packageStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{packageStats.active}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Featured Packages</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${(packageStats.featured / packageStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{packageStats.featured}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Inactive Packages</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-600 h-2 rounded-full" 
                      style={{ width: `${(packageStats.inactive / packageStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{packageStats.inactive}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Revenue (Est.)</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${revenueMetrics.totalRevenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Package Categories</span>
                    <span className="text-lg font-semibold">4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Featured Rate</span>
                    <span className="text-lg font-semibold">
                      {packageStats.total > 0 ? Math.round((packageStats.featured / packageStats.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentOrdersTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
