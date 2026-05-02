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

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

/**
 * Send via fetch with keepalive:true so the request survives a page
 * navigation (e.g. WhatsApp / PayGate redirect right after order creation).
 * supabase.functions.invoke uses a normal fetch which the browser cancels
 * when the page unloads, which is why test orders never reached the function.
 */
function sendEmail(body: Record<string, unknown>) {
  try {
    const url = `${SUPABASE_URL}/functions/v1/send-transactional-email`;
    return fetch(url, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
      },
      body: JSON.stringify(body),
    }).catch((e) => console.error('email send failed', e));
  } catch (e) {
    console.error('email send threw', e);
  }
}

/**
 * Fire-and-forget: send customer order confirmation + admin new-order notification.
 * Safe to call from any checkout flow right after an order row is inserted,
 * even immediately before a redirect.
 */
export async function triggerOrderEmails(order: OrderEmailInput) {
  const shortId = String(order.id).slice(0, 8).toUpperCase();
  const paymentMethod =
    order.paymentMethodLabel ||
    (order.payment_status === 'pending' ? 'Pending' : order.order_type || 'Online');
  const adminEmail = order.adminEmail || 'bwivox@gmail.com';

  const tasks: Array<Promise<unknown> | undefined> = [];

  if (order.customer_email) {
    tasks.push(
      sendEmail({
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
      }),
    );
  }

  tasks.push(
    sendEmail({
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
    }),
  );

  // Best-effort: silence Supabase reference to suppress unused-import lint.
  void supabase;

  await Promise.allSettled(tasks);
}
