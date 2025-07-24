
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useUpdateTranslation } from '@/hooks/useTranslations';
import { Languages, Save, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const translationSchema = z.object({
  languageCode: z.string().min(1, 'Language code is required'),
  translationKey: z.string().min(1, 'Translation key is required'),
  translationValue: z.string().min(1, 'Translation value is required'),
});

type TranslationValues = z.infer<typeof translationSchema>;

const TranslationEditor = () => {
  const { data: translations } = useTranslations();
  const updateTranslation = useUpdateTranslation();

  const form = useForm<TranslationValues>({
    resolver: zodResolver(translationSchema),
    defaultValues: {
      languageCode: 'en',
      translationKey: '',
      translationValue: '',
    },
  });

  const onSubmit = async (data: TranslationValues) => {
    try {
      await updateTranslation.mutateAsync({
        languageCode: data.languageCode,
        key: data.translationKey,
        value: data.translationValue,
      });
      form.reset();
    } catch (error) {
      console.error('Error updating translation:', error);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  ];

  const groupedTranslations = translations?.reduce((acc, translation) => {
    if (!acc[translation.language_code]) {
      acc[translation.language_code] = [];
    }
    acc[translation.language_code].push(translation);
    return acc;
  }, {} as Record<string, typeof translations>) || {};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-blue-600" />
            Translation Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="languageCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="translationKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Translation Key</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., nav.home" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="translationValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Translation Value</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter the translated text"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the translated text for the selected language
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={updateTranslation.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                {updateTranslation.isPending ? 'Adding Translation...' : 'Add/Update Translation'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Translations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList className="grid w-full grid-cols-6">
              {languages.map((lang) => (
                <TabsTrigger key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {languages.map((lang) => (
              <TabsContent key={lang.code} value={lang.code} className="mt-4">
                <div className="space-y-4">
                  {groupedTranslations[lang.code]?.length > 0 ? (
                    groupedTranslations[lang.code].map((translation) => (
                      <div key={translation.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-700">
                              {translation.translation_key}
                            </h4>
                            <p className="text-gray-900 mt-1">{translation.translation_value}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              form.setValue('languageCode', lang.code);
                              form.setValue('translationKey', translation.translation_key);
                              form.setValue('translationValue', translation.translation_value);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No translations found for {lang.name}
                    </p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationEditor;
