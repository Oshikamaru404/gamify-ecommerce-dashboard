
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

// Define metric interface for the dashboard
interface DashboardMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

// Define order interface for recent orders
interface DashboardOrder {
  id: string;
  customerName: string;
  createdAt: string;
  status: 'delivered' | 'processing' | 'pending';
  paymentStatus: 'paid' | 'pending';
  total: number;
}

const Dashboard = () => {
  const { data: packages = [] } = useIPTVPackages();
  const { data: metrics = [] } = useDashboardMetrics();

  // Calculate package statistics based on new categories
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

  // Create metric objects for the dashboard
  const dashboardMetrics: DashboardMetric[] = [
    {
      label: 'Total Packages',
      value: packageStats.total,
      change: 12,
      trend: 'up' as const
    },
    {
      label: 'Active Packages',
      value: packageStats.active,
      change: 8,
      trend: 'up' as const
    },
    {
      label: 'Featured Packages',
      value: packageStats.featured,
      change: 23,
      trend: 'up' as const
    },
    {
      label: 'Avg Package Price',
      value: revenueMetrics.avgPackagePrice,
      change: 5,
      trend: 'up' as const
    }
  ];

  // Sample orders data
  const sampleOrders: DashboardOrder[] = [
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      createdAt: '2024-01-15T10:30:00Z',
      status: 'delivered',
      paymentStatus: 'paid',
      total: 45.99
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      createdAt: '2024-01-14T14:20:00Z',
      status: 'processing',
      paymentStatus: 'paid',
      total: 85.99
    },
    {
      id: 'ORD-003',
      customerName: 'Mike Johnson',
      createdAt: '2024-01-13T09:15:00Z',
      status: 'pending',
      paymentStatus: 'pending',
      total: 25.99
    }
  ];

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
        {dashboardMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.label.includes('Price') ? `$${metric.value.toFixed(2)}` : metric.value}
                  </p>
                </div>
                <div className={`flex items-center text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp size={16} className="mr-1" />
                  +{metric.change}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
              <div className="space-y-4">
                {sampleOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-600">Order #{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total}</p>
                      <Badge className={
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
