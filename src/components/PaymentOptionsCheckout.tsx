import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle, CreditCard, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useLocalizedText } from '@/lib/multilingualUtils';

interface PaymentOptionsCheckoutProps {
  packageData: {
    id: string;
    name: string;
    category: string;
    description?: string;
    icon_url?: string;
    price: number;
    duration: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentOptionsCheckout: React.FC<PaymentOptionsCheckoutProps> = ({ 
  packageData, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerWhatsapp: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: siteSettings } = useSiteSettings();

  const displayName = useLocalizedText(packageData.name);
  const displayDescription = useLocalizedText(packageData.description);

  const whatsappNumber = siteSettings?.find(s => s.setting_key === 'whatsapp_number')?.setting_value || '1234567890';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getDisplayDuration = () => {
    if (packageData.category?.includes('panel')) {
      return `${packageData.duration} Credits`;
    }
    return `${packageData.duration} ${packageData.duration === 1 ? 'Month' : 'Months'}`;
  };

  const handleWhatsAppOrder = async () => {
    if (!formData.customerName || !formData.customerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    try {
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_whatsapp: formData.customerWhatsapp || null,
          package_id: packageData.id,
          package_name: displayName,
          package_category: packageData.category,
          duration_months: packageData.duration,
          amount: packageData.price,
          order_type: 'activation',
          status: 'pending',
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create WhatsApp message
      const message = `🛒 New Order Request

📦 Package: ${displayName}
💰 Price: $${packageData.price}
⏱️ Duration: ${getDisplayDuration()}

👤 Customer Details:
Name: ${formData.customerName}
Email: ${formData.customerEmail}
${formData.customerWhatsapp ? `WhatsApp: ${formData.customerWhatsapp}` : ''}

Order ID: ${orderData.id}`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      toast.success('Order created! Redirecting to WhatsApp...');
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        onSuccess();
      }, 1000);

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCryptoPayment = async () => {
    if (!formData.customerName || !formData.customerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    try {
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_whatsapp: formData.customerWhatsapp || null,
          package_id: packageData.id,
          package_name: displayName,
          package_category: packageData.category,
          duration_months: packageData.duration,
          amount: packageData.price,
          order_type: 'activation',
          status: 'pending',
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create Cryptomus invoice through edge function
      const { data: invoiceData, error: invoiceError } = await supabase.functions.invoke(
        'create-cryptomus-invoice',
        {
          body: {
            packageData: {
              ...packageData,
              name: displayName
            },
            customerInfo: formData,
            orderId: orderData.id
          }
        }
      );

      if (invoiceError) throw invoiceError;

      if (invoiceData.result?.url) {
        // Update order with payment UUID
        await supabase
          .from('orders')
          .update({ 
            payment_status: 'processing',
            customer_whatsapp: formData.customerWhatsapp ? 
              `${formData.customerWhatsapp}|cryptomus:${invoiceData.result.uuid}` : 
              `cryptomus:${invoiceData.result.uuid}`
          })
          .eq('id', orderData.id);

        // Send WhatsApp notification
        if (formData.customerWhatsapp) {
          const notificationMessage = `✅ Payment Link Created

📦 Package: ${displayName}
💰 Amount: $${packageData.price}
👤 Customer: ${formData.customerName}
Order ID: ${orderData.id}

Payment link has been generated. Awaiting payment confirmation.`;

          const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(notificationMessage)}`;
          window.open(whatsappUrl, '_blank');
        }

        toast.success('Redirecting to payment...');
        setTimeout(() => {
          window.location.href = invoiceData.result.url;
        }, 1500);
      } else {
        throw new Error('Failed to create payment invoice');
      }

    } catch (error) {
      console.error('Error creating crypto payment:', error);
      toast.error('Failed to create payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Complete Your Order</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Summary */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                {packageData.icon_url && (
                  <img 
                    src={packageData.icon_url} 
                    alt={displayName}
                    className="w-12 h-12 object-contain"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{displayName}</h3>
                  {displayDescription && (
                    <p className="text-sm text-muted-foreground">{displayDescription}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Duration:</span>
                <span>{getDisplayDuration()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">${packageData.price}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customer Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerWhatsapp">WhatsApp Number (Optional)</Label>
              <Input
                id="customerWhatsapp"
                name="customerWhatsapp"
                value={formData.customerWhatsapp}
                onChange={handleInputChange}
                placeholder="+1234567890"
              />
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Choose Payment Method</h3>
            
            <div className="grid gap-4">
              <Button
                onClick={handleWhatsAppOrder}
                disabled={isProcessing}
                className="w-full h-auto py-4 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <MessageCircle className="h-5 w-5 mr-2" />
                )}
                <div className="text-left flex-1">
                  <div className="font-semibold">Order via WhatsApp</div>
                  <div className="text-xs opacity-90">Complete order through WhatsApp support</div>
                </div>
              </Button>

              <Button
                onClick={handleCryptoPayment}
                disabled={isProcessing}
                className="w-full h-auto py-4"
                variant="default"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="h-5 w-5 mr-2" />
                )}
                <div className="text-left flex-1">
                  <div className="font-semibold">Pay with Cryptocurrency</div>
                  <div className="text-xs opacity-90">Secure payment via Cryptomus</div>
                </div>
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            By proceeding, you agree to our terms of service and privacy policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentOptionsCheckout;
