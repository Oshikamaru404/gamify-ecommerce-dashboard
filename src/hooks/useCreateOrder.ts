
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CreateOrderData {
  package_name: string;
  package_category: string;
  customer_name: string;
  customer_email: string;
  customer_whatsapp?: string;
  amount: number;
  duration_months: number;
  order_type: string;
  status: string;
  payment_status: string;
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      console.log('Creating order with data:', orderData);
      
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw error;
      }

      console.log('Order created successfully:', data);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch recent orders
      queryClient.invalidateQueries({ queryKey: ['recent-orders'] });
    },
  });
};
