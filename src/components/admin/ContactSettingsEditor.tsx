
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSiteSettings, useUpdateSiteSetting } from '@/hooks/useSiteSettings';
import { Phone, MessageCircle, Save } from 'lucide-react';

const contactSchema = z.object({
  whatsappNumber: z.string().min(1, 'WhatsApp number is required'),
  telegramUsername: z.string().min(1, 'Telegram username is required'),
});

type ContactValues = z.infer<typeof contactSchema>;

const ContactSettingsEditor = () => {
  const { data: settings } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      whatsappNumber: '',
      telegramUsername: '',
    },
  });

  // Update form when settings load
  React.useEffect(() => {
    if (settings) {
      form.setValue('whatsappNumber', settings.find(s => s.setting_key === 'whatsapp_number')?.setting_value || '');
      form.setValue('telegramUsername', settings.find(s => s.setting_key === 'telegram_username')?.setting_value || '');
    }
  }, [settings, form]);

  const onSubmit = async (data: ContactValues) => {
    try {
      await updateSetting.mutateAsync({ key: 'whatsapp_number', value: data.whatsappNumber });
      await updateSetting.mutateAsync({ key: 'telegram_username', value: data.telegramUsername });
    } catch (error) {
      console.error('Error updating contact settings:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-blue-600" />
          Contact Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., 1234567890"
                      className="max-w-md"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the WhatsApp number for customer support (numbers only)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telegramUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telegram Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., bwivoxiptv"
                      className="max-w-md"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the Telegram username for customer support (without @)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={updateSetting.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateSetting.isPending ? 'Saving...' : 'Save Contact Settings'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactSettingsEditor;
