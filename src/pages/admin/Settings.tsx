
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
  Palette,
  Bot
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

const emailAutomationSchema = z.object({
  autoResponderEnabled: z.boolean().default(true),
  autoResponderSubject: z.string().min(1, 'Auto responder subject is required'),
  autoResponderMessage: z.string().min(1, 'Auto responder message is required'),
  orderStatusUpdatesEnabled: z.boolean().default(true),
  orderConfirmationTemplate: z.string().min(1, 'Order confirmation template is required'),
  orderProcessingTemplate: z.string().min(1, 'Order processing template is required'),
  orderShippedTemplate: z.string().min(1, 'Order shipped template is required'),
  orderDeliveredTemplate: z.string().min(1, 'Order delivered template is required'),
  orderCancelledTemplate: z.string().min(1, 'Order cancelled template is required'),
  emailHeader: z.string().min(1, 'Email header is required'),
  emailFooter: z.string().min(1, 'Email footer is required'),
});

const dashboardColorSchema = z.object({
  primaryColor: z.string().min(1, 'Primary color is required'),
  secondaryColor: z.string().min(1, 'Secondary color is required'),
  successColor: z.string().min(1, 'Success color is required'),
  warningColor: z.string().min(1, 'Warning color is required'),
  errorColor: z.string().min(1, 'Error color is required'),
  backgroundGradient: z.string().min(1, 'Background gradient is required'),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type PaymentSettingsValues = z.infer<typeof paymentSettingsSchema>;
type EmailAutomationValues = z.infer<typeof emailAutomationSchema>;
type DashboardColorValues = z.infer<typeof dashboardColorSchema>;

const Settings = () => {
  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      storeName: 'BWIVOX IPTV',
      storeEmail: 'contact@bwivox.com',
      storePhone: '+1 (555) 123-4567',
      storeAddress: '123 IPTV Street, Digital City, 12345',
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
  
  const emailAutomationForm = useForm<EmailAutomationValues>({
    resolver: zodResolver(emailAutomationSchema),
    defaultValues: {
      autoResponderEnabled: true,
      autoResponderSubject: 'Thank you for your IPTV subscription inquiry!',
      autoResponderMessage: 'Thank you for contacting BWIVOX IPTV. We have received your message and will respond within 24 hours.',
      orderStatusUpdatesEnabled: true,
      orderConfirmationTemplate: 'Your IPTV subscription order #{order_id} has been confirmed. Thank you for choosing BWIVOX!',
      orderProcessingTemplate: 'Your IPTV subscription order #{order_id} is being processed. We will notify you once it\'s ready.',
      orderShippedTemplate: 'Your IPTV subscription order #{order_id} has been activated and credentials have been sent to your email.',
      orderDeliveredTemplate: 'Your IPTV subscription order #{order_id} has been delivered successfully. Enjoy your premium streaming!',
      orderCancelledTemplate: 'Your IPTV subscription order #{order_id} has been cancelled. If you have any questions, please contact us.',
      emailHeader: 'BWIVOX IPTV - Premium Streaming Services',
      emailFooter: '© BWIVOX IPTV. All rights reserved.',
    },
  });
  
  const dashboardColorForm = useForm<DashboardColorValues>({
    resolver: zodResolver(dashboardColorSchema),
    defaultValues: {
      primaryColor: '#ef4444',
      secondaryColor: '#3b82f6',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
  
  const onEmailAutomationSubmit = (data: EmailAutomationValues) => {
    console.log('Email automation settings:', data);
    toast.success('Email automation settings saved successfully');
  };
  
  const onDashboardColorSubmit = (data: DashboardColorValues) => {
    console.log('Dashboard color settings:', data);
    toast.success('Dashboard color settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">BWIVOX IPTV Settings</h1>
        <p className="text-muted-foreground">
          Configure your IPTV business settings and preferences.
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
            <span>Email Automation</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex gap-2">
            <Palette size={16} />
            <span>Dashboard Colors</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your IPTV business basic information.
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
                        <FormLabel>Business Name</FormLabel>
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
                          <FormLabel>Business Email</FormLabel>
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
                          <FormLabel>Business Phone</FormLabel>
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
                        <FormLabel>Business Address</FormLabel>
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
                className="ml-auto bg-red-600 hover:bg-red-700"
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
              <CardTitle>Email Automation Settings</CardTitle>
              <CardDescription>
                Configure automatic email responses and order status updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailAutomationForm}>
                <form id="email-automation-form" onSubmit={emailAutomationForm.handleSubmit(onEmailAutomationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Auto Responder</h3>
                    </div>
                    
                    <FormField
                      control={emailAutomationForm.control}
                      name="autoResponderEnabled"
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
                            <FormLabel className="text-base">Enable Auto Responder</FormLabel>
                            <FormDescription>
                              Automatically respond to customer inquiries
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {emailAutomationForm.watch('autoResponderEnabled') && (
                      <div className="space-y-4 rounded-md border p-4">
                        <FormField
                          control={emailAutomationForm.control}
                          name="autoResponderSubject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Auto Responder Subject</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={emailAutomationForm.control}
                          name="autoResponderMessage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Auto Responder Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  className="h-24" 
                                  placeholder="Message sent automatically to customers"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold">Order Status Updates</h3>
                    </div>
                    
                    <FormField
                      control={emailAutomationForm.control}
                      name="orderStatusUpdatesEnabled"
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
                            <FormLabel className="text-base">Enable Order Status Updates</FormLabel>
                            <FormDescription>
                              Automatically notify customers when order status changes
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {emailAutomationForm.watch('orderStatusUpdatesEnabled') && (
                      <div className="space-y-4 rounded-md border p-4">
                        <FormField
                          control={emailAutomationForm.control}
                          name="orderConfirmationTemplate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Order Confirmation Template</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  className="h-20" 
                                  placeholder="Template for order confirmation emails"
                                />
                              </FormControl>
                              <FormDescription>
                                Use {'{order_id}'}, {'{customer_name}'} for dynamic content
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={emailAutomationForm.control}
                          name="orderProcessingTemplate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Order Processing Template</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  className="h-20" 
                                  placeholder="Template for order processing emails"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={emailAutomationForm.control}
                          name="orderShippedTemplate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Order Shipped Template</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  className="h-20" 
                                  placeholder="Template for order shipped emails"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={emailAutomationForm.control}
                          name="orderDeliveredTemplate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Order Delivered Template</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  className="h-20" 
                                  placeholder="Template for order delivered emails"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={emailAutomationForm.control}
                          name="orderCancelledTemplate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Order Cancelled Template</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  className="h-20" 
                                  placeholder="Template for order cancelled emails"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Email Header & Footer</h3>
                    
                    <FormField
                      control={emailAutomationForm.control}
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
                      control={emailAutomationForm.control}
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
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button 
                type="submit"
                form="email-automation-form"
                className="ml-auto"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Color Settings</CardTitle>
              <CardDescription>
                Customize the colors used in your dashboard metrics and charts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...dashboardColorForm}>
                <form id="dashboard-color-form" onSubmit={dashboardColorForm.handleSubmit(onDashboardColorSubmit)} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={dashboardColorForm.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Input 
                                {...field} 
                                type="color" 
                                className="w-20 h-10 p-1 border-2"
                              />
                              <Input 
                                {...field} 
                                placeholder="#ef4444"
                                className="flex-1"
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Main color for important metrics
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={dashboardColorForm.control}
                      name="secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Input 
                                {...field} 
                                type="color" 
                                className="w-20 h-10 p-1 border-2"
                              />
                              <Input 
                                {...field} 
                                placeholder="#3b82f6"
                                className="flex-1"
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Secondary color for charts and graphs
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={dashboardColorForm.control}
                      name="successColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Success Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Input 
                                {...field} 
                                type="color" 
                                className="w-20 h-10 p-1 border-2"
                              />
                              <Input 
                                {...field} 
                                placeholder="#10b981"
                                className="flex-1"
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Color for positive metrics and success indicators
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={dashboardColorForm.control}
                      name="warningColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warning Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Input 
                                {...field} 
                                type="color" 
                                className="w-20 h-10 p-1 border-2"
                              />
                              <Input 
                                {...field} 
                                placeholder="#f59e0b"
                                className="flex-1"
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Color for warning indicators
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={dashboardColorForm.control}
                      name="errorColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Error Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Input 
                                {...field} 
                                type="color" 
                                className="w-20 h-10 p-1 border-2"
                              />
                              <Input 
                                {...field} 
                                placeholder="#ef4444"
                                className="flex-1"
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Color for error indicators and negative metrics
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={dashboardColorForm.control}
                    name="backgroundGradient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Gradient</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          />
                        </FormControl>
                        <FormDescription>
                          CSS gradient for dashboard metric cards background
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
                form="dashboard-color-form"
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
