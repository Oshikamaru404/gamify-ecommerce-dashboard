
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MetricCard from '@/components/admin/MetricCard';
import SalesChart from '@/components/admin/SalesChart';
import RecentOrdersTable from '@/components/admin/RecentOrdersTable';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Database,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useRecentOrders } from '@/hooks/useRecentOrders';
import { seedOrders } from '@/lib/seedOrders';
import { useToast } from '@/hooks/use-toast';
import { Metric } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { data: dashboardData, isLoading: metricsLoading, refetch: refetchMetrics } = useDashboardMetrics();
  const { data: recentOrders, isLoading: ordersLoading, refetch: refetchOrders } = useRecentOrders();
  const [seeding, setSeeding] = useState(false);
  const [resetting, setResetting] = useState(false);
  const { toast } = useToast();

  // Transform dashboard data into metrics format
  const getMetricValue = (metricName: string) => {
    const metric = dashboardData?.find(m => m.metric_name === metricName);
    return metric ? Number(metric.metric_value) : 0;
  };

  const metrics: Metric[] = [
    {
      label: 'Total Revenue',
      value: getMetricValue('total_revenue'),
      change: 12.5,
      trend: 'up' as const
    },
    {
      label: 'Total Orders',
      value: getMetricValue('total_orders'),
      change: 5.2,
      trend: 'up' as const
    },
    {
      label: 'Active Subscriptions',
      value: getMetricValue('active_subscriptions'),
      change: 8.1,
      trend: 'up' as const
    },
    {
      label: 'New Customers',
      value: getMetricValue('new_customers'),
      change: 15.3,
      trend: 'up' as const
    }
  ];

  const handleSeedOrders = async () => {
    setSeeding(true);
    try {
      const count = await seedOrders();
      if (count > 0) {
        toast({
          title: 'Success',
          description: `Successfully seeded ${count} sample orders`,
        });
        // Refresh the data
        refetchMetrics();
        refetchOrders();
      } else {
        toast({
          title: 'Info',
          description: 'Orders already exist, skipping seed',
        });
      }
    } catch (error) {
      console.error('Error seeding orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to seed sample orders',
        variant: 'destructive',
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleResetOrders = async () => {
    if (!confirm('Are you sure you want to delete ALL orders and reset sales data to zero? This action cannot be undone!')) {
      return;
    }

    setResetting(true);
    try {
      // Delete all orders
      const { error: ordersError } = await supabase
        .from('orders')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all orders

      if (ordersError) {
        throw ordersError;
      }

      // Reset dashboard metrics to zero
      const { error: metricsError } = await supabase
        .from('dashboard_metrics')
        .update({ metric_value: 0 })
        .in('metric_name', ['total_revenue', 'total_orders', 'active_subscriptions', 'new_customers']);

      if (metricsError) {
        throw metricsError;
      }

      toast({
        title: 'Success',
        description: 'All orders deleted and sales data reset to zero',
      });

      // Refresh the data
      refetchMetrics();
      refetchOrders();
    } catch (error) {
      console.error('Error resetting orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset orders and sales data',
        variant: 'destructive',
      });
    } finally {
      setResetting(false);
    }
  };

  const handleRefresh = () => {
    refetchMetrics();
    refetchOrders();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">BWIVOX Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your IPTV business performance and manage operations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSeedOrders}
            disabled={seeding}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            {seeding ? 'Seeding...' : 'Seed Sample Orders'}
          </Button>
          <Button
            variant="outline"
            onClick={handleResetOrders}
            disabled={resetting}
            className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            {resetting ? 'Resetting...' : 'Reset All Orders'}
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={metricsLoading || ordersLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${metricsLoading || ordersLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            metric={metric}
          />
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrdersTable orders={recentOrders || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
