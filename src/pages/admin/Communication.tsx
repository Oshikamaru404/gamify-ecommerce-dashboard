
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactSettingsEditor from '@/components/admin/ContactSettingsEditor';
import WhatsAppTemplateEditor from '@/components/admin/WhatsAppTemplateEditor';
import TranslationEditor from '@/components/admin/TranslationEditor';
import { MessageSquare, Settings, Languages } from 'lucide-react';

const Communication = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Communication Management</h1>
        <p className="text-gray-600">
          Manage contact settings, WhatsApp templates, and site translations
        </p>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Contact Settings
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            WhatsApp Templates
          </TabsTrigger>
          <TabsTrigger value="translations" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            Translations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-6">
          <ContactSettingsEditor />
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <WhatsAppTemplateEditor />
        </TabsContent>

        <TabsContent value="translations" className="space-y-6">
          <TranslationEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communication;
