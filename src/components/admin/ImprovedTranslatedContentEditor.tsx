
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Globe, Plus, Edit, Trash2, Save, X, RefreshCw, Languages, BookOpen } from 'lucide-react';
import { useTranslatedContent, useUpdateTranslatedContent, useCreateTranslatedContent, useDeleteTranslatedContent } from '@/hooks/useTranslatedContent';
import { toast } from 'sonner';
import ContentKeySelector from './ContentKeySelector';

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

interface NewContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewContentDialog: React.FC<NewContentDialogProps> = ({ open, onOpenChange }) => {
  const [contentKey, setContentKey] = useState('');
  const [languageCode, setLanguageCode] = useState('en');
  const [value, setValue] = useState('');
  const createContent = useCreateTranslatedContent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contentKey || !languageCode || !value) {
      toast.error('All fields are required');
      return;
    }

    try {
      await createContent.mutateAsync({
        contentKey,
        languageCode,
        value,
      });
      
      setContentKey('');
      setLanguageCode('en');
      setValue('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating content:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Translated Content
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ContentKeySelector value={contentKey} onChange={setContentKey} />
          
          <div>
            <Label htmlFor="languageCode">Language</Label>
            <Select value={languageCode} onValueChange={setLanguageCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="value">Translated Content</Label>
            <Textarea
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter the translated content..."
              rows={4}
              required
              className="mt-2"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createContent.isPending}>
              {createContent.isPending ? 'Creating...' : 'Create Content'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ImprovedTranslatedContentEditor: React.FC = () => {
  const { data: translatedContent, isLoading, error } = useTranslatedContent();
  const updateContent = useUpdateTranslatedContent();
  const deleteContent = useDeleteTranslatedContent();
  const createContent = useCreateTranslatedContent();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showNewDialog, setShowNewDialog] = useState(false);

  const generateDefaultContent = async () => {
    const defaultValues: Record<string, string> = {
      'most_popular_badge': 'Most Popular',
      'per_month': '/month',
      'save_yearly': 'Save ${{amount}} yearly',
      'money_back_guarantee': '30-Day Money Back Guarantee',
      'view_details_button': 'View Details',
      'feature_4k_technology': '4K Premium Technology',
      'feature_8000_channels': '8000+ Channels',
      'feature_vod_library': 'VOD Library',
      'brand_name': 'BWIVOX IPTV',
      'footer_brand_description': 'Your premium IPTV service provider with guaranteed quality and 24/7 support.',
      'try_now_button': 'Try Now',
      'services_section_title': 'Services',
      'subscription_service_title': 'Subscription IPTV',
      'activation_service_title': 'Activation Player',
      'support_link_title': 'Support',
      'copyright_text': `© ${new Date().getFullYear()} BWIVOX IPTV. All rights reserved.`
    };

    try {
      for (const [key, value] of Object.entries(defaultValues)) {
        await createContent.mutateAsync({
          contentKey: key,
          languageCode: 'en',
          value: value,
        });
      }
      toast.success('Default content generated successfully!');
    } catch (error) {
      console.error('Error generating default content:', error);
      toast.error('Failed to generate some default content');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Translated Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Translated Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 p-4 text-center">
            Error loading translated content: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  const contentByKey = (translatedContent || []).reduce((acc, item) => {
    if (!acc[item.content_key]) {
      acc[item.content_key] = {};
    }
    acc[item.content_key][item.language_code] = item;
    return acc;
  }, {} as Record<string, Record<string, any>>);

  const handleEdit = (id: string, currentValue: string) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  const handleSave = async (contentKey: string, languageCode: string) => {
    try {
      await updateContent.mutateAsync({
        contentKey,
        languageCode,
        value: editValue,
      });
      setEditingId(null);
      setEditValue('');
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const getContentStats = () => {
    const totalKeys = Object.keys(contentByKey).length;
    const translatedKeys = Object.values(contentByKey).filter(
      translations => Object.keys(translations).length > 1
    ).length;
    const completionRate = totalKeys > 0 ? Math.round((translatedKeys / totalKeys) * 100) : 0;
    
    return { totalKeys, translatedKeys, completionRate };
  };

  const stats = getContentStats();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Translated Content Management
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {stats.totalKeys} content keys
              </div>
              <div className="flex items-center gap-1">
                <Languages className="h-4 w-4" />
                {stats.translatedKeys} translated
              </div>
              <Badge variant={stats.completionRate > 70 ? 'default' : 'secondary'}>
                {stats.completionRate}% complete
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={generateDefaultContent} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Defaults
            </Button>
            <Button onClick={() => setShowNewDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <TabsList className="grid w-full grid-cols-6 mb-6">
            {supportedLanguages.map((lang) => (
              <TabsTrigger key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {supportedLanguages.map((lang) => (
            <TabsContent key={lang.code} value={lang.code} className="space-y-4">
              <div className="space-y-4">
                {Object.entries(contentByKey).map(([contentKey, translations]) => {
                  const content = translations[lang.code];
                  return (
                    <Card key={contentKey} className="border-l-4 border-l-blue-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-sm font-medium">
                                {contentKey}
                              </CardTitle>
                              <Badge variant="outline" className="text-xs">
                                {lang.flag} {lang.name}
                              </Badge>
                              {content && (
                                <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                  Translated
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {content && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(content.id, content.content_value)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(content.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {editingId === content?.id ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={3}
                              className="resize-none"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSave(contentKey, lang.code)}
                                disabled={updateContent.isPending}
                              >
                                <Save className="h-4 w-4 mr-1" />
                                {updateContent.isPending ? 'Saving...' : 'Save'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {content ? (
                              <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
                                {content.content_value}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400 italic bg-red-50 p-3 rounded border border-red-200">
                                No translation available for {lang.name}. Click "Add Content" to create one.
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      <NewContentDialog 
        open={showNewDialog} 
        onOpenChange={setShowNewDialog} 
      />
    </Card>
  );
};

export default ImprovedTranslatedContentEditor;
