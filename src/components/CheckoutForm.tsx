
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const checkoutFormSchema = z.object({
  customerName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  customerEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  customerWhatsapp: z.string().optional(),
})

interface CheckoutFormProps {
  packageData: any;
  onClose: () => void;
  onSuccess: () => void;
}

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>

const CheckoutForm: React.FC<CheckoutFormProps> = ({ packageData, onClose, onSuccess }) => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerWhatsapp: "",
    },
  })

  const getPackageDisplayName = (pkg: any) => {
    if (typeof pkg.name === 'string') {
      try {
        const parsed = JSON.parse(pkg.name);
        return parsed[language] || parsed.en || pkg.name;
      } catch {
        return pkg.name;
      }
    }
    return pkg.name || 'Unknown Package';
  };

  const getDisplayDuration = () => {
    if (packageData.duration) {
      // For credit-based packages (player/iptv panels)
      if (packageData.category?.includes('panel')) {
        return `${packageData.duration} Credits`;
      }
      // For subscription packages with months
      return `${packageData.duration} ${packageData.duration === 1 ? 'Month' : 'Months'}`;
    }
    return 'Package';
  };

  const isSubscriptionPackage = packageData.category === 'subscription';
  const isPanelPackage = packageData.category?.includes('panel');

  async function onSubmit(data: CheckoutFormValues) {
    setIsSubmitting(true);
    // Here, you would typically send the form data to your backend
    // along with the selected package information.
    // For this example, we'll just simulate a successful submission.
    
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    toast.success("Order placed successfully!");
    onSuccess();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
          <p className="text-gray-600">Fill in your details to complete the purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {packageData?.icon_url && (
                    <img 
                      src={packageData.icon_url} 
                      alt={getPackageDisplayName(packageData)}
                      className="w-10 h-10 object-contain flex-shrink-0" 
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">
                      {getPackageDisplayName(packageData)}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {getDisplayDuration()}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <span className="font-medium">{getPackageDisplayName(packageData)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {isPanelPackage ? 'Credits:' : 'Duration:'}
                    </span>
                    <span className="font-medium">
                      {getDisplayDuration()}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>${packageData?.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        type="text"
                        {...register("customerName")}
                        className="mt-1"
                        placeholder="Enter your full name"
                      />
                      {errors.customerName && (
                        <p className="text-sm text-red-600 mt-1">{errors.customerName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Email Address *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        {...register("customerEmail")}
                        className="mt-1"
                        placeholder="Enter your email"
                      />
                      {errors.customerEmail && (
                        <p className="text-sm text-red-600 mt-1">{errors.customerEmail.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customerWhatsapp">WhatsApp Number (Optional)</Label>
                    <Input
                      id="customerWhatsapp"
                      type="tel"
                      {...register("customerWhatsapp")}
                      className="mt-1"
                      placeholder="Enter your WhatsApp number (e.g., +1234567890)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      We'll send order updates via WhatsApp if provided
                    </p>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onClose}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Complete Order'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
