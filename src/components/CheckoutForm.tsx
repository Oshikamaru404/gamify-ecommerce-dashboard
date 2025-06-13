
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, MessageCircle, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    customerWhatsapp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: formData.customerName,
            customer_email: formData.customerEmail,
            customer_whatsapp: formData.customerWhatsapp || null,
            package_id: packageData.id,
            package_name: packageData.name,
            package_category: packageData.category,
            duration_months: packageData.duration,
            amount: packageData.price,
            order_type: 'activation',
            status: 'pending',
            payment_status: 'pending'
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: 'Order Submitted Successfully!',
        description: 'Your order has been submitted and is being processed. We will contact you soon.',
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppFallback = () => {
    const message = `Hello, I'm interested in ${packageData.name} - ${packageData.duration} Month(s) - $${packageData.price.toFixed(2)}`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Complete Your Order</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Package:</span>
                <span className="font-medium">{packageData.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium">{packageData.duration} Months</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                <span>Total:</span>
                <span className="text-green-700">${packageData.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                name="customerName"
                type="text"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
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
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerWhatsapp">WhatsApp Number (Optional)</Label>
              <Input
                id="customerWhatsapp"
                name="customerWhatsapp"
                type="tel"
                value={formData.customerWhatsapp}
                onChange={handleInputChange}
                placeholder="Enter your WhatsApp number"
              />
            </div>

            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Submitting Order...' : 'Submit Order'}
              </Button>

              <div className="text-center text-sm text-gray-500">or</div>

              <Button
                type="button"
                variant="outline"
                onClick={handleWhatsAppFallback}
                className="w-full"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Continue with WhatsApp
              </Button>
            </div>
          </form>

          <div className="text-xs text-gray-500 text-center">
            By submitting this order, you agree to our terms of service. 
            We will contact you for payment and delivery details.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutForm;
