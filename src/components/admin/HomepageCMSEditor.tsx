import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useAllHomepageContent, useUpdateHomepageSection } from '@/hooks/useHomepageContent';
import { Loader2, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const HomepageCMSEditor = () => {
  const { data: sections, isLoading } = useAllHomepageContent();
  const updateSection = useUpdateHomepageSection();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const handleEdit = (section: any) => {
    setEditingSection(section.id);
    setFormData(section.content_data);
  };

  const handleSave = async (sectionId: string) => {
    try {
      await updateSection.mutateAsync({
        id: sectionId,
        content_data: formData,
      });
      setEditingSection(null);
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const handleToggleVisibility = async (sectionId: string, currentStatus: boolean) => {
    try {
      const section = sections?.find(s => s.id === sectionId);
      if (!section) return;

      await updateSection.mutateAsync({
        id: sectionId,
        content_data: section.content_data,
        is_enabled: !currentStatus,
      });
      toast.success(`Section ${!currentStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const updateNestedField = (path: string, value: string, language: string) => {
    const newData = { ...formData };
    const keys = path.split('.');
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    if (!current[lastKey]) {
      current[lastKey] = {};
    }
    current[lastKey][language] = value;
    setFormData(newData);
  };

  const updateArrayField = (arrayPath: string, index: number, field: string, value: string, language: string) => {
    const newData = { ...formData };
    if (!newData[arrayPath]) return;
    
    if (!newData[arrayPath][index][field]) {
      newData[arrayPath][index][field] = {};
    }
    newData[arrayPath][index][field][language] = value;
    setFormData(newData);
  };

  const renderMultilingualInput = (label: string, path: string, isTextarea: boolean = false) => {
    const getValue = (lang: string) => {
      const keys = path.split('.');
      let value: any = formData;
      for (const key of keys) {
        value = value?.[key];
      }
      return value?.[lang] || '';
    };

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Tabs defaultValue="en" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="fr">Français</TabsTrigger>
            <TabsTrigger value="ar">العربية</TabsTrigger>
          </TabsList>
          {['en', 'fr', 'ar'].map((lang) => (
            <TabsContent key={lang} value={lang}>
              {isTextarea ? (
                <Textarea
                  value={getValue(lang)}
                  onChange={(e) => updateNestedField(path, e.target.value, lang)}
                  rows={3}
                  className={lang === 'ar' ? 'text-right' : ''}
                />
              ) : (
                <Input
                  value={getValue(lang)}
                  onChange={(e) => updateNestedField(path, e.target.value, lang)}
                  className={lang === 'ar' ? 'text-right' : ''}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Homepage Content Management</h2>
        <p className="text-muted-foreground">Edit all homepage sections with multilingual support</p>
      </div>

      {sections?.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="capitalize">{section.section_key.replace(/_/g, ' ')}</CardTitle>
                <CardDescription>Section ID: {section.section_key}</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={section.is_enabled}
                    onCheckedChange={() => handleToggleVisibility(section.id, section.is_enabled)}
                  />
                  <Label className="flex items-center gap-2">
                    {section.is_enabled ? (
                      <>
                        <Eye className="h-4 w-4" /> Visible
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4" /> Hidden
                      </>
                    )}
                  </Label>
                </div>
                {editingSection === section.id ? (
                  <Button onClick={() => handleSave(section.id)} disabled={updateSection.isPending}>
                    {updateSection.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                ) : (
                  <Button onClick={() => handleEdit(section)}>Edit</Button>
                )}
              </div>
            </div>
          </CardHeader>
          {editingSection === section.id && (
            <CardContent className="space-y-6">
              {/* Hero Section */}
              {section.section_key === 'hero' && (
                <>
                  {renderMultilingualInput('Title', 'title')}
                  {renderMultilingualInput('Subtitle', 'subtitle', true)}
                  {renderMultilingualInput('Guarantee Text', 'guaranteeText')}
                  {renderMultilingualInput('CTA Button Text', 'ctaButtonText')}
                </>
              )}

              {/* Subscriptions Section */}
              {section.section_key === 'subscriptions' && (
                <>
                  {renderMultilingualInput('Title', 'title')}
                  {renderMultilingualInput('Warranty Title', 'warrantyTitle')}
                  {renderMultilingualInput('Warranty Description', 'warrantyDescription', true)}
                </>
              )}

              {/* Feedback Section */}
              {section.section_key === 'feedback' && (
                <>
                  {renderMultilingualInput('Title', 'title')}
                  {renderMultilingualInput('Subtitle', 'subtitle')}
                  {renderMultilingualInput('CTA Button Text', 'ctaButtonText')}
                </>
              )}

              {/* Features Section */}
              {section.section_key === 'features' && (
                <>
                  {renderMultilingualInput('Title', 'title')}
                  {renderMultilingualInput('Subtitle', 'subtitle')}
                  {renderMultilingualInput('Feature 1 Title', 'feature1Title')}
                  {renderMultilingualInput('Feature 1 Description', 'feature1Desc', true)}
                  {renderMultilingualInput('Feature 2 Title', 'feature2Title')}
                  {renderMultilingualInput('Feature 2 Description', 'feature2Desc', true)}
                  {renderMultilingualInput('Feature 3 Title', 'feature3Title')}
                  {renderMultilingualInput('Feature 3 Description', 'feature3Desc', true)}
                </>
              )}

              {/* CTA Section */}
              {section.section_key === 'cta' && (
                <>
                  {renderMultilingualInput('Title', 'title')}
                  {renderMultilingualInput('Subtitle', 'subtitle')}
                </>
              )}

              {/* Why Choose Cards - Complex nested structure */}
              {section.section_key === 'why_choose_cards' && formData.cards && (
                <div className="space-y-4">
                  {formData.cards.map((card: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>Card {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Icon</Label>
                          <Input
                            value={card.icon || ''}
                            onChange={(e) => {
                              const newData = { ...formData };
                              newData.cards[index].icon = e.target.value;
                              setFormData(newData);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Tabs defaultValue="en" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="en">English</TabsTrigger>
                              <TabsTrigger value="fr">Français</TabsTrigger>
                              <TabsTrigger value="ar">العربية</TabsTrigger>
                            </TabsList>
                            {['en', 'fr', 'ar'].map((lang) => (
                              <TabsContent key={lang} value={lang}>
                                <Input
                                  value={card.title?.[lang] || ''}
                                  onChange={(e) => updateArrayField('cards', index, 'title', e.target.value, lang)}
                                  className={lang === 'ar' ? 'text-right' : ''}
                                />
                              </TabsContent>
                            ))}
                          </Tabs>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Tabs defaultValue="en" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="en">English</TabsTrigger>
                              <TabsTrigger value="fr">Français</TabsTrigger>
                              <TabsTrigger value="ar">العربية</TabsTrigger>
                            </TabsList>
                            {['en', 'fr', 'ar'].map((lang) => (
                              <TabsContent key={lang} value={lang}>
                                <Textarea
                                  value={card.description?.[lang] || ''}
                                  onChange={(e) => updateArrayField('cards', index, 'description', e.target.value, lang)}
                                  className={lang === 'ar' ? 'text-right' : ''}
                                  rows={2}
                                />
                              </TabsContent>
                            ))}
                          </Tabs>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Testimonials - Complex nested structure */}
              {section.section_key === 'testimonials' && (
                <>
                  {renderMultilingualInput('Title', 'title')}
                  {renderMultilingualInput('Subtitle', 'subtitle')}
                  {formData.testimonials && (
                    <div className="space-y-4 mt-6">
                      <h3 className="text-lg font-semibold">Testimonials</h3>
                      {formData.testimonials.map((testimonial: any, index: number) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle>Testimonial {index + 1}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Name</Label>
                              <Input
                                value={testimonial.name || ''}
                                onChange={(e) => {
                                  const newData = { ...formData };
                                  newData.testimonials[index].name = e.target.value;
                                  setFormData(newData);
                                }}
                              />
                            </div>
                            <div>
                              <Label>Avatar URL</Label>
                              <Input
                                value={testimonial.avatar || ''}
                                onChange={(e) => {
                                  const newData = { ...formData };
                                  newData.testimonials[index].avatar = e.target.value;
                                  setFormData(newData);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Testimonial Text</Label>
                              <Tabs defaultValue="en" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="en">English</TabsTrigger>
                                  <TabsTrigger value="fr">Français</TabsTrigger>
                                  <TabsTrigger value="ar">العربية</TabsTrigger>
                                </TabsList>
                                {['en', 'fr', 'ar'].map((lang) => (
                                  <TabsContent key={lang} value={lang}>
                                    <Textarea
                                      value={testimonial.text?.[lang] || ''}
                                      onChange={(e) => updateArrayField('testimonials', index, 'text', e.target.value, lang)}
                                      className={lang === 'ar' ? 'text-right' : ''}
                                      rows={3}
                                    />
                                  </TabsContent>
                                ))}
                              </Tabs>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default HomepageCMSEditor;
