
import React, { useState, useEffect } from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Palette, Zap, CheckCircle2, ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';
import CheckoutForm from '@/components/CheckoutForm';

const PlayerPanel = () => {
  const { t } = useLanguage();
  const { data: packages, isLoading } = useIPTVPackages();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter only panel player packages
  const panelPlayerPackages = packages?.filter(pkg => pkg.category === 'player' && pkg.status !== 'inactive') || [];

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .trim();
  };

  // Panel Player credit-to-duration mapping
  const getPanelPlayerCreditMapping = (credits: number) => {
    switch (credits) {
      case 10: return '10 Credits = 120 Months';
      case 25: return '25 Credits = 300 Months';
      case 50: return '50 Credits = 600 Months';
      case 100: return '100 Credits = 1200 Months';
      default: return `${credits} Credits`;
    }
  };

  const handleQuickCheckout = (player: any, credits: number, price: number) => {
    setSelectedPackage({
      id: player.id,
      name: `${player.name} - ${credits} Credits`,
      category: player.category,
      price: price,
      duration: credits // Credits represent duration
    });
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setIsCheckoutOpen(false);
    setSelectedPackage(null);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedPackage(null);
  };

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
          <div className="container py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading panel player packages...</p>
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
              Panel Player Packages
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
              Professional panel player solutions with advanced credit management system
            </p>
            
            {/* Panel Player Credits Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Panel Player Credit System</h3>
              <div className="text-blue-800 space-y-1">
                <p className="font-medium">💡 Panel Player Special System:</p>
                <div className="text-sm space-y-1 mt-2">
                  <p>• 1 Credit = 12 Months</p>
                  <p>• 2 Credits = Lifetime Activation</p>
                  <p>• Advanced panel management features</p>
                  <p className="text-xs text-blue-600 mt-2">Professional-grade activation system</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Play className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.premiumQuality}</h3>
              <p className="text-gray-600">{t.premiumQualityDesc}</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Palette className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.fastActivation}</h3>
              <p className="text-gray-600">{t.fastActivationDesc}</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Zap className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{t.instantActivation}</h3>
              <p className="text-gray-600">{t.fastActivationDesc}</p>
            </Card>
          </div>

          <section className="space-y-16">
            {panelPlayerPackages.map((player, index) => {
              const productSlug = generateSlug(player.name);
              
              return (
                <div key={player.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl w-16 h-16 flex items-center justify-center">{player.icon || '📱'}</div>
                      <div>
                        <h2 className="text-3xl font-bold">{player.name}</h2>
                        <p className="text-red-100 text-lg">{player.description || t.premiumQualityDesc}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="mb-8">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Features:</h4>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {(player.features || [t.premiumQuality, t.ultraHd4k, t.fastActivation, t.instantActivation, t.support247]).map((feature, idx) => (
                          <li 
                            key={idx} 
                            className="flex items-start gap-3 text-gray-700"
                          >
                            <CheckCircle2 
                              size={20} 
                              className="mt-0.5 text-red-600" 
                            />
                            <span className="text-base">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Panel Player Credit Options</h3>
                    
                    {/* Show all 4 credit options */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                      {[
                        { credits: 10, price: player.price_10_credits },
                        { credits: 25, price: player.price_25_credits },
                        { credits: 50, price: player.price_50_credits },
                        { credits: 100, price: player.price_100_credits },
                      ].filter(option => option.price).map((option, idx) => (
                        <Card key={idx} className="p-6 border-2 border-gray-100 hover:border-red-200 transition-all duration-300 hover:shadow-lg">
                          <div className="text-center">
                            {/* Panel Player Badge */}
                            <Badge variant="red" className="mb-4 text-xs">
                              Panel Player System
                            </Badge>
                            
                            <div className="text-3xl font-bold text-red-600 mb-2">{option.credits}</div>
                            <div className="text-sm text-gray-600 mb-2">Credits</div>
                            
                            {/* Panel Player Credit-Duration Mapping */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                              <div className="text-sm font-medium text-blue-900 mb-1">
                                {getPanelPlayerCreditMapping(option.credits)}
                              </div>
                              <div className="text-xs text-blue-700">
                                1 Credit = 12 Months
                              </div>
                            </div>
                            
                            <div className="text-2xl font-bold text-gray-900 mb-4">${option.price}</div>
                            
                            <Button 
                              onClick={() => handleQuickCheckout(player, option.credits, option.price!)}
                              className="w-full bg-red-600 hover:bg-red-700 text-white"
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Quick Buy
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <div className="text-center">
                      <Button asChild className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 text-lg">
                        <Link to={`/product/${productSlug}`}>
                          View Details & More Options
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {panelPlayerPackages.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Panel Player Packages Available</h3>
              <p className="text-gray-600">Panel Player packages are currently being updated. Please check back later.</p>
            </div>
          )}

          <div className="text-center mt-16 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto mb-4">
              <p className="text-blue-800 font-medium">
                💡 Panel Player System: 1 Credit = 12 Months | 2 Credits = Lifetime Activation
              </p>
            </div>
            
            <div className="bg-red-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.needHelp}</h3>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                {t.fastActivationDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && selectedPackage && (
        <CheckoutForm
          packageData={selectedPackage}
          onClose={handleCloseCheckout}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </StoreLayout>
  );
};

export default PlayerPanel;
