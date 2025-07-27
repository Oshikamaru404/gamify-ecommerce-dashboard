
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, User, Mail, Phone, Bitcoin, Loader2 } from 'lucide-react';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CheckoutFormProps {
  packageData: {
    id: string;
    name: string;
    category?: string;
    price: number;
    duration: number;
    icon_url?: string;
    icon?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ packageData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerWhatsapp: '',
  });
  const [isProcessingCrypto, setIsProcessingCrypto] = useState(false);

  // Determine theme based on package category
  const category = packageData.category || '';
  const isPanelCategory = category === 'panel-iptv' || category === 'panel-player';
  
  // IPTV Panel packages get purple theme, everything else gets red theme
  const themeColors = isPanelCategory ? {
    primary: 'bg-purple-600 hover:bg-purple-700',
    primaryText: 'text-purple-600',
    primaryBg: 'bg-gradient-to-r from-purple-600 to-purple-700',
    focus: 'focus:border-purple-500 focus:ring-purple-500',
    accent: 'bg-gradient-to-r from-gray-50 to-gray-100',
    cryptoButton: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
  } : {
    primary: 'bg-red-600 hover:bg-red-700',
    primaryText: 'text-red-600',
    primaryBg: 'bg-gradient-to-r from-red-600 to-red-700',
    focus: 'focus:border-red-500 focus:ring-red-500',
    accent: 'bg-gradient-to-r from-gray-50 to-gray-100',
    cryptoButton: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCryptoPayment = async () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerWhatsapp) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessingCrypto(true);

    try {
      // Create the order in our database first
      const orderData = await createOrderMutation.mutateAsync({
        package_name: packageData.name,
        package_category: packageData.category || '',
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_whatsapp: formData.customerWhatsapp,
        amount: packageData.price,
        duration_months: packageData.duration,
        order_type: (packageData.category || '').includes('panel') ? 'credits' : 'activation',
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
            customer_whatsapp: `${formData.customerWhatsapp}|cryptomus:${invoiceData.result.uuid}`
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
    await handleCryptoPayment();
  };

  const createOrderMutation = useCreateOrder();

  // Determine if this is a credit-based package (IPTV Panel packages)
  const isCreditBased = category === 'panel-iptv' || category === 'panel-player';
  const durationLabel = isCreditBased ? 'Credits' : 'Months';
  const durationDescription = isCreditBased 
    ? `${packageData.duration} credits for service management`
    : `${packageData.duration} months subscription`;

  console.log('CheckoutForm - Package data received:', packageData);
  console.log('CheckoutForm - Icon URL:', packageData.icon_url);
  console.log('CheckoutForm - Category:', category);
  console.log('CheckoutForm - Is Panel Category (purple theme):', isPanelCategory);
  console.log('CheckoutForm - Is Credit Based:', isCreditBased);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Crypto Payment</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Package Summary with Smaller Logo */}
          <div className={`${themeColors.accent} rounded-lg p-6`}>
            <div className="flex items-start gap-4">
              <div className={`${themeColors.primaryBg} rounded-lg p-2`}>
                {packageData.icon_url ? (
                  <img 
                    src={packageData.icon_url} 
                    alt={packageData.name}
                    className="h-12 w-12 rounded-lg object-cover border-2 shadow-lg"
                    style={{ borderColor: isPanelCategory ? '#8b5cf6' : '#dc2626' }}
                    onError={(e) => {
                      console.error('Failed to load package image:', packageData.icon_url);
                      e.currentTarget.style.display = 'none';
                      const fallbackContainer = e.currentTarget.parentElement?.nextElementSibling as HTMLElement;
                      if (fallbackContainer) fallbackContainer.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="h-12 w-12 flex items-center justify-center text-white text-2xl rounded-lg"
                  style={{ display: packageData.icon_url ? 'none' : 'flex' }}
                >
                  {packageData.icon || '📺'}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{packageData.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${themeColors.primaryBg} text-white px-3 py-1 text-sm font-bold`}>
                    {packageData.duration} {durationLabel} {isCreditBased ? '' : 'Subscription'}
                  </Badge>
                </div>
                <div className="mt-3">
                  <span className={`text-2xl font-bold ${themeColors.primaryText}`}>${packageData.price}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="customerName" className="flex items-center gap-2">
                <User className={`h-4 w-4 ${themeColors.primaryText}`} />
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
                className={`border-gray-300 ${themeColors.focus}`}
              />
            </div>

            {/* Customer Email */}
            <div className="space-y-2">
              <Label htmlFor="customerEmail" className="flex items-center gap-2">
                <Mail className={`h-4 w-4 ${themeColors.primaryText}`} />
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
                className={`border-gray-300 ${themeColors.focus}`}
              />
            </div>

            {/* WhatsApp Number - Now Required */}
            <div className="space-y-2">
              <Label htmlFor="customerWhatsapp" className="flex items-center gap-2">
                <Phone className={`h-4 w-4 ${themeColors.primaryText}`} />
                WhatsApp Number *
              </Label>
              <Input
                id="customerWhatsapp"
                name="customerWhatsapp"
                type="tel"
                placeholder="Enter your WhatsApp number"
                value={formData.customerWhatsapp}
                onChange={handleInputChange}
                required
                className={`border-gray-300 ${themeColors.focus}`}
              />
            </div>

            {/* Crypto Payment Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className={`w-full ${themeColors.cryptoButton} text-white py-4 text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105`}
                disabled={isProcessingCrypto}
              >
                {isProcessingCrypto ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Creating Payment...
                  </>
                ) : (
                  <>
                    <Bitcoin className="mr-2 h-6 w-6" />
                    Pay with Cryptocurrency
                  </>
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 pt-2">
              Crypto payments are processed instantly through our secure API. You'll be redirected to complete your payment.
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutForm;
