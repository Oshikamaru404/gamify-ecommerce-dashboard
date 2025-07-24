
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, TrendingUp, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Reseller = () => {
  const { t } = useLanguage();
  const { data: siteSettings } = useSiteSettings();
  
  // Get WhatsApp number from site settings
  const whatsappNumber = siteSettings?.find(s => s.setting_key === 'whatsapp_number')?.setting_value || '1234567890';

  const handleContactWhatsApp = () => {
    const message = t.tryFree;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <StoreLayout>
      <div className="bg-white">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
              {t.resellerTitle}
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
              {t.resellerSubtitle}
            </p>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Users className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.dedicatedSupport}</h3>
              <p className="text-gray-600">{t.dedicatedSupportDesc}</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <TrendingUp className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.highCommissions}</h3>
              <p className="text-gray-600">{t.highCommissionsDesc}</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.marketingTools}</h3>
              <p className="text-gray-600">{t.marketingToolsDesc}</p>
            </Card>
          </div>

          <div className="bg-red-50 rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-center mb-6">{t.resellerBenefits}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">✓</span>
                <span>{t.highCommissions}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">✓</span>
                <span>{t.dedicatedSupport}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">✓</span>
                <span>{t.marketingTools}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">✓</span>
                <span>{t.support247}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-xl"
              onClick={handleContactWhatsApp}
            >
              <MessageCircle className="mr-2" size={24} />
              {t.becomeReseller}
            </Button>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Reseller;
