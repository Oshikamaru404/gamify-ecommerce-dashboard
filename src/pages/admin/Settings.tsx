
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Globe, MessageSquare, Palette, FileText, Shield } from 'lucide-react';
import TranslationEditor from '@/components/admin/TranslationEditor';
import ImprovedTranslatedContentEditor from '@/components/admin/ImprovedTranslatedContentEditor';
import ContactSettingsEditor from '@/components/admin/ContactSettingsEditor';
import CSSStyleEditor from '@/components/admin/CSSStyleEditor';
import TwoFactorSettings from '@/components/admin/TwoFactorSettings';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="translations" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Translations
          </TabsTrigger>
          <TabsTrigger value="translated-content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Translated Text
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="styles" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Styles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  General application settings will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <TwoFactorSettings />
        </TabsContent>

        <TabsContent value="translations" className="space-y-4">
          <TranslationEditor />
        </TabsContent>

        <TabsContent value="translated-content" className="space-y-4">
          <ImprovedTranslatedContentEditor />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <ContactSettingsEditor />
        </TabsContent>

        <TabsContent value="styles" className="space-y-4">
          <CSSStyleEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
