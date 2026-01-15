
import React, { useState } from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Server, Settings, BarChart3, ArrowRight } from 'lucide-react';
import PaymentOptionsCheckout from '@/components/PaymentOptionsCheckout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';
import { useLocalizedText } from '@/lib/multilingualUtils';
import { Link } from 'react-router-dom';

const IPTVPanel = () => {
  const { t } = useLanguage();
  const { data: packages, isLoading } = useIPTVPackages();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleBuyNow = (pkg: any, credits: number, price: number) => {
    setSelectedPackage({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      icon_url: pkg.icon_url,
      category: pkg.category,
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
    setShowCheckout(false);
    setSelectedPackage(null);
  };

  // Generate a URL-friendly slug from the package name
  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .trim();
  };

  // Filter panel-iptv packages from database
  const panelIptvPackages = packages?.filter(pkg => pkg.category === 'panel-iptv' && pkg.status !== 'inactive') || [];

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
          <div className="container py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8f35e5] mx-auto"></div>
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
              <Server className="h-16 w-16 text-[#8f35e5] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.premiumQuality}</h3>
              <p className="text-gray-600">{t.premiumQualityDesc}</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Settings className="h-16 w-16 text-[#8f35e5] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.fastActivation}</h3>
              <p className="text-gray-600">{t.fastActivationDesc}</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <BarChart3 className="h-16 w-16 text-[#8f35e5] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.guaranteedReliability}</h3>
              <p className="text-gray-600">{t.guaranteedReliabilityDesc}</p>
            </Card>
          </div>

          <section className="space-y-16">
            {panelIptvPackages.length > 0 ? (
              panelIptvPackages.map((pkg, index) => {
                // Use the multilingual utility to get localized text
                const displayName = useLocalizedText(pkg.name);
                const displayDescription = useLocalizedText(pkg.description);
                
                return (
                  <div key={pkg.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#8f35e5] to-[#7c2fd4] text-white p-4 sm:p-6 md:p-8">
                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
                        <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 flex-shrink-0 flex items-center justify-center">
                          {pkg.icon_url ? (
                            <img 
                              src={pkg.icon_url} 
                              alt={displayName} 
                              className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-lg object-cover shadow-lg" 
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          
                          <div 
                            className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-lg bg-white/20 flex items-center justify-center text-2xl sm:text-3xl backdrop-blur-sm" 
                            style={{ display: pkg.icon_url ? 'none' : 'flex' }}
                          >
                            {pkg.icon || '🖥️'}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">{displayName}</h2>
                          <p className="text-purple-100 text-sm sm:text-base md:text-lg line-clamp-2">{displayDescription}</p>
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
                          <Card key={idx} className="p-6 border-2 border-gray-100 hover:border-[#8f35e5]/30 transition-all duration-300 hover:shadow-lg">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-[#8f35e5] mb-2">{option.credits}</div>
                              <div className="text-sm text-gray-600 mb-2">Credits</div>
                              
                              {/* Editable Features Section */}
                              {pkg.features && pkg.features.length > 0 && (
                                <div className="bg-[#8f35e5]/10 border border-[#8f35e5]/20 rounded-lg p-3 mb-4">
                                  {pkg.features.map((feature, featureIdx) => (
                                    <div key={featureIdx} className="text-sm font-medium text-[#8f35e5] mb-1">
                                      {feature}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="text-2xl font-bold text-gray-900 mb-4">${option.price}</div>
                              
                              <div className="space-y-2">
                                <Button 
                                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" 
                                  onClick={() => handleBuyNow(pkg, option.credits, option.price!)}
                                >
                                  Quick Order
                                </Button>
                                
                                <Button 
                                  asChild
                                  variant="outline" 
                                  className="w-full border-[#8f35e5] text-[#8f35e5] hover:bg-[#8f35e5] hover:text-white"
                                >
                                  <Link to={`/iptv-panel/${generateSlug(displayName)}`}>
                                    View Details
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Panel IPTV Packages Available</h3>
                <p className="text-gray-600">Panel IPTV packages are currently being updated. Please check back later.</p>
              </div>
            )}
          </section>

          <div className="text-center mt-16 space-y-4">
            <div className="bg-[#8f35e5]/5 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.needHelp}</h3>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                {t.fastActivationDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Checkout Form Modal */}
          {showCheckout && selectedPackage && (
            <PaymentOptionsCheckout
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
