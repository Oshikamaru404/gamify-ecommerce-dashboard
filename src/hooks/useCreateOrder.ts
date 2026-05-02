
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CreateOrderData {
  package_name: string;
  package_category: string;
  package_image_url?: string | null;
  customer_name: string;
  customer_email: string;
  customer_whatsapp?: string;
  amount: number;
  currency?: string;
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

      // Fire-and-forget: client confirmation + admin notification
      const shortId = String(data.id).slice(0, 8).toUpperCase();
      const paymentMethod =
        orderData.payment_status === 'pending' ? 'Pending' :
        orderData.order_type || 'Online';

      const months = Number(orderData.duration_months || 0);
      const durationLabel = months > 0
        ? months === 1 ? '1 month' : months === 12 ? '12 months (1 year)' : `${months} months`
        : undefined;

      if (orderData.customer_email) {
        supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'order-confirmation',
            recipientEmail: orderData.customer_email,
            idempotencyKey: `order-confirm-${data.id}`,
            templateData: {
              customerName: orderData.customer_name,
              orderId: shortId,
              packageName: orderData.package_name,
              packageCategory: orderData.package_category,
              packageImageUrl: orderData.package_image_url || undefined,
              durationLabel,
              amount: orderData.amount,
              currency: orderData.currency || 'EUR',
              paymentMethod,
            },
          },
        }).catch((e) => console.error('client confirmation email failed', e));
      }

      supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'admin-new-order',
          recipientEmail: 'bwivox@gmail.com',
          idempotencyKey: `admin-new-order-${data.id}`,
          templateData: {
            orderId: shortId,
            customerName: orderData.customer_name,
            customerEmail: orderData.customer_email,
            customerWhatsapp: orderData.customer_whatsapp,
            packageName: orderData.package_name,
            packageCategory: orderData.package_category,
            amount: orderData.amount,
            paymentMethod,
          },
        },
      }).catch((e) => console.error('admin order email failed', e));

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-orders'] });
    },
  });
};
