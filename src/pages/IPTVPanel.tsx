
import React, { useState } from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Server, Settings, BarChart3 } from 'lucide-react';
import CheckoutForm from '@/components/CheckoutForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';

const IPTVPanel = () => {
  const { t } = useLanguage();
  const { data: packages, isLoading } = useIPTVPackages();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleContactWhatsApp = (packageName: string, credits: number, price: number) => {
    const message = `${t.contact}, ${packageName} - ${credits} ${t.currency}${price}`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleBuyNow = (packageName: string, credits: number, price: number) => {
    setSelectedPackage({
      id: `iptv-${packageName.toLowerCase().replace(/\s+/g, '-')}`,
      name: packageName,
      category: 'iptv-panel',
      price: price,
      duration: credits
    });
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setSelectedPackage(null);
  };

  const handleOrderSuccess = () => {
    console.log('Order submitted successfully');
  };

  // Filter panel-iptv packages from database
  const panelIptvPackages = packages?.filter(pkg => pkg.category === 'panel-iptv' && pkg.status !== 'inactive') || [];

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
          <div className="container py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading packages...</p>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

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
            {panelIptvPackages.length > 0 ? (
              panelIptvPackages.map((pkg, index) => (
                <div key={pkg.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 flex items-center justify-center">
                        {pkg.icon_url ? (
                          <img 
                            src={pkg.icon_url} 
                            alt={pkg.name} 
                            className="w-14 h-14 rounded-lg object-cover shadow-lg" 
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        
                        <div 
                          className="w-14 h-14 rounded-lg bg-red-400/30 flex items-center justify-center text-3xl backdrop-blur-sm" 
                          style={{ display: pkg.icon_url ? 'none' : 'flex' }}
                        >
                          {pkg.icon || '🖥️'}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">{pkg.name}</h2>
                        <p className="text-red-100 text-lg">{pkg.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t.manageSubscriptions}</h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {[
                        { credits: 10, price: pkg.price_10_credits },
                        { credits: 25, price: pkg.price_25_credits },
                        { credits: 50, price: pkg.price_50_credits },
                        { credits: 100, price: pkg.price_100_credits }
                      ].filter(option => option.price).map((option, idx) => (
                        <Card key={idx} className="p-6 border-2 border-gray-100 hover:border-red-200 transition-all duration-300 hover:shadow-lg">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-red-600 mb-2">{option.credits}</div>
                            <div className="text-sm text-gray-600 mb-2">Credits</div>
                            
                            {/* Editable Features Section */}
                            {pkg.features && pkg.features.length > 0 && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                {pkg.features.map((feature, featureIdx) => (
                                  <div key={featureIdx} className="text-sm font-medium text-blue-900 mb-1">
                                    {feature}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="text-2xl font-bold text-gray-900 mb-4">${option.price}</div>
                            
                            <div className="space-y-2">
                              <Button 
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" 
                                onClick={() => handleBuyNow(pkg.name, option.credits, option.price!)}
                              >
                                Quick Order
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Panel IPTV Packages Available</h3>
                <p className="text-gray-600">Panel IPTV packages are currently being updated. Please check back later.</p>
              </div>
            )}
          </section>

          <div className="text-center mt-16 space-y-4">
            <div className="bg-red-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.needHelp}</h3>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                {t.fastActivationDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Checkout Form Modal */}
        {showCheckout && selectedPackage && (
          <CheckoutForm 
            packageData={selectedPackage} 
            onClose={handleCloseCheckout} 
            onSuccess={handleOrderSuccess} 
          />
        )}
      </div>
    </StoreLayout>
  );
};

export default IPTVPanel;
