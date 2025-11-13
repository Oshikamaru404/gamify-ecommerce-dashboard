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
  Bot,
  Key,
  Shield,
  Eye,
  EyeOff,
  MessageCircle,
  Phone,
  Languages
} from 'lucide-react';
import { useSiteSettings, useUpdateSiteSetting } from '@/hooks/useSiteSettings';
import WhatsAppTemplateEditor from '@/components/admin/WhatsAppTemplateEditor';
import TranslationEditor from '@/components/admin/TranslationEditor';
import HomepageCMSEditor from '@/components/admin/HomepageCMSEditor';
import TwoFactorSetup from '@/components/admin/TwoFactorSetup';

const generalSettingsSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  storeEmail: z.string().email('Invalid email address'),
  storePhone: z.string().min(1, 'Phone number is required'),
  storeAddress: z.string().min(1, 'Address is required'),
  currency: z.string().min(1, 'Currency is required'),
});

const contactSettingsSchema = z.object({
  whatsappNumber: z.string().min(1, 'WhatsApp number is required'),
  telegramUsername: z.string().min(1, 'Telegram username is required'),
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

const apiKeysSchema = z.object({
  cryptomusMerchantId: z.string().min(1, 'Cryptomus Merchant ID is required'),
  cryptomusApiKey: z.string().min(1, 'Cryptomus API Key is required'),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type ContactSettingsValues = z.infer<typeof contactSettingsSchema>;
type PaymentSettingsValues = z.infer<typeof paymentSettingsSchema>;
type EmailAutomationValues = z.infer<typeof emailAutomationSchema>;
type DashboardColorValues = z.infer<typeof dashboardColorSchema>;
type ApiKeysValues = z.infer<typeof apiKeysSchema>;

const Settings = () => {
  const [showCryptomusApiKey, setShowCryptomusApiKey] = React.useState(false);
  const { data: siteSettings, isLoading: settingsLoading } = useSiteSettings();
  const updateSiteSetting = useUpdateSiteSetting();

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

  const contactForm = useForm<ContactSettingsValues>({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: {
      whatsappNumber: '',
      telegramUsername: '',
    },
  });

  // Update contact form when site settings load
  React.useEffect(() => {
    if (siteSettings && !settingsLoading) {
      console.log('Updating contact form with site settings:', siteSettings);
      const whatsappSetting = siteSettings.find(s => s.setting_key === 'whatsapp_number');
      const telegramSetting = siteSettings.find(s => s.setting_key === 'telegram_username');
      
      contactForm.setValue('whatsappNumber', whatsappSetting?.setting_value || '');
      contactForm.setValue('telegramUsername', telegramSetting?.setting_value || '');
    }
  }, [siteSettings, settingsLoading, contactForm]);

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
  
  const apiKeysForm = useForm<ApiKeysValues>({
    resolver: zodResolver(apiKeysSchema),
    defaultValues: {
      cryptomusMerchantId: '',
      cryptomusApiKey: '',
    },
  });
  
  const onGeneralSubmit = (data: GeneralSettingsValues) => {
    console.log('General settings:', data);
    toast.success('General settings saved successfully');
  };

  const onContactSubmit = async (data: ContactSettingsValues) => {
    console.log('Contact form submitted with data:', data);
    
    try {
      // Validate data before sending
      if (!data.whatsappNumber || !data.telegramUsername) {
        toast.error('Both WhatsApp number and Telegram username are required');
        return;
      }

      // Update WhatsApp number
      console.log('Updating WhatsApp number:', data.whatsappNumber);
      await updateSiteSetting.mutateAsync({ 
        key: 'whatsapp_number', 
        value: data.whatsappNumber.toString() 
      });

      // Update Telegram username
      console.log('Updating Telegram username:', data.telegramUsername);
      await updateSiteSetting.mutateAsync({ 
        key: 'telegram_username', 
        value: data.telegramUsername.toString() 
      });

      toast.success('Contact settings saved successfully');
    } catch (error) {
      console.error('Error saving contact settings:', error);
      toast.error('Failed to save contact settings');
    }
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
  
  const onApiKeysSubmit = (data: ApiKeysValues) => {
    console.log('API Keys settings:', data);
    // Here you would typically save to Supabase secrets
    toast.success('API Keys saved successfully');
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
          <TabsTrigger value="contact" className="flex gap-2">
            <MessageCircle size={16} />
            <span>Contact</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp-templates" className="flex gap-2">
            <MessageCircle size={16} />
            <span>WhatsApp Templates</span>
          </TabsTrigger>
          <TabsTrigger value="translations" className="flex gap-2">
            <Languages size={16} />
            <span>Translations</span>
          </TabsTrigger>
          <TabsTrigger value="homepage-cms" className="flex gap-2">
            <Palette size={16} />
            <span>Homepage CMS</span>
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
          <TabsTrigger value="api-keys" className="flex gap-2">
            <Key size={16} />
            <span>API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex gap-2">
            <Shield size={16} />
            <span>Security</span>
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

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Settings</CardTitle>
              <CardDescription>
                Configure your WhatsApp and Telegram contact information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...contactForm}>
                <form id="contact-form" onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-6">
                  <FormField
                    control={contactForm.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone size={16} className="text-green-600" />
                          WhatsApp Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="1234567890" 
                            type="text"
                            onChange={(e) => {
                              console.log('WhatsApp number input changed:', e.target.value);
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the WhatsApp number without the '+' symbol (e.g., 1234567890)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={contactForm.control}
                    name="telegramUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MessageCircle size={16} className="text-blue-600" />
                          Telegram Username
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="bwivoxiptv" 
                            type="text"
                            onChange={(e) => {
                              console.log('Telegram username input changed:', e.target.value);
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the Telegram username without the '@' symbol (e.g., bwivoxiptv)
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
                form="contact-form"
                className="ml-auto bg-green-600 hover:bg-green-700"
                disabled={updateSiteSetting.isPending}
              >
                <Save size={16} className="mr-2" />
                {updateSiteSetting.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp-templates">
          <WhatsAppTemplateEditor />
        </TabsContent>

        <TabsContent value="translations">
          <TranslationEditor />
        </TabsContent>

        <TabsContent value="homepage-cms">
          <HomepageCMSEditor />
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
        
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>API Keys Management</CardTitle>
              <CardDescription>
                Manage your external service API keys and credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...apiKeysForm}>
                <form id="api-keys-form" onSubmit={apiKeysForm.handleSubmit(onApiKeysSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Cryptomus Payment Gateway</h3>
                    </div>
                    
                    <div className="rounded-md border p-4 bg-blue-50">
                      <p className="text-sm text-blue-700 mb-4">
                        Configure your Cryptomus credentials to enable cryptocurrency payments. You can find these in your Cryptomus dashboard.
                      </p>
                      
                      <div className="space-y-4">
                        <FormField
                          control={apiKeysForm.control}
                          name="cryptomusMerchantId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cryptomus Merchant ID</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter your Cryptomus Merchant ID"
                                  className="font-mono"
                                />
                              </FormControl>
                              <FormDescription>
                                Your unique merchant identifier from Cryptomus
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={apiKeysForm.control}
                          name="cryptomusApiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cryptomus API Key</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type={showCryptomusApiKey ? "text" : "password"}
                                    placeholder="Enter your Cryptomus API Key"
                                    className="font-mono pr-10"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowCryptomusApiKey(!showCryptomusApiKey)}
                                  >
                                    {showCryptomusApiKey ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormDescription>
                                Your API key from Cryptomus dashboard (kept secure)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4 bg-yellow-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-yellow-600" />
                      <h4 className="text-sm font-semibold text-yellow-800">Security Notice</h4>
                    </div>
                    <p className="text-sm text-yellow-700">
                      API keys are stored securely in Supabase secrets and are never exposed in the frontend code. 
                      Make sure to use your production keys for live payments.
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button 
                type="submit"
                form="api-keys-form"
                className="ml-auto bg-blue-600 hover:bg-blue-700"
              >
                <Save size={16} className="mr-2" />
                Save API Keys
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <TwoFactorSetup />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
