
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateIPTVPackage, useUpdateIPTVPackage, IPTVPackage } from '@/hooks/useIPTVPackages';
import { Globe, Upload, Image } from 'lucide-react';
import EditableFeatureList from '@/components/admin/EditableFeatureList';
import { toast } from 'sonner';
import ImageUploader from '@/components/admin/ImageUploader';
import IPTVCreditOptionsManager from '@/components/admin/IPTVCreditOptionsManager';
import { getLocalizedText } from '@/lib/multilingualUtils';
import StockPromoEditor, { StockPromoValue } from '@/components/admin/StockPromoEditor';
import { normalizePromoTiers } from '@/lib/quantityPromo';

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const packageSchema = z.object({
  name: z.record(z.string().min(1, 'Name is required')),
  description: z.record(z.string().optional()),
  category: z.enum(['subscription', 'panel-iptv', 'player', 'activation-player', 'reseller']),
  features: z.array(z.string()).optional(),
  price_1_month: z.number().min(0).optional(),
  price_3_months: z.number().min(0).optional(),
  price_6_months: z.number().min(0).optional(),
  price_12_months: z.number().min(0).optional(),
  price_10_credits: z.number().min(0).optional(),
  price_25_credits: z.number().min(0).optional(),
  price_50_credits: z.number().min(0).optional(),
  price_100_credits: z.number().min(0).optional(),
  icon: z.string().optional(),
  icon_url: z.string().optional(),
  sort_order: z.number().optional(),
  status: z.enum(['active', 'inactive', 'featured']).optional(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

interface MultilingualPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package?: IPTVPackage | null;
}

const MultilingualPackageDialog: React.FC<MultilingualPackageDialogProps> = ({
  open,
  onOpenChange,
  package: editingPackage,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  const [showImageUploader, setShowImageUploader] = useState(false);
  const createPackage = useCreateIPTVPackage();
  const updatePackage = useUpdateIPTVPackage();

  const [stockPromo, setStockPromo] = useState<StockPromoValue>({
    stock_enabled: false,
    stock_quantity: 0,
    low_stock_threshold: 5,
    quantity_promo_mode: 'percentage',
    quantity_promos: [],
  });

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: { en: '' },
      description: { en: '' },
      category: 'subscription',
      features: [],
      price_1_month: 0,
      price_3_months: 0,
      price_6_months: 0,
      price_12_months: 0,
      price_10_credits: 0,
      price_25_credits: 0,
      price_50_credits: 0,
      price_100_credits: 0,
      icon: '',
      icon_url: '',
      sort_order: 0,
      status: 'active',
    },
  });

  React.useEffect(() => {
    if (editingPackage) {
      // Parse multilingual content if it exists
      const parseName = (name: string) => {
        try {
          const parsed = JSON.parse(name);
          return typeof parsed === 'object' ? parsed : { en: name };
        } catch {
          return { en: name };
        }
      };

      const parseDescription = (description: string | null) => {
        if (!description) return { en: '' };
        try {
          const parsed = JSON.parse(description);
          return typeof parsed === 'object' ? parsed : { en: description };
        } catch {
          return { en: description };
        }
      };

      form.reset({
        name: parseName(editingPackage.name),
        description: parseDescription(editingPackage.description),
        category: editingPackage.category,
        features: editingPackage.features || [],
        price_1_month: editingPackage.price_1_month || 0,
        price_3_months: editingPackage.price_3_months || 0,
        price_6_months: editingPackage.price_6_months || 0,
        price_12_months: editingPackage.price_12_months || 0,
        price_10_credits: editingPackage.price_10_credits || 0,
        price_25_credits: editingPackage.price_25_credits || 0,
        price_50_credits: editingPackage.price_50_credits || 0,
        price_100_credits: editingPackage.price_100_credits || 0,
        icon: editingPackage.icon || '',
        icon_url: editingPackage.icon_url || '',
        sort_order: editingPackage.sort_order || 0,
        status: editingPackage.status || 'active',
      });
      setStockPromo({
        stock_enabled: !!(editingPackage as any).stock_enabled,
        stock_quantity: Number((editingPackage as any).stock_quantity ?? 0),
        low_stock_threshold: Number((editingPackage as any).low_stock_threshold ?? 5),
        quantity_promo_mode: ((editingPackage as any).quantity_promo_mode === 'fixed' ? 'fixed' : 'percentage'),
        quantity_promos: normalizePromoTiers((editingPackage as any).quantity_promos),
      });
    } else {
      form.reset({
        name: { en: '' },
        description: { en: '' },
        category: 'subscription',
        features: [],
        price_1_month: 0,
        price_3_months: 0,
        price_6_months: 0,
        price_12_months: 0,
        price_10_credits: 0,
        price_25_credits: 0,
        price_50_credits: 0,
        price_100_credits: 0,
        icon: '',
        icon_url: '',
        sort_order: 0,
        status: 'active',
      });
      setStockPromo({
        stock_enabled: false,
        stock_quantity: 0,
        low_stock_threshold: 5,
        quantity_promo_mode: 'percentage',
        quantity_promos: [],
      });
    }
  }, [editingPackage, form]);

  const onSubmit = async (data: PackageFormValues) => {
    try {
      // Convert multilingual objects to JSON strings for database storage
      const packageData = {
        name: JSON.stringify(data.name),
        description: JSON.stringify(data.description),
        category: data.category,
        features: data.features || [],
        price_1_month: data.price_1_month,
        price_3_months: data.price_3_months,
        price_6_months: data.price_6_months,
        price_12_months: data.price_12_months,
        price_10_credits: data.price_10_credits,
        price_25_credits: data.price_25_credits,
        price_50_credits: data.price_50_credits,
        price_100_credits: data.price_100_credits,
        icon: data.icon,
        icon_url: data.icon_url,
        sort_order: data.sort_order,
        status: data.status,
      };

      if (editingPackage) {
        await updatePackage.mutateAsync({ id: editingPackage.id, ...packageData });
        toast.success('Package updated successfully');
      } else {
        await createPackage.mutateAsync(packageData);
        toast.success('Package created successfully');
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error('Failed to save package');
    }
  };


  const isMonthBasedCategory = (category: string) => {
    return category === 'subscription' || category === 'activation-player';
  };

  const isCreditBasedCategory = (category: string) => {
    return category === 'panel-iptv' || category === 'player';
  };

  const getCurrentLanguageName = () => {
    return form.watch('name')[selectedLanguage] || '';
  };

  const getCurrentLanguageDescription = () => {
    return form.watch('description')[selectedLanguage] || '';
  };

  const updateCurrentLanguageName = (value: string) => {
    const currentNames = form.getValues('name');
    form.setValue('name', { ...currentNames, [selectedLanguage]: value });
  };

  const updateCurrentLanguageDescription = (value: string) => {
    const currentDescriptions = form.getValues('description');
    form.setValue('description', { ...currentDescriptions, [selectedLanguage]: value });
  };

  const handleImageUpload = (imageUrl: string) => {
    form.setValue('icon_url', imageUrl);
    setShowImageUploader(false);
    toast.success('Image uploaded successfully');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {editingPackage ? 'Edit Package' : 'Create New Package'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="subscription">Subscription</SelectItem>
                        <SelectItem value="panel-iptv">Panel IPTV</SelectItem>
                        <SelectItem value="player">Panel Player</SelectItem>
                        <SelectItem value="activation-player">Activation Player</SelectItem>
                        <SelectItem value="reseller">Reseller</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="featured">Featured</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Multilingual Content Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <h3 className="text-lg font-semibold">Multilingual Content</h3>
              </div>
              
              <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <TabsList className="grid w-full grid-cols-6">
                  {supportedLanguages.map((lang) => (
                    <TabsTrigger key={lang.code} value={lang.code} className="flex items-center gap-1">
                      <span>{lang.flag}</span>
                      <span className="hidden sm:inline">{lang.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {supportedLanguages.map((lang) => (
                  <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <FormLabel>Name ({lang.name})</FormLabel>
                        <Input
                          value={getCurrentLanguageName()}
                          onChange={(e) => updateCurrentLanguageName(e.target.value)}
                          placeholder={`Enter package name in ${lang.name}`}
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Description ({lang.name})</FormLabel>
                        <Textarea
                          value={getCurrentLanguageDescription()}
                          onChange={(e) => updateCurrentLanguageDescription(e.target.value)}
                          placeholder={`Enter package description in ${lang.name}`}
                          rows={4}
                        />
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Features Section */}
            <EditableFeatureList
              features={form.watch('features') || []}
              onChange={(features) => form.setValue('features', features)}
            />

            {/* Pricing Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing</h3>
              
              {isMonthBasedCategory(form.watch('category')) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="price_1_month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>1 Month</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price_3_months"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>3 Months</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price_6_months"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>6 Months</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price_12_months"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>12 Months</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {isCreditBasedCategory(form.watch('category')) && editingPackage && (
                <IPTVCreditOptionsManager
                  packageId={editingPackage.id}
                  packageName={getLocalizedText(editingPackage.name, 'en', 'en')}
                />
              )}

              {isCreditBasedCategory(form.watch('category')) && !editingPackage && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  Save the package first, then edit it to configure custom credit options.
                </div>
              )}
            </div>

            {/* Icon and Logo Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Icon & Logo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Tv" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="icon_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/icon.png" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sort_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Logo Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowImageUploader(true)}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </Button>
                  {form.watch('icon_url') && (
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      <span className="text-sm text-gray-600">Logo uploaded</span>
                    </div>
                  )}
                </div>
                
                {form.watch('icon_url') && (
                  <div className="mt-2">
                    <img 
                      src={form.watch('icon_url')} 
                      alt="Package logo" 
                      className="h-16 w-16 object-contain rounded border"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPackage.isPending || updatePackage.isPending}>
                {createPackage.isPending || updatePackage.isPending ? 'Saving...' : 'Save Package'}
              </Button>
            </div>
          </form>
        </Form>

        {/* Image Uploader Dialog */}
        {showImageUploader && (
          <Dialog open={showImageUploader} onOpenChange={setShowImageUploader}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Package Logo</DialogTitle>
              </DialogHeader>
              <ImageUploader
                onImageUpload={handleImageUpload}
                onCancel={() => setShowImageUploader(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MultilingualPackageDialog;
