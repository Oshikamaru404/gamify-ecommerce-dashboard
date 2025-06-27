
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createCryptomusInvoice } from '@/services/cryptomusService';

interface CryptomusCheckoutProps {
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

const CryptomusCheckout: React.FC<CryptomusCheckoutProps> = ({ 
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
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCryptoPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // First, create the order in our database
      const { data: orderData, error: orderError } = await supabase
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
        ])
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

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
            // Store the Cryptomus UUID for tracking
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
      toast({
        title: 'Payment Error',
        description: 'Failed to create payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Crypto Payment</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
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
                <span className="text-green-700">€{packageData.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <form onSubmit={handleCryptoPayment} className="space-y-4">
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
                className="h-10"
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
                className="h-10"
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
                className="h-10"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Cryptocurrency Payment</h4>
              </div>
              <p className="text-sm text-blue-800">
                You will be redirected to a secure payment page where you can pay using various cryptocurrencies including Bitcoin, Ethereum, USDT, and more.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white h-10"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Payment...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay with Crypto
                </>
              )}
            </Button>
          </form>

          <div className="text-xs text-gray-500 text-center pt-2">
            By proceeding with payment, you agree to our terms of service. 
            Your payment will be processed securely through Cryptomus.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptomusCheckout;
