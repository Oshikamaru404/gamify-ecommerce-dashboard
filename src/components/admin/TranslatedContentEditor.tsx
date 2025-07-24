
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Globe, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useTranslatedContent, useUpdateTranslatedContent, useCreateTranslatedContent, useDeleteTranslatedContent } from '@/hooks/useTranslatedContent';
import { toast } from 'sonner';

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

// Default content keys that should be available
const defaultContentKeys = [
  'service_warranty_30_days',
  'device_activation_service',
  'activation_packages_12_months',
  'free_trial_text',
  'subscription_title',
  'activation_title',
  'reseller_title',
  'panel_iptv_title',
  'panel_player_title',
  'why_choose_us_title',
  'testimonials_title',
  'footer_description',
  'contact_us_title',
  'support_title',
  'how_to_buy_title',
  'refund_policy_title',
  'privacy_policy_title',
  'blog_title',
  'about_us_title',
  'features_title',
  'pricing_title',
  'try_now_text',
  'get_started_text',
  'learn_more_text',
  'contact_support_text',
  'whatsapp_contact_text',
  'email_contact_text',
  'phone_contact_text',
  'address_text',
  'working_hours_text',
  'copyright_text',
  'terms_conditions_text',
  'quality_guarantee_text',
  'customer_satisfaction_text',
  'technical_support_text',
  'installation_guide_text',
  'troubleshooting_text',
  'faq_text',
  'popular_packages_text',
  'featured_services_text',
  'special_offers_text',
  'new_arrivals_text',
  'bestsellers_text',
  'recommended_text',
  'add_to_cart_text',
  'buy_now_text',
  'view_details_text',
  'compare_packages_text',
  'service_description_text',
  'package_features_text',
  'compatibility_text',
  'requirements_text',
  'installation_text',
  'setup_guide_text',
  'user_manual_text',
  'video_tutorials_text',
  'live_chat_text',
  'ticket_system_text',
  'knowledge_base_text',
  'community_forum_text',
  'social_media_text',
  'newsletter_signup_text',
  'subscribe_text',
  'unsubscribe_text',
  'update_preferences_text',
  'account_settings_text',
  'profile_settings_text',
  'notification_settings_text',
  'security_settings_text',
  'language_settings_text',
  'theme_settings_text',
  'accessibility_settings_text',
  'backup_settings_text',
  'export_data_text',
  'import_data_text',
  'reset_settings_text',
  'delete_account_text',
  'logout_text',
  'login_text',
  'register_text',
  'forgot_password_text',
  'reset_password_text',
  'change_password_text',
  'verify_email_text',
  'resend_verification_text',
  'account_verified_text',
  'account_suspended_text',
  'account_expired_text',
  'subscription_expired_text',
  'payment_failed_text',
  'payment_successful_text',
  'order_confirmed_text',
  'order_shipped_text',
  'order_delivered_text',
  'order_cancelled_text',
  'refund_processed_text',
  'refund_pending_text',
  'refund_denied_text',
  'maintenance_mode_text',
  'coming_soon_text',
  'page_not_found_text',
  'server_error_text',
  'network_error_text',
  'loading_text',
  'saving_text',
  'success_text',
  'error_text',
  'warning_text',
  'info_text',
  'confirm_text',
  'cancel_text',
  'ok_text',
  'yes_text',
  'no_text',
  'continue_text',
  'back_text',
  'next_text',
  'previous_text',
  'skip_text',
  'finish_text',
  'close_text',
  'minimize_text',
  'maximize_text',
  'restore_text',
  'refresh_text',
  'reload_text',
  'search_text',
  'filter_text',
  'sort_text',
  'export_text',
  'import_text',
  'print_text',
  'share_text',
  'copy_text',
  'paste_text',
  'cut_text',
  'undo_text',
  'redo_text',
  'select_all_text',
  'deselect_all_text',
  'select_text',
  'deselect_text',
  'expand_text',
  'collapse_text',
  'show_more_text',
  'show_less_text',
  'read_more_text',
  'read_less_text',
  'view_all_text',
  'hide_text',
  'show_text'
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Translated Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="contentKey">Content Key</Label>
            <Input
              id="contentKey"
              value={contentKey}
              onChange={(e) => setContentKey(e.target.value)}
              placeholder="e.g., service_warranty_30_days"
              required
            />
          </div>
          
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
            <Label htmlFor="value">Content Value</Label>
            <Textarea
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter the translated content..."
              rows={4}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createContent.isPending}>
              {createContent.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TranslatedContentEditor: React.FC = () => {
  const { data: translatedContent, isLoading, error } = useTranslatedContent();
  const updateContent = useUpdateTranslatedContent();
  const deleteContent = useDeleteTranslatedContent();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showNewDialog, setShowNewDialog] = useState(false);

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

  const filteredContent = Object.entries(contentByKey).filter(([key, translations]) => {
    return translations[selectedLanguage];
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Translated Content
          </CardTitle>
          <Button onClick={() => setShowNewDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <TabsList className="grid w-full grid-cols-6">
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
                    <Card key={contentKey}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-sm font-medium">
                              {contentKey}
                            </CardTitle>
                            <Badge variant="outline" className="mt-1">
                              {lang.flag} {lang.name}
                            </Badge>
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
                          <div className="space-y-2">
                            <Textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={3}
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
                          <div className="text-sm text-gray-600">
                            {content ? content.content_value : (
                              <span className="text-gray-400 italic">
                                No translation available for {lang.name}
                              </span>
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

export default TranslatedContentEditor;
