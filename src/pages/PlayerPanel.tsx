
import React, { useState, useEffect } from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  // Filter only player packages
  const playerPackages = packages?.filter(pkg => pkg.category === 'player' && pkg.status !== 'inactive') || [];

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .trim();
  };

  // Player-specific credit-to-month mapping
  const getPlayerCreditMapping = (credits: number) => {
    switch (credits) {
      case 1: return '12 Months';
      case 2: return 'Lifetime';
      default: return `${credits} Credits`;
    }
  };

  const handleQuickCheckout = (player: any, credits: number, price: number) => {
    setSelectedPackage({
      id: player.id,
      name: `${player.name} - ${credits} Credits`,
      category: player.category,
      price: price,
      duration: credits // Credits represent months
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
              <p className="mt-4 text-lg text-gray-600">Loading player packages...</p>
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
              {t.playerPanelTitle}
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
              {t.playerPanelSubtitle}
            </p>
            
            {/* Player Credits Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Player Credit System</h3>
              <div className="text-blue-800 space-y-1">
                <p className="font-medium">💡 Special Player Credit Options:</p>
                <div className="text-sm space-y-1 mt-2">
                  <p>• 1 Credit = 12 Months</p>
                  <p>• 2 Credits = Lifetime</p>
                  <p className="text-xs text-blue-600 mt-2">Base Price: $30</p>
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
            {playerPackages.map((player, index) => {
              const productSlug = generateSlug(player.name);
              
              return (
                <div key={player.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{player.icon || '📱'}</div>
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

                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t.manageSubscriptions}</h3>
                    
                    {/* Only show 1 Credit and 2 Credits options */}
                    <div className="grid gap-6 md:grid-cols-2 mb-8">
                      {[
                        { credits: 1, price: player.price_10_credits ? 30 : null }, // 1 Credit = 12 Months
                        { credits: 2, price: player.price_25_credits ? 60 : null }, // 2 Credits = Lifetime
                      ].filter(option => option.price).map((option, idx) => (
                        <Card key={idx} className="p-6 border-2 border-gray-100 text-center">
                          <div className="text-3xl font-bold text-red-600 mb-2">{option.credits}</div>
                          <div className="text-sm text-gray-600 mb-2">Credit{option.credits > 1 ? 's' : ''}</div>
                          
                          {/* Player Credit-Duration Mapping */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                            <div className="text-sm font-medium text-green-900 mb-1">
                              {option.credits} Credit{option.credits > 1 ? 's' : ''} = {getPlayerCreditMapping(option.credits)}
                            </div>
                            <div className="text-xs text-green-700">
                              Player Special System
                            </div>
                          </div>
                          
                          <div className="text-2xl font-bold text-gray-900 mb-4">${option.price}</div>
                          <div className="text-sm text-gray-500 mb-4">
                            ${(option.price! / option.credits).toFixed(0)} per credit
                          </div>
                          <Button 
                            onClick={() => handleQuickCheckout(player, option.credits, option.price!)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Quick Buy
                          </Button>
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

          {playerPackages.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Player Packages Available</h3>
              <p className="text-gray-600">Player packages are currently being updated. Please check back later.</p>
            </div>
          )}

          <div className="text-center mt-16 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto mb-4">
              <p className="text-blue-800 font-medium">
                💡 Player System: 1 Credit = 12 Months | 2 Credits = Lifetime
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
