
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Crown, Monitor, Settings, Shield, Star } from 'lucide-react';
import CheckoutForm from '@/components/CheckoutForm';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';

const PlayerDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: packages, isLoading } = useIPTVPackages();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Generate slug from package name to match with URL
  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .trim();
  };

  // Find the package by slug
  const playerPackages = packages?.filter(pkg => pkg.category === 'player' && pkg.status !== 'inactive') || [];
  const pkg = playerPackages.find(p => generateSlug(p.name) === slug);

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

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
          <div className="container py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8f35e5] mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading package details...</p>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (!pkg) {
    return (
      <StoreLayout>
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
          <div className="container py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Package Not Found</h1>
              <p className="text-gray-600 mb-8">The player package you're looking for doesn't exist.</p>
              <Button onClick={() => navigate('/player-panel')} className="bg-[#8f35e5] hover:bg-[#7c2fd4]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Player Panel
              </Button>
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
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/player-panel')}
            className="mb-8 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Player Panel
          </Button>

          {/* Package Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-[#8f35e5] to-[#7c2fd4] text-white p-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 flex items-center justify-center">
                  {pkg.icon_url ? (
                    <img 
                      src={pkg.icon_url} 
                      alt={pkg.name} 
                      className="w-20 h-20 rounded-xl object-cover shadow-lg" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  <div 
                    className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center text-4xl backdrop-blur-sm" 
                    style={{ display: pkg.icon_url ? 'none' : 'flex' }}
                  >
                    {pkg.icon || '🎮'}
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{pkg.name}</h1>
                  <p className="text-purple-100 text-xl">{pkg.description}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <Badge className="bg-white/20 text-white">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      Premium Player
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Package Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Features */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Monitor className="mr-3 h-6 w-6 text-[#8f35e5]" />
                  Package Features
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#8f35e5]/10 rounded-full flex items-center justify-center mt-1 mr-3">
                      <Check className="w-4 h-4 text-[#8f35e5]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Credit-Based System</h3>
                      <p className="text-gray-600 text-sm">Flexible credit system for player activation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#8f35e5]/10 rounded-full flex items-center justify-center mt-1 mr-3">
                      <Check className="w-4 h-4 text-[#8f35e5]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Multiple Duration Options</h3>
                      <p className="text-gray-600 text-sm">Choose from 12 months or lifetime activation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#8f35e5]/10 rounded-full flex items-center justify-center mt-1 mr-3">
                      <Check className="w-4 h-4 text-[#8f35e5]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Instant Activation</h3>
                      <p className="text-gray-600 text-sm">Quick activation process for all supported apps</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#8f35e5]/10 rounded-full flex items-center justify-center mt-1 mr-3">
                      <Check className="w-4 h-4 text-[#8f35e5]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                      <p className="text-gray-600 text-sm">Round-the-clock customer support</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Credit Information */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Crown className="mr-3 h-6 w-6 text-[#8f35e5]" />
                  Credit System Explained
                </h2>
                <div className="space-y-4">
                  <div className="bg-[#8f35e5]/5 border border-[#8f35e5]/20 rounded-lg p-4">
                    <h3 className="font-semibold text-[#8f35e5] mb-2">1 Credit = 12 Months Activation</h3>
                    <p className="text-gray-700">Perfect for annual subscriptions to your favorite streaming apps.</p>
                  </div>
                  <div className="bg-[#8f35e5]/5 border border-[#8f35e5]/20 rounded-lg p-4">
                    <h3 className="font-semibold text-[#8f35e5] mb-2">2 Credits = Lifetime Activation</h3>
                    <p className="text-gray-700">One-time purchase for permanent access to supported applications.</p>
                  </div>
                </div>
              </Card>

              {/* Money Back Guarantee */}
              <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-green-600 mr-4" />
                  <div>
                    <h3 className="text-xl font-bold text-green-800">30-Day Money Back Guarantee</h3>
                    <p className="text-green-700">Not satisfied? Get your money back within 30 days, no questions asked.</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Pricing */}
            <div className="space-y-6">
              <Card className="p-6 sticky top-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Credits</h2>
                <div className="space-y-4">
                  {[
                    { credits: 10, price: pkg.price_10_credits },
                    { credits: 25, price: pkg.price_25_credits },
                    { credits: 50, price: pkg.price_50_credits },
                    { credits: 100, price: pkg.price_100_credits }
                  ].filter(option => option.price).map((option, idx) => (
                    <Card key={idx} className="p-4 border-2 border-gray-100 hover:border-[#8f35e5]/30 transition-all duration-300">
                      <div className="text-center">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="border-[#8f35e5] text-[#8f35e5]">
                            {option.credits} Credits
                          </Badge>
                          <span className="text-2xl font-bold text-gray-900">${option.price}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          {option.credits === 2 ? 'Lifetime activation' : `${option.credits * 12} months total`}
                        </div>
                        <Button 
                          className="w-full bg-gradient-to-r from-[#8f35e5] to-[#7c2fd4] hover:from-[#7c2fd4] hover:to-[#6b27be] text-white"
                          onClick={() => handleBuyNow(pkg.name, option.credits, option.price!)}
                        >
                          Purchase {option.credits} Credits
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
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

export default PlayerDetail;
