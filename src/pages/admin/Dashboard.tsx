
import React, { useEffect, useState } from 'react';
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
  RefreshCw 
} from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { seedOrders } from '@/lib/seedOrders';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { metrics, loading, refetch } = useDashboardMetrics();
  const [seeding, setSeeding] = useState(false);
  const { toast } = useToast();

  const handleSeedOrders = async () => {
    setSeeding(true);
    try {
      const count = await seedOrders();
      if (count > 0) {
        toast({
          title: 'Success',
          description: `Successfully seeded ${count} sample orders`,
        });
        // Refresh the page data
        refetch();
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
            onClick={() => refetch()}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`€${metrics?.totalRevenue.toFixed(2) || '0.00'}`}
          change="+12.5%"
          icon={DollarSign}
          loading={loading}
        />
        <MetricCard
          title="Total Orders"
          value={metrics?.totalOrders.toString() || '0'}
          change="+5.2%"
          icon={ShoppingCart}
          loading={loading}
        />
        <MetricCard
          title="Active Subscriptions"
          value={metrics?.activeSubscriptions.toString() || '0'}
          change="+8.1%"
          icon={Users}
          loading={loading}
        />
        <MetricCard
          title="New Customers"
          value={metrics?.newCustomers.toString() || '0'}
          change="+15.3%"
          icon={TrendingUp}
          loading={loading}
        />
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
            <RecentOrdersTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
