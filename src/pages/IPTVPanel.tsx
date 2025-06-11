
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Server, Settings, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const IPTVPanel = () => {
  const { t } = useLanguage();

  const handleContactWhatsApp = (packageName: string, credits: number, price: number) => {
    const message = `${t.contact}, ${packageName} - ${credits} ${t.currency}${price}`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const packages = [
    {
      name: "STRONG 8K IPTV",
      icon: "🚀",
      description: t.premiumQualityDesc,
      creditOptions: [
        { credits: 10, price: 89 },
        { credits: 25, price: 199 },
        { credits: 50, price: 349 },
        { credits: 100, price: 599 }
      ]
    },
    {
      name: "TREX 8K IPTV",
      icon: "🦖", 
      description: t.guaranteedReliabilityDesc,
      creditOptions: [
        { credits: 10, price: 79 },
        { credits: 25, price: 179 },
        { credits: 50, price: 319 },
        { credits: 100, price: 549 }
      ]
    },
    {
      name: "PROMAX 4K IPTV",
      icon: "⚡",
      description: t.fastActivationDesc,
      creditOptions: [
        { credits: 10, price: 119 },
        { credits: 25, price: 269 },
        { credits: 50, price: 479 },
        { credits: 100, price: 819 }
      ]
    },
    {
      name: "TIVIONE 4K IPTV",
      icon: "📺",
      description: t.premiumQualityDesc,
      creditOptions: [
        { credits: 10, price: 99 },
        { credits: 25, price: 219 },
        { credits: 50, price: 389 },
        { credits: 100, price: 669 }
      ]
    },
    {
      name: "B1G 4K IPTV",
      icon: "🎬",
      description: t.guaranteedReliabilityDesc,
      creditOptions: [
        { credits: 10, price: 109 },
        { credits: 25, price: 249 },
        { credits: 50, price: 439 },
        { credits: 100, price: 759 }
      ]
    }
  ];

  return (
    <StoreLayout>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
              {t.iptvPanelTitle}
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
              {t.iptvPanelSubtitle}
            </p>
            
            {/* Credits Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto mb-8">
              <p className="text-blue-800 font-medium">
                💡 Each credit is equivalent to 1 month of service activation
              </p>
            </div>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Server className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.premiumQuality}</h3>
              <p className="text-gray-600">{t.premiumQualityDesc}</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Settings className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.fastActivation}</h3>
              <p className="text-gray-600">{t.fastActivationDesc}</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <BarChart3 className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.guaranteedReliability}</h3>
              <p className="text-gray-600">{t.guaranteedReliabilityDesc}</p>
            </Card>
          </div>

          <section className="space-y-16">
            {packages.map((pkg, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{pkg.icon}</div>
                    <div>
                      <h2 className="text-3xl font-bold">{pkg.name}</h2>
                      <p className="text-red-100 text-lg">{pkg.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t.manageSubscriptions}</h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {pkg.creditOptions.map((option, idx) => (
                      <Card key={idx} className="p-6 border-2 border-gray-100 hover:border-red-200 transition-all duration-300 hover:shadow-lg">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-600 mb-2">{option.credits}</div>
                          <div className="text-sm text-gray-600 mb-2">Credits</div>
                          <div className="text-xs text-blue-600 mb-4">({option.credits} months)</div>
                          <div className="text-2xl font-bold text-gray-900 mb-4">{t.currency}{option.price}</div>
                          <div className="text-sm text-gray-500 mb-6">
                            {t.currency}{(option.price / option.credits).toFixed(1)} {t.perMonth}
                          </div>
                          <Button 
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                            onClick={() => handleContactWhatsApp(pkg.name, option.credits, option.price)}
                          >
                            <MessageCircle className="mr-2" size={16} />
                            {t.buyNow}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>

          <div className="text-center mt-16 bg-red-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.needHelp}</h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              {t.fastActivationDesc}
            </p>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default IPTVPanel;
