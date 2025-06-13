
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  ShoppingCart, 
  Calendar,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useDashboardMetrics, usePackagesByCategory } from '@/hooks/useDashboardMetrics';
import MetricCard from '@/components/admin/MetricCard';
import SalesChart from '@/components/admin/SalesChart';
import RecentOrdersTable from '@/components/admin/RecentOrdersTable';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Simple order type for the recent orders table
type SimpleOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  total: number;
};

// Sample orders data for the table
const recentOrders: SimpleOrder[] = [
  {
    id: 'IPTV-2024-001',
    customerName: 'Ahmed Hassan',
    customerEmail: 'ahmed.hassan@gmail.com',
    createdAt: '2024-06-10T14:30:00Z',
    status: 'delivered',
    paymentStatus: 'paid',
    total: 15.99
  },
  {
    id: 'IPTV-2024-002', 
    customerName: 'Sophie Martin',
    customerEmail: 'sophie.martin@hotmail.fr',
    createdAt: '2024-06-11T09:15:00Z',
    status: 'processing',
    paymentStatus: 'paid',
    total: 29.99
  },
  {
    id: 'IPTV-2024-003',
    customerName: 'Mohamed Benali',
    customerEmail: 'm.benali@yahoo.com',
    createdAt: '2024-06-11T11:45:00Z',
    status: 'shipped',
    paymentStatus: 'paid',
    total: 49.99
  }
];

const Dashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: packagesByCategory, isLoading: packagesLoading } = usePackagesByCategory();

  // Sample data for charts
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
  ];

  const packageCategoryData = packagesByCategory ? Object.entries(packagesByCategory).map(([category, count]) => ({
    name: category,
    value: count,
    color: category === 'subscription' ? '#ef4444' : 
           category === 'panel-iptv' ? '#3b82f6' :
           category === 'player' ? '#10b981' :
           category === 'activation-player' ? '#f59e0b' : '#6b7280'
  })) : [];

  const handleDeleteAllFeedback = async () => {
    setIsDeleting(true);
    try {
      const { data, error } = await supabase.rpc('delete_all_published_feedback');
      
      if (error) {
        console.error('Error deleting feedback:', error);
        toast({
          title: t.error,
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log(`Deleted ${data} feedback entries`);
        toast({
          title: t.success,
          description: t.feedbackDeleted,
        });
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast({
        title: t.error,
        description: 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetSales = async () => {
    setIsResetting(true);
    try {
      const { data, error } = await supabase.rpc('reset_product_sales');
      
      if (error) {
        console.error('Error resetting sales:', error);
        toast({
          title: t.error,
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log(`Reset ${data} sales metrics`);
        toast({
          title: t.success,
          description: t.salesReset,
        });
      }
    } catch (error) {
      console.error('Error resetting sales:', error);
      toast({
        title: t.error,
        description: 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (metricsLoading || packagesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.adminDashboard}</h1>
          <p className="text-muted-foreground">
            Welcome to your IPTV administration dashboard
          </p>
        </div>
        
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                {t.deleteAllFeedback}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.deleteAllFeedback}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.deleteAllFeedbackConfirm}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAllFeedback}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? t.loading : t.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-orange-600 hover:bg-orange-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.resetSales}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.resetSales}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.resetSalesConfirm}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleResetSales}
                  disabled={isResetting}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isResetting ? t.loading : t.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value="€12,345"
          change={12}
          trend="up"
          icon={DollarSign}
        />
        <MetricCard
          title="Active Subscriptions"
          value="1,234"
          change={5}
          trend="up"
          icon={Users}
        />
        <MetricCard
          title="IPTV Packages"
          value="24"
          change={8}
          trend="up"
          icon={Package}
        />
        <MetricCard
          title="Orders This Month"
          value="89"
          change={-3}
          trend="down"
          icon={ShoppingCart}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <SalesChart data={salesData} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Package Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={packageCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {packageCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent IPTV Orders
            </CardTitle>
            <Badge variant="secondary">
              {recentOrders.length} orders
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <RecentOrdersTable orders={recentOrders} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
