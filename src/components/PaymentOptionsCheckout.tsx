import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, MessageCircle, CreditCard, X, Loader2, Package, CheckCircle, Home, Bitcoin } from 'lucide-react';
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
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const { data: siteSettings } = useSiteSettings();
  const [imageError, setImageError] = useState(false);

  const displayName = useLocalizedText(packageData.name);
  const displayDescription = useLocalizedText(packageData.description);

  // Determine border color based on category (purple for panel, player, reseller)
  const getCategoryBorderStyle = () => {
    const category = packageData.category?.toLowerCase() || '';
    if (category.includes('panel') || category.includes('reseller') || category === 'player') {
      // Same purple as panel reseller buttons (#8f35e5)
      return { borderColor: '#8f35e5', boxShadow: '0 0 0 3px rgba(143, 53, 229, 0.2)' };
    }
    // Red for subscription, activation-player, and default
    return { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)' };
  };

  // Get fallback icon color based on category
  const getFallbackIconClass = () => {
    const category = packageData.category?.toLowerCase() || '';
    if (category.includes('panel') || category.includes('reseller') || category === 'player') {
      return 'text-[#8f35e5]';
    }
    return 'text-red-500';
  };

  const whatsappNumber = siteSettings?.find(s => s.setting_key === 'whatsapp_number')?.setting_value || '1234567890';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isCreditsPackage = () => {
    return packageData.category?.includes('panel') || packageData.category === 'player';
  };

  const getDisplayDuration = () => {
    if (isCreditsPackage()) {
      return `${packageData.duration} Credits`;
    }
    return `${packageData.duration} ${packageData.duration === 1 ? 'Month' : 'Months'}`;
  };

  const getDurationLabel = () => {
    return isCreditsPackage() ? 'Credit:' : 'Duration:';
  };

  const handleWhatsAppOrder = async () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerWhatsapp) {
      toast.error('Please fill in all required fields including WhatsApp number');
      return;
    }

    // Prevent duplicate submissions
    if (isSubmitting) {
      toast.error('Order is being processed, please wait...');
      return;
    }

    setIsSubmitting(true);
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

      // Store order ID for success screen
      setPlacedOrderId(orderData.id);

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

      // Store WhatsApp URL for auto-redirect
      const url = `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
      setWhatsappUrl(url);
      
      // Show success screen first (will auto-redirect via useEffect)
      setOrderPlaced(true);
      toast.success('Order placed successfully!');

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
      setIsSubmitting(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayGatePayment = async (paymentType: 'credit_card' | 'crypto') => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerWhatsapp) {
      toast.error('Please fill in all required fields including WhatsApp number');
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

      // Create PayGate payment via edge function
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        'paygate-create-payment',
        {
          body: {
            packageData: {
              ...packageData,
              name: displayName
            },
            customerInfo: formData,
            orderId: orderData.id,
            paymentType
          }
        }
      );

      if (paymentError) throw paymentError;

      if (paymentData?.checkoutUrl) {
        // Update order with payment tracking info
        // Order stays as 'pending' until PayGate callback confirms payment

        toast.success('Redirecting to payment...');
        setTimeout(() => {
          window.location.href = paymentData.checkoutUrl;
        }, 1000);
      } else {
        throw new Error('Failed to create payment link');
      }

    } catch (error) {
      console.error(`Error creating ${paymentType} payment:`, error);
      toast.error('Failed to create payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle going back to store
  const handleBackToStore = () => {
    onSuccess();
    onClose();
  };

  // Auto-redirect countdown when order is placed
  useEffect(() => {
    if (orderPlaced && whatsappUrl && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (orderPlaced && whatsappUrl && countdown === 0) {
      window.open(whatsappUrl, '_blank');
    }
  }, [orderPlaced, whatsappUrl, countdown]);

  // Success Screen - Compact version
  if (orderPlaced) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-sm animate-in zoom-in-95 duration-200">
          <CardContent className="pt-6 pb-5 px-5 text-center space-y-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-green-700">Order Confirmed!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Order #{placedOrderId?.slice(0, 8)}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{displayName}</span>
                <span className="font-bold">${packageData.price}</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                📱 Redirecting to WhatsApp in <span className="font-bold">{countdown}s</span>
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <Button 
                variant="outline"
                size="sm"
                onClick={handleBackToStore}
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-1" />
                Store
              </Button>
              <Button 
                size="sm"
                onClick={() => whatsappUrl && window.open(whatsappUrl, '_blank')}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Complete Your Order</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
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
                <div 
                  className="rounded-lg bg-white flex items-center justify-center flex-shrink-0"
                  style={{ border: '5px solid', ...getCategoryBorderStyle() }}
                >
                  {packageData.icon_url && !imageError ? (
                    <img 
                      src={packageData.icon_url} 
                      alt={displayName}
                      className="w-12 h-12 object-contain"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <Package className={`w-10 h-10 ${getFallbackIconClass()}`} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{displayName}</h3>
                  {displayDescription && (
                    <p className="text-sm text-muted-foreground">{displayDescription}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">{getDurationLabel()}</span>
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
              <Label htmlFor="customerWhatsapp">WhatsApp Number *</Label>
              <Input
                id="customerWhatsapp"
                name="customerWhatsapp"
                value={formData.customerWhatsapp}
                onChange={handleInputChange}
                placeholder="+1234567890"
                required
              />
              <p className="text-xs text-muted-foreground">
                Required for order updates and support
              </p>
            </div>
          </div>

          {/* Payment Options - Tabs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Choose Payment Method</h3>
            
            <Tabs defaultValue="whatsapp" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="whatsapp" className="flex items-center gap-1 text-xs sm:text-sm">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                  <span className="sm:hidden">WhatsApp</span>
                </TabsTrigger>
                <TabsTrigger value="credit_card" className="flex items-center gap-1 text-xs sm:text-sm">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">Credit Card</span>
                  <span className="sm:hidden">Card</span>
                </TabsTrigger>
                <TabsTrigger value="crypto" className="flex items-center gap-1 text-xs sm:text-sm">
                  <Bitcoin className="h-4 w-4" />
                  <span className="hidden sm:inline">Crypto</span>
                  <span className="sm:hidden">Crypto</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="whatsapp" className="mt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">Order via WhatsApp</h4>
                        <p className="text-sm text-green-700">
                          Complete your order through our WhatsApp support. Our team will guide you through the payment process.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleWhatsAppOrder}
                      disabled={isProcessing}
                      className="w-full h-12 bg-green-600 hover:bg-green-700"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <MessageCircle className="h-5 w-5 mr-2" />
                      )}
                      Continue to WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="credit_card" className="mt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Pay with Credit Card</h4>
                        <p className="text-sm text-blue-700">
                          Pay securely with Visa, Mastercard, Apple Pay, Google Pay, or bank transfer. You'll be redirected to a secure payment page.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePayGatePayment('credit_card')}
                      disabled={isProcessing}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <CreditCard className="h-5 w-5 mr-2" />
                      )}
                      Pay with Credit Card
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="crypto" className="mt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <Bitcoin className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-orange-900 mb-1">Pay with Cryptocurrency</h4>
                        <p className="text-sm text-orange-700">
                          Pay with Bitcoin, USDT, ETH, Solana, and 50+ other cryptocurrencies. Instant & anonymous.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePayGatePayment('crypto')}
                      disabled={isProcessing}
                      className="w-full h-12 bg-orange-600 hover:bg-orange-700"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <Bitcoin className="h-5 w-5 mr-2" />
                      )}
                      Pay with Crypto
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
