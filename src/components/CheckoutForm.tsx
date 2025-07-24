
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X, Package, CreditCard, User, Mail, Phone, Bitcoin } from 'lucide-react';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { toast } from 'sonner';
import CryptomusCheckout from '@/components/CryptomusCheckout';

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
  const [showCryptoCheckout, setShowCryptoCheckout] = useState(false);

  const createOrderMutation = useCreateOrder();

  // Theme detection based on package category
  const theme = packageData.category.includes('panel') || 
                packageData.category.includes('iptv') || 
                packageData.category.includes('player') ||
                packageData.name.toLowerCase().includes('panel') ||
                packageData.name.toLowerCase().includes('iptv') ||
                packageData.name.toLowerCase().includes('player')
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

  const handleCryptoPayment = () => {
    if (!formData.customerName || !formData.customerEmail) {
      toast.error('Please fill in your name and email to proceed with crypto payment');
      return;
    }
    setShowCryptoCheckout(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.paymentMethod === 'crypto') {
      setShowCryptoCheckout(true);
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

  const handleCryptoSuccess = () => {
    setShowCryptoCheckout(false);
    onSuccess();
    onClose();
  };

  // Determine if this is a credit-based package
  const isCreditBased = packageData.category.includes('panel') || packageData.category === 'player-panel' || packageData.category === 'iptv-panel';
  const durationLabel = isCreditBased ? 'Credits' : 'Months';
  const durationDescription = isCreditBased 
    ? `${packageData.duration} credits for service management`
    : `${packageData.duration} month${packageData.duration > 1 ? 's' : ''} subscription`;

  return (
    <>
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
                    {/* Prominent Duration Badge */}
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

            {/* Prominent Crypto Payment Button */}
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">Quick & Secure Crypto Payment</p>
                <Button
                  type="button"
                  onClick={handleCryptoPayment}
                  className={`w-full ${currentTheme.cryptoButton} text-white py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
                  size="lg"
                >
                  <Bitcoin className="mr-3 h-6 w-6" />
                  Pay with Cryptomus
                  <span className="ml-2 text-sm opacity-90">Direct API</span>
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Instant payment with Bitcoin, Ethereum, USDT & more
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">or</span>
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

              {/* Alternative Payment Method */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Alternative Payment Method</Label>
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
                </RadioGroup>
              </div>

              {/* Submit Button for COD */}
              {formData.paymentMethod === 'cod' && (
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className={`w-full ${currentTheme.primary} text-white py-3 text-lg font-semibold`}
                    disabled={createOrderMutation.isPending}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    {createOrderMutation.isPending ? 'Processing...' : 'Submit Order'}
                  </Button>
                </div>
              )}

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

      {/* Crypto Checkout Modal */}
      {showCryptoCheckout && (
        <CryptomusCheckout
          packageData={packageData}
          onClose={() => setShowCryptoCheckout(false)}
          onSuccess={handleCryptoSuccess}
        />
      )}
    </>
  );
};

export default CheckoutForm;
