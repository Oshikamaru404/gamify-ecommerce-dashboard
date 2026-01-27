
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
        <div className="overflow-x-auto -mx-2 px-2">
          <TabsList className="inline-flex gap-1 h-auto min-w-max sm:min-w-0 sm:w-full sm:grid sm:grid-cols-3">
            <TabsTrigger value="contact" className="flex items-center gap-1.5 text-xs sm:text-sm px-2 sm:px-3 py-2">
              <Settings className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Contact Settings</span>
              <span className="sm:hidden">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-1.5 text-xs sm:text-sm px-2 sm:px-3 py-2">
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">WhatsApp Templates</span>
              <span className="sm:hidden">WhatsApp</span>
            </TabsTrigger>
            <TabsTrigger value="translations" className="flex items-center gap-1.5 text-xs sm:text-sm px-2 sm:px-3 py-2">
              <Languages className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Translations</span>
              <span className="sm:hidden">Trans.</span>
            </TabsTrigger>
          </TabsList>
        </div>

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
