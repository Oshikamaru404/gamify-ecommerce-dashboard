
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon, 
  CreditCard, 
  Save, 
  Mail, 
  Truck
} from 'lucide-react';

const generalSettingsSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  storeEmail: z.string().email('Invalid email address'),
  storePhone: z.string().min(1, 'Phone number is required'),
  storeAddress: z.string().min(1, 'Address is required'),
  currency: z.string().min(1, 'Currency is required'),
});

const paymentSettingsSchema = z.object({
  codEnabled: z.boolean().default(true),
  bankTransferEnabled: z.boolean().default(false),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
  paymentInstructions: z.string().optional(),
});

const emailSettingsSchema = z.object({
  emailHeader: z.string().min(1, 'Email header is required'),
  emailFooter: z.string().min(1, 'Email footer is required'),
  orderConfirmationTemplate: z.string().min(1, 'Order confirmation template is required'),
});

const shippingSettingsSchema = z.object({
  freeShippingMinimum: z.coerce.number().min(0, 'Minimum value must be a positive number'),
  shippingFee: z.coerce.number().min(0, 'Shipping fee must be a positive number'),
  shippingNotes: z.string().optional(),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type PaymentSettingsValues = z.infer<typeof paymentSettingsSchema>;
type EmailSettingsValues = z.infer<typeof emailSettingsSchema>;
type ShippingSettingsValues = z.infer<typeof shippingSettingsSchema>;

const Settings = () => {
  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      storeName: 'GamsGo',
      storeEmail: 'contact@gamsgo.com',
      storePhone: '+1 (555) 123-4567',
      storeAddress: '123 Game Street, Digital City, 12345',
      currency: 'USD',
    },
  });
  
  const paymentForm = useForm<PaymentSettingsValues>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      codEnabled: true,
      bankTransferEnabled: false,
      bankAccountName: '',
      bankAccountNumber: '',
      bankName: '',
      paymentInstructions: '',
    },
  });
  
  const emailForm = useForm<EmailSettingsValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      emailHeader: 'GamsGo - Your Digital Game Store',
      emailFooter: '© GamsGo. All rights reserved.',
      orderConfirmationTemplate: 'Thank you for your order! Your order #{order_id} has been received and is being processed.',
    },
  });
  
  const shippingForm = useForm<ShippingSettingsValues>({
    resolver: zodResolver(shippingSettingsSchema),
    defaultValues: {
      freeShippingMinimum: 100,
      shippingFee: 4.99,
      shippingNotes: 'Digital products are delivered instantly via email.',
    },
  });
  
  const onGeneralSubmit = (data: GeneralSettingsValues) => {
    console.log('General settings:', data);
    toast.success('General settings saved successfully');
  };
  
  const onPaymentSubmit = (data: PaymentSettingsValues) => {
    console.log('Payment settings:', data);
    toast.success('Payment settings saved successfully');
  };
  
  const onEmailSubmit = (data: EmailSettingsValues) => {
    console.log('Email settings:', data);
    toast.success('Email settings saved successfully');
  };
  
  const onShippingSubmit = (data: ShippingSettingsValues) => {
    console.log('Shipping settings:', data);
    toast.success('Shipping settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your store settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general" className="flex gap-2">
            <SettingsIcon size={16} />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex gap-2">
            <CreditCard size={16} />
            <span>Payment</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex gap-2">
            <Mail size={16} />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex gap-2">
            <Truck size={16} />
            <span>Shipping</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your store's basic information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form id="general-form" onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                  <FormField
                    control={generalForm.control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={generalForm.control}
                      name="storeEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="storePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={generalForm.control}
                    name="storeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The currency used for pricing (e.g., USD, EUR, GBP)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button 
                type="submit"
                form="general-form"
                className="ml-auto"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure your store's payment methods.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...paymentForm}>
                <form id="payment-form" onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                  <FormField
                    control={paymentForm.control}
                    name="codEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <div className="pt-0.5">
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </div>
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-base">Cash on Delivery</FormLabel>
                          <FormDescription>
                            Allow customers to pay when they receive their order
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={paymentForm.control}
                    name="bankTransferEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <div className="pt-0.5">
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </div>
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-base">Bank Transfer</FormLabel>
                          <FormDescription>
                            Allow customers to pay via bank transfer
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {paymentForm.watch('bankTransferEnabled') && (
                    <div className="space-y-4 rounded-md border p-4">
                      <FormField
                        control={paymentForm.control}
                        name="bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={paymentForm.control}
                          name="bankAccountName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={paymentForm.control}
                          name="bankAccountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={paymentForm.control}
                        name="paymentInstructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Instructions</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                className="h-24" 
                                placeholder="Instructions for customers making bank transfers"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button 
                type="submit"
                form="payment-form"
                className="ml-auto"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure your store's email templates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form id="email-form" onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                  <FormField
                    control={emailForm.control}
                    name="emailHeader"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Header</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Displayed at the top of all emails
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={emailForm.control}
                    name="emailFooter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Footer</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Displayed at the bottom of all emails
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={emailForm.control}
                    name="orderConfirmationTemplate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Confirmation Template</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="h-32" 
                            placeholder="Enter the template for order confirmation emails"
                          />
                        </FormControl>
                        <FormDescription>
                          Use placeholders like {'{order_id}'}, {'{customer_name}'} for dynamic content
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button 
                type="submit"
                form="email-form"
                className="ml-auto"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
              <CardDescription>
                Configure your store's shipping options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...shippingForm}>
                <form id="shipping-form" onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={shippingForm.control}
                      name="freeShippingMinimum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Free Shipping Minimum</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                              <Input 
                                {...field} 
                                className="pl-7" 
                                type="number" 
                                step="0.01" 
                                min="0" 
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Minimum order value for free shipping (0 for always free)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={shippingForm.control}
                      name="shippingFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Fee</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                              <Input 
                                {...field} 
                                className="pl-7" 
                                type="number" 
                                step="0.01" 
                                min="0"
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Standard shipping fee when free shipping doesn't apply
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={shippingForm.control}
                    name="shippingNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="h-32" 
                            placeholder="Enter additional shipping information"
                          />
                        </FormControl>
                        <FormDescription>
                          Additional shipping information displayed during checkout
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button 
                type="submit"
                form="shipping-form"
                className="ml-auto"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
