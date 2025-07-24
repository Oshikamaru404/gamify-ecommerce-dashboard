import { supabase } from '@/integrations/supabase/client';

export interface WhatsAppMessage {
  to: string;
  message: string;
  orderData?: {
    orderId: string;
    customerName: string;
    packageName: string;
    status: string;
    paymentStatus: string;
  };
}

export const sendWhatsAppMessage = async (data: WhatsAppMessage): Promise<boolean> => {
  try {
    console.log('Sending WhatsApp message:', data);
    
    // Call our edge function to send the WhatsApp message
    const { data: result, error } = await supabase.functions.invoke('send-whatsapp-notification', {
      body: data
    });

    if (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }

    console.log('WhatsApp message sent successfully:', result);
    return true;
  } catch (error) {
    console.error('WhatsApp service error:', error);
    return false;
  }
};

export const formatOrderStatusMessage = (
  customerName: string,
  orderId: string,
  packageName: string,
  status: string,
  paymentStatus: string
): string => {
  const statusEmoji = {
    'pending': '⏳',
    'processing': '🔄',
    'shipped': '📦',
    'delivered': '✅',
    'cancelled': '❌'
  };

  const paymentEmoji = {
    'pending': '⏳',
    'paid': '✅',
    'failed': '❌',
    'refunded': '💰'
  };

  return `🎯 *BWIVOX IPTV Order Update*

Hi ${customerName}! 👋

📋 *Order Details:*
• Order ID: ${orderId.slice(0, 8)}...
• Package: ${packageName}
• Status: ${statusEmoji[status as keyof typeof statusEmoji] || '📄'} ${status.toUpperCase()}
• Payment: ${paymentEmoji[paymentStatus as keyof typeof paymentEmoji] || '💳'} ${paymentStatus.toUpperCase()}

${status === 'processing' ? '🚀 Your order is being processed!' : ''}
${status === 'delivered' ? '🎉 Your order has been delivered! Enjoy your IPTV service.' : ''}
${paymentStatus === 'paid' ? '✅ Payment confirmed!' : ''}

📞 Need help? Contact our support team!

Thank you for choosing BWIVOX IPTV! 🌟`;
};

export const formatWelcomeMessage = (customerName: string, packageName: string): string => {
  return `🎉 *Welcome to BWIVOX IPTV!*

Hi ${customerName}! 👋

Thank you for purchasing ${packageName}! 🎯

🚀 *What's Next:*
• Your order is being processed
• You'll receive activation details shortly
• Our support team is ready to help

📞 *Support Contact:*
• WhatsApp: Available 24/7
• Telegram: @bwivoxiptv

Welcome to the BWIVOX family! 🌟`;
};
