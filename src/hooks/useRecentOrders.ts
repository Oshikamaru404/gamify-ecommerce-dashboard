
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/lib/types';

export const useRecentOrders = () => {
  return useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      console.log('Fetching recent orders...');
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching recent orders:', error);
        throw error;
      }
      
      console.log('Successfully fetched recent orders:', data);
      
      // Transform the data to match the Order type
      return data.map(order => ({
        id: order.id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerWhatsapp: order.customer_whatsapp,
        packageName: order.package_name,
        packageCategory: order.package_category,
        durationMonths: order.duration_months,
        orderType: order.order_type,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        status: order.status as any,
        paymentStatus: order.payment_status as any,
        total: Number(order.amount)
      })) as Order[];
    },
  });
};
