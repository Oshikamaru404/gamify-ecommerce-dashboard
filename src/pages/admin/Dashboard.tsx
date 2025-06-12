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
  Activity,
  MessageSquare,
  Mail
} from 'lucide-react';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MetricCard from '@/components/admin/MetricCard';
import SalesChart from '@/components/admin/SalesChart';

// Define metric interface for the dashboard
interface DashboardMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

const Dashboard = () => {
  const { data: packages = [] } = useIPTVPackages();
  const { data: metrics = [] } = useDashboardMetrics();

  // Fetch real feedback data
  const { data: feedbacks = [] } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching feedbacks:', error);
        return [];
      }
      return data;
    },
  });

  // Fetch real newsletter subscriptions
  const { data: newsletterSubscriptions = [] } = useQuery({
    queryKey: ['newsletter-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching newsletter subscriptions:', error);
        return [];
      }
      return data;
    },
  });

  // Calculate package statistics based on categories
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

  // Real revenue metrics (all 0 since no real orders exist)
  const revenueMetrics = {
    totalRevenue: 0, // No real orders yet
    avgPackagePrice: packages.length > 0 
      ? packages.reduce((sum, pkg) => sum + (pkg.price_1_month || 0), 0) / packages.length 
      : 0,
  };

  // Feedback statistics
  const feedbackStats = {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === 'pending').length,
    approved: feedbacks.filter(f => f.status === 'approved').length,
  };

  // Newsletter statistics
  const newsletterStats = {
    total: newsletterSubscriptions.length,
  };

  // Create metric objects for the dashboard (real data)
  const dashboardMetrics: DashboardMetric[] = [
    {
      label: 'Total Packages',
      value: packageStats.total,
      change: 0, // No change since no historical data
      trend: 'up' as const
    },
    {
      label: 'Active Packages',
      value: packageStats.active,
      change: 0,
      trend: 'up' as const
    },
    {
      label: 'Featured Packages',
      value: packageStats.featured,
      change: 0,
      trend: 'up' as const
    },
    {
      label: 'Total Revenue',
      value: revenueMetrics.totalRevenue,
      change: 0,
      trend: 'up' as const
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
                    {metric.label.includes('Revenue') ? `$${metric.value.toFixed(2)}` : metric.value}
                  </p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp size={16} className="mr-1" />
                  {metric.change}%
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
                      style={{ width: `${packageStats.total > 0 ? (packageStats.active / packageStats.total) * 100 : 0}%` }}
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
                      style={{ width: `${packageStats.total > 0 ? (packageStats.featured / packageStats.total) * 100 : 0}%` }}
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
                      style={{ width: `${packageStats.total > 0 ? (packageStats.inactive / packageStats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{packageStats.inactive}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Feedback and Newsletter Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Customer Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Total Feedback</span>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  {feedbackStats.total}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">Pending Reviews</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">
                  {feedbackStats.pending}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Approved</span>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  {feedbackStats.approved}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Newsletter Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Total Subscribers</span>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  {newsletterStats.total}
                </Badge>
              </div>
              
              <div className="text-center py-4">
                <p className="text-sm text-gray-600">
                  {newsletterStats.total > 0 
                    ? `${newsletterStats.total} people subscribed to your newsletter`
                    : 'No newsletter subscriptions yet'
                  }
                </p>
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
          <TabsTrigger value="feedback">Feedback Reviews</TabsTrigger>
          <TabsTrigger value="subscribers">Email Subscribers</TabsTrigger>
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
                    <span className="text-sm font-medium">Total Revenue</span>
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
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-600">When customers place orders, they will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {feedbacks.length > 0 ? (
                <div className="space-y-4">
                  {feedbacks.slice(0, 5).map((feedback) => (
                    <div key={feedback.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{feedback.name}</p>
                        <p className="text-sm text-gray-600">{feedback.comment}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={
                        feedback.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }>
                        {feedback.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Feedback Yet</h3>
                  <p className="text-gray-600">Customer feedback will appear here when submitted.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              {newsletterSubscriptions.length > 0 ? (
                <div className="space-y-4">
                  {newsletterSubscriptions.slice(0, 10).map((subscription) => (
                    <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{subscription.email}</p>
                        <p className="text-xs text-gray-500">
                          Subscribed: {new Date(subscription.subscribed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscribers Yet</h3>
                  <p className="text-gray-600">Newsletter subscribers will appear here when they sign up.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
