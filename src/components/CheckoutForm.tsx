
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Package, CreditCard, User, Mail, Phone } from 'lucide-react';
import { useCreateOrder } from '@/hooks/useRecentOrders';
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
  });

  const createOrderMutation = useCreateOrder();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerEmail) {
      toast.error('Please fill in all required fields');
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
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-[#8f35e5] rounded-lg p-2">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{packageData.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  {/* Prominent Duration Badge */}
                  <Badge className="bg-gradient-to-r from-[#8f35e5] to-[#7c2fd4] text-white px-3 py-1 text-sm font-bold">
                    {packageData.duration} {durationLabel}
                  </Badge>
                  <span className="text-sm text-gray-600">{durationDescription}</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-[#8f35e5]">${packageData.price}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="customerName" className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#8f35e5]" />
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
                className="border-gray-300 focus:border-[#8f35e5] focus:ring-[#8f35e5]"
              />
            </div>

            {/* Customer Email */}
            <div className="space-y-2">
              <Label htmlFor="customerEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#8f35e5]" />
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
                className="border-gray-300 focus:border-[#8f35e5] focus:ring-[#8f35e5]"
              />
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-2">
              <Label htmlFor="customerWhatsapp" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#8f35e5]" />
                WhatsApp Number (Optional)
              </Label>
              <Input
                id="customerWhatsapp"
                name="customerWhatsapp"
                type="tel"
                placeholder="Enter your WhatsApp number"
                value={formData.customerWhatsapp}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-[#8f35e5] focus:ring-[#8f35e5]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#8f35e5] to-[#7c2fd4] hover:from-[#7c2fd4] hover:to-[#6b27be] text-white py-3 text-lg font-semibold"
                disabled={createOrderMutation.isPending}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {createOrderMutation.isPending ? 'Processing...' : 'Submit Order'}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 pt-2">
              We'll contact you within 24 hours to complete the payment and activation process.
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutForm;
