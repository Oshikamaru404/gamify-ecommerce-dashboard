
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type DashboardMetric = {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_date: string | null;
  created_at: string | null;
};

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      console.log('Calculating dashboard metrics from actual order data...');
      
      // Fetch all orders to calculate metrics
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*');
      
      if (error) {
        console.error('Error fetching orders for metrics:', error);
        throw error;
      }
      
      // Calculate metrics based on actual order data
      const paidOrders = orders.filter(order => order.payment_status === 'paid');
      const refundedOrders = orders.filter(order => order.payment_status === 'refunded');
      
      // Calculate total revenue (paid orders minus refunded orders)
      const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.amount), 0) - 
                          refundedOrders.reduce((sum, order) => sum + Number(order.amount), 0);
      
      // Calculate total orders (only count paid orders)
      const totalOrders = paidOrders.length;
      
      // Calculate active subscriptions (subscription category orders that are paid)
      const activeSubscriptions = paidOrders.filter(order => 
        order.package_category === 'subscription'
      ).length;
      
      // Calculate new customers (unique customers from paid orders in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentPaidOrders = paidOrders.filter(order => 
        new Date(order.created_at || '') >= thirtyDaysAgo
      );
      
      const uniqueCustomers = new Set(recentPaidOrders.map(order => order.customer_email));
      const newCustomers = uniqueCustomers.size;
      
      // Return calculated metrics in the expected format
      const calculatedMetrics: DashboardMetric[] = [
        {
          id: '1',
          metric_name: 'total_revenue',
          metric_value: totalRevenue,
          metric_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          metric_name: 'total_orders',
          metric_value: totalOrders,
          metric_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          metric_name: 'active_subscriptions',
          metric_value: activeSubscriptions,
          metric_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          metric_name: 'new_customers',
          metric_value: newCustomers,
          metric_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        }
      ];
      
      console.log('Successfully calculated dashboard metrics:', calculatedMetrics);
      return calculatedMetrics;
    },
  });
};

export const usePackagesByCategory = () => {
  return useQuery({
    queryKey: ['packages-by-category'],
    queryFn: async () => {
      console.log('Fetching packages by category...');
      
      const { data, error } = await supabase
        .from('iptv_packages')
        .select('category')
        .eq('status', 'active');
      
      if (error) {
        console.error('Error fetching packages by category:', error);
        throw error;
      }
      
      const categoryCounts = data.reduce((acc, pkg) => {
        acc[pkg.category] = (acc[pkg.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('Successfully calculated category counts:', categoryCounts);
      return categoryCounts;
    },
  });
};
