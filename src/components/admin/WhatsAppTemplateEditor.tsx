
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWhatsAppTemplates, useUpdateWhatsAppTemplate } from '@/hooks/useWhatsAppTemplates';
import { MessageSquare, Save } from 'lucide-react';

const templateSchema = z.object({
  orderStatusTemplate: z.string().min(1, 'Order status template is required'),
  welcomeTemplate: z.string().min(1, 'Welcome template is required'),
  processingTemplate: z.string().min(1, 'Processing template is required'),
  deliveredTemplate: z.string().min(1, 'Delivered template is required'),
  cancelledTemplate: z.string().min(1, 'Cancelled template is required'),
});

type TemplateValues = z.infer<typeof templateSchema>;

const WhatsAppTemplateEditor = () => {
  const { data: templates } = useWhatsAppTemplates();
  const updateTemplate = useUpdateWhatsAppTemplate();

  const form = useForm<TemplateValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      orderStatusTemplate: '',
      welcomeTemplate: '',
      processingTemplate: '',
      deliveredTemplate: '',
      cancelledTemplate: '',
    },
  });

  // Update form when templates load
  React.useEffect(() => {
    if (templates) {
      form.setValue('orderStatusTemplate', templates.find(t => t.template_key === 'order_status')?.template_value || '');
      form.setValue('welcomeTemplate', templates.find(t => t.template_key === 'welcome')?.template_value || '');
      form.setValue('processingTemplate', templates.find(t => t.template_key === 'processing')?.template_value || '');
      form.setValue('deliveredTemplate', templates.find(t => t.template_key === 'delivered')?.template_value || '');
      form.setValue('cancelledTemplate', templates.find(t => t.template_key === 'cancelled')?.template_value || '');
    }
  }, [templates, form]);

  const onSubmit = async (data: TemplateValues) => {
    try {
      await updateTemplate.mutateAsync({ key: 'order_status', value: data.orderStatusTemplate });
      await updateTemplate.mutateAsync({ key: 'welcome', value: data.welcomeTemplate });
      await updateTemplate.mutateAsync({ key: 'processing', value: data.processingTemplate });
      await updateTemplate.mutateAsync({ key: 'delivered', value: data.deliveredTemplate });
      await updateTemplate.mutateAsync({ key: 'cancelled', value: data.cancelledTemplate });
    } catch (error) {
      console.error('Error updating templates:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-green-600" />
          WhatsApp Message Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="orderStatusTemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Status Update Template</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Template for order status updates"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Use {'{customerName}'}, {'{orderId}'}, {'{packageName}'}, {'{status}'}, {'{paymentStatus}'} for dynamic content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="welcomeTemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Welcome Message Template</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Template for welcome messages"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Use {'{customerName}'}, {'{packageName}'} for dynamic content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processingTemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processing Notification Template</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Template for processing notifications"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Use {'{customerName}'}, {'{orderId}'}, {'{packageName}'} for dynamic content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveredTemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivered Notification Template</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Template for delivered notifications"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Use {'{customerName}'}, {'{orderId}'}, {'{packageName}'} for dynamic content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cancelledTemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cancelled Notification Template</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Template for cancelled notifications"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Use {'{customerName}'}, {'{orderId}'}, {'{packageName}'} for dynamic content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={updateTemplate.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateTemplate.isPending ? 'Saving Templates...' : 'Save All Templates'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WhatsAppTemplateEditor;
