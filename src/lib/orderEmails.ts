import { supabase } from '@/integrations/supabase/client';

interface OrderEmailInput {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_whatsapp?: string | null;
  package_name: string;
  package_category?: string;
  amount: number;
  order_type?: string;
  payment_status?: string;
  paymentMethodLabel?: string;
  adminEmail?: string;
}

/**
 * Fire-and-forget: send customer order confirmation + admin new-order notification.
 * Safe to call from any checkout flow right after an order row is inserted.
 */
export function triggerOrderEmails(order: OrderEmailInput) {
  const shortId = String(order.id).slice(0, 8).toUpperCase();
  const paymentMethod =
    order.paymentMethodLabel ||
    (order.payment_status === 'pending' ? 'Pending' : order.order_type || 'Online');
  const adminEmail = order.adminEmail || 'bwivox@gmail.com';

  if (order.customer_email) {
    supabase.functions
      .invoke('send-transactional-email', {
        body: {
          templateName: 'order-confirmation',
          recipientEmail: order.customer_email,
          idempotencyKey: `order-confirm-${order.id}`,
          templateData: {
            customerName: order.customer_name,
            orderId: shortId,
            packageName: order.package_name,
            amount: order.amount,
            paymentMethod,
          },
        },
      })
      .catch((e) => console.error('client confirmation email failed', e));
  }

  supabase.functions
    .invoke('send-transactional-email', {
      body: {
        templateName: 'admin-new-order',
        recipientEmail: adminEmail,
        idempotencyKey: `admin-new-order-${order.id}`,
        templateData: {
          orderId: shortId,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerWhatsapp: order.customer_whatsapp,
          packageName: order.package_name,
          packageCategory: order.package_category,
          amount: order.amount,
          paymentMethod,
        },
      },
    })
    .catch((e) => console.error('admin order email failed', e));
}
