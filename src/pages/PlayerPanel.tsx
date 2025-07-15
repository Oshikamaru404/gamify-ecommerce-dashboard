import React, { useState } from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Monitor, Settings, BarChart3, Crown } from 'lucide-react';
import CheckoutForm from '@/components/CheckoutForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';
const PlayerPanel = () => {
  const {
    t
  } = useLanguage();
  const {
    data: packages,
    isLoading
  } = useIPTVPackages();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const handleContactWhatsApp = (packageName: string, credits: number, price: number) => {
    const message = `${t.contact}, ${packageName} - ${credits} credits for $${price}`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  const handleBuyNow = (packageName: string, credits: number, price: number) => {
    setSelectedPackage({
      id: `player-${packageName.toLowerCase().replace(/\s+/g, '-')}`,
      name: packageName,
      category: 'player-panel',
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

  // Filter player packages from database
  const playerPackages = packages?.filter(pkg => pkg.category === 'player' && pkg.status !== 'inactive') || [];
  if (isLoading) {
    return <StoreLayout>
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
          <div className="container py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading packages...</p>
            </div>
          </div>
        </div>
      </StoreLayout>;
  }
  return <StoreLayout>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
              Panel Player Credits
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
              Purchase credits for streaming applications and player activation
            </p>
            
            {/* Panel Player Credits Disclaimer */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
              <h3 className="text-lg font-bold text-purple-900 mb-3">Panel Player Credit System</h3>
              <div className="text-purple-800 space-y-1">
                <p className="font-medium">💡 Credit to Time Mapping:</p>
                <div className="text-sm space-y-1 mt-2">
                  <p>• 1 Credit = 12 Months</p>
                  
                  <p>• Purchase credits in bulk for better pricing</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Monitor className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Player Applications</h3>
              <p className="text-gray-600">Activate streaming apps and players with credit system</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Settings className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Easy Management</h3>
              <p className="text-gray-600">Simple credit-based activation system</p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <Crown className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Lifetime Options</h3>
              <p className="text-gray-600">2 credits = lifetime activation for supported apps</p>
            </Card>
          </div>

          <section className="space-y-16">
            {playerPackages.length > 0 ? playerPackages.map((pkg, index) => <div key={pkg.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 flex items-center justify-center">
                        {/* Priority: Use uploaded image URL first */}
                        {pkg.icon_url ? <img src={pkg.icon_url} alt={pkg.name} className="w-14 h-14 rounded-lg object-cover shadow-lg" onError={e => {
                    // If image fails to load, hide it and show fallback
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }} /> : null}
                        
                        {/* Fallback: Use emoji or default icon */}
                        <div className="w-14 h-14 rounded-lg bg-purple-400/30 flex items-center justify-center text-3xl backdrop-blur-sm" style={{
                    display: pkg.icon_url ? 'none' : 'flex'
                  }}>
                          {pkg.icon || '🎮'}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">{pkg.name}</h2>
                        <p className="text-purple-100 text-lg">{pkg.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Available Credit Options</h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {[{
                  credits: 10,
                  price: pkg.price_10_credits
                }, {
                  credits: 25,
                  price: pkg.price_25_credits
                }, {
                  credits: 50,
                  price: pkg.price_50_credits
                }, {
                  credits: 100,
                  price: pkg.price_100_credits
                }].filter(option => option.price).map((option, idx) => <Card key={idx} className="p-6 border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">{option.credits}</div>
                            <div className="text-sm text-gray-600 mb-2">Credits</div>
                            
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                              <div className="text-sm font-medium text-purple-900 mb-1">
                                {option.credits} Credits Available
                              </div>
                              <div className="text-xs text-purple-700">
                                1 Credit = 12 Months | 2 Credits = Lifetime
                              </div>
                            </div>
                            
                            <div className="text-2xl font-bold text-gray-900 mb-4">${option.price}</div>
                            <div className="text-sm text-gray-500 mb-6">
                              ${(option.price! / option.credits).toFixed(1)} per credit
                            </div>
                            <div className="space-y-2">
                              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" onClick={() => handleBuyNow(pkg.name, option.credits, option.price!)}>
                                Quick Order
                              </Button>
                              <Button variant="outline" className="w-full" onClick={() => handleContactWhatsApp(pkg.name, option.credits, option.price!)}>
                                
                                WhatsApp
                              </Button>
                            </div>
                          </div>
                        </Card>)}
                    </div>
                  </div>
                </div>) : <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Player Packages Available</h3>
                <p className="text-gray-600">Player packages are currently being updated. Please check back later.</p>
              </div>}
          </section>

          <div className="text-center mt-16 space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-2xl mx-auto mb-4">
              <p className="text-purple-800 font-medium">
                💡 Remember: 1 credit = 12 months, 2 credits = lifetime activation
              </p>
            </div>
            
            <div className="bg-red-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Contact our support team for assistance with credit purchases and app activation.
              </p>
            </div>
          </div>
        </div>

        {/* Checkout Form Modal */}
        {showCheckout && selectedPackage && <CheckoutForm packageData={selectedPackage} onClose={handleCloseCheckout} onSuccess={handleOrderSuccess} />}
      </div>
    </StoreLayout>;
};
export default PlayerPanel;