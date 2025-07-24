
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X, Package, CreditCard, User, Mail, Phone, Bitcoin, Loader2 } from 'lucide-react';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CheckoutFormProps {
  packageData: {
    id: string;
    name: string;
    category: string;
    price: number;
    duration: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ packageData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerWhatsapp: '',
    paymentMethod: 'cod' as 'cod' | 'crypto',
  });
  const [isProcessingCrypto, setIsProcessingCrypto] = useState(false);

  const createOrderMutation = useCreateOrder();

  // Fixed theme detection logic
  const theme = packageData.category === 'panel' || 
                packageData.category === 'iptv-panel' || 
                packageData.category === 'player-panel' ||
                packageData.name.toLowerCase().includes('panel') ||
                packageData.name.toLowerCase().includes('iptv panel') ||
                packageData.name.toLowerCase().includes('player panel')
                ? 'purple' : 'red';

  // Theme-based styling
  const themeColors = {
    purple: {
      primary: 'bg-[#8f35e5] hover:bg-[#7c2fd4]',
      primaryText: 'text-[#8f35e5]',
      primaryBg: 'bg-gradient-to-r from-[#8f35e5] to-[#7c2fd4]',
      focus: 'focus:border-[#8f35e5] focus:ring-[#8f35e5]',
      accent: 'bg-gradient-to-r from-gray-50 to-gray-100',
      cryptoButton: 'bg-gradient-to-r from-[#8f35e5] to-[#7c2fd4] hover:from-[#7c2fd4] hover:to-[#6b27be]'
    },
    red: {
      primary: 'bg-red-600 hover:bg-red-700',
      primaryText: 'text-red-600',
      primaryBg: 'bg-gradient-to-r from-red-600 to-red-700',
      focus: 'focus:border-red-500 focus:ring-red-500',
      accent: 'bg-gradient-to-r from-gray-50 to-gray-100',
      cryptoButton: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
    }
  };

  const currentTheme = themeColors[theme];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value as 'cod' | 'crypto' }));
  };

  const handleCryptoPayment = async () => {
    if (!formData.customerName || !formData.customerEmail) {
      toast.error('Please fill in your name and email to proceed with crypto payment');
      return;
    }

    setIsProcessingCrypto(true);

    try {
      // Create the order in our database first
      const orderData = await createOrderMutation.mutateAsync({
        package_name: packageData.name,
        package_category: packageData.category,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_whatsapp: formData.customerWhatsapp,
        amount: packageData.price,
        duration_months: packageData.duration,
        order_type: packageData.category.includes('panel') ? 'credits' : 'activation',
        status: 'pending',
        payment_status: 'pending',
      });

      // Create Cryptomus invoice through edge function
      const { data: invoiceData, error: invoiceError } = await supabase.functions.invoke(
        'create-cryptomus-invoice',
        {
          body: {
            packageData,
            customerInfo: formData,
            orderId: orderData.id
          }
        }
      );

      if (invoiceError) {
        throw invoiceError;
      }

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

        // Redirect to Cryptomus payment page
        window.location.href = invoiceData.result.url;
      } else {
        throw new Error('Failed to create payment invoice');
      }

    } catch (error) {
      console.error('Error creating crypto payment:', error);
      toast.error('Failed to create payment. Please try again.');
    } finally {
      setIsProcessingCrypto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.paymentMethod === 'crypto') {
      await handleCryptoPayment();
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        package_name: packageData.name,
        package_category: packageData.category,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_whatsapp: formData.customerWhatsapp,
        amount: packageData.price,
        duration_months: packageData.duration,
        order_type: packageData.category.includes('panel') ? 'credits' : 'activation',
        status: 'pending',
        payment_status: 'pending',
      });

      toast.success('Order submitted successfully! We will contact you shortly.');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to submit order. Please try again.');
    }
  };

  // Determine if this is a credit-based package
  const isCreditBased = packageData.category.includes('panel') || packageData.category === 'player-panel' || packageData.category === 'iptv-panel';
  const durationLabel = isCreditBased ? 'Credits' : 'Months';
  const durationDescription = isCreditBased 
    ? `${packageData.duration} credits for service management`
    : `${packageData.duration} month${packageData.duration > 1 ? 's' : ''} subscription`;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Quick Order</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Package Summary */}
          <div className={`${currentTheme.accent} rounded-lg p-4`}>
            <div className="flex items-start gap-3">
              <div className={`${currentTheme.primaryBg} rounded-lg p-2`}>
                <Package className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{packageData.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${currentTheme.primaryBg} text-white px-3 py-1 text-sm font-bold`}>
                    {packageData.duration} {durationLabel}
                  </Badge>
                  <span className="text-sm text-gray-600">{durationDescription}</span>
                </div>
                <div className="mt-2">
                  <span className={`text-2xl font-bold ${currentTheme.primaryText}`}>${packageData.price}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="customerName" className="flex items-center gap-2">
                <User className={`h-4 w-4 ${currentTheme.primaryText}`} />
                Full Name *
              </Label>
              <Input
                id="customerName"
                name="customerName"
                type="text"
                placeholder="Enter your full name"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className={`border-gray-300 ${currentTheme.focus}`}
              />
            </div>

            {/* Customer Email */}
            <div className="space-y-2">
              <Label htmlFor="customerEmail" className="flex items-center gap-2">
                <Mail className={`h-4 w-4 ${currentTheme.primaryText}`} />
                Email Address *
              </Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                placeholder="Enter your email address"
                value={formData.customerEmail}
                onChange={handleInputChange}
                required
                className={`border-gray-300 ${currentTheme.focus}`}
              />
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-2">
              <Label htmlFor="customerWhatsapp" className="flex items-center gap-2">
                <Phone className={`h-4 w-4 ${currentTheme.primaryText}`} />
                WhatsApp Number (Optional)
              </Label>
              <Input
                id="customerWhatsapp"
                name="customerWhatsapp"
                type="tel"
                placeholder="Enter your WhatsApp number"
                value={formData.customerWhatsapp}
                onChange={handleInputChange}
                className={`border-gray-300 ${currentTheme.focus}`}
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Payment Method</Label>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={handlePaymentMethodChange}
                className="space-y-2"
              >
                <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer font-medium">
                    Cash on Delivery
                  </Label>
                  <CreditCard className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <RadioGroupItem value="crypto" id="crypto" />
                  <Label htmlFor="crypto" className="flex-1 cursor-pointer font-medium">
                    Cryptocurrency Payment
                  </Label>
                  <Bitcoin className={`h-5 w-5 ${currentTheme.primaryText}`} />
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className={`w-full ${currentTheme.primary} text-white py-3 text-lg font-semibold`}
                disabled={createOrderMutation.isPending || isProcessingCrypto}
              >
                {formData.paymentMethod === 'crypto' ? (
                  <>
                    {isProcessingCrypto ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Payment...
                      </>
                    ) : (
                      <>
                        <Bitcoin className="mr-2 h-5 w-5" />
                        Pay with Crypto
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    {createOrderMutation.isPending ? 'Processing...' : 'Submit Order'}
                  </>
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 pt-2">
              {formData.paymentMethod === 'crypto' 
                ? 'Crypto payments are processed instantly through our secure API.'
                : 'We\'ll contact you within 24 hours to complete the payment and activation process.'
              }
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutForm;
