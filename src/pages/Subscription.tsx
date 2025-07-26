
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Star, Check, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductSubscriptionCard from '@/components/home/ProductSubscriptionCard';
import PlanSelector from '@/components/PlanSelector';
import StoreLayout from '@/components/store/StoreLayout';
import CheckoutForm from '@/components/CheckoutForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubscriptionPackages } from '@/hooks/useSubscriptionPackages';

const Subscription = () => {
  const { t } = useLanguage();
  const { data: packages, isLoading } = useSubscriptionPackages();
  const [searchParams] = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Filter only active subscription packages
  const subscriptionPackages = packages?.filter(pkg => pkg.status !== 'inactive') || [];

  // Check if a specific package is requested via URL params
  useEffect(() => {
    const packageParam = searchParams.get('package');
    if (packageParam && subscriptionPackages.length > 0) {
      const targetPackage = subscriptionPackages.find(pkg => 
        pkg.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') === packageParam
      );
      if (targetPackage) {
        setSelectedPackage(targetPackage);
      }
    }
  }, [searchParams, subscriptionPackages]);

  const handlePackageSelect = (pkg: any) => {
    setSelectedPackage(pkg);
    setSelectedPlan(null);
  };

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setSelectedPlan(null);
  };

  const handleOrderSuccess = () => {
    console.log('Order submitted successfully');
    setShowCheckout(false);
    setSelectedPlan(null);
    setSelectedPackage(null);
  };

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading subscription packages...</p>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center mb-8">
              <Link 
                to="/" 
                className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200 group"
              >
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
                {t.backToHome}
              </Link>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t.ourSubscriptions}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                {t.subscriptionsTitle}
              </p>
              
              {/* Enhanced 30-Day Money Back Guarantee Badge */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-3 bg-white backdrop-blur-sm border-2 border-red-500 rounded-full px-8 py-4 shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Shield className="h-7 w-7 text-red-500" />
                  <span className="text-red-600 font-bold text-xl">30-Day Money Back Guarantee</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center mt-8 space-x-8">
                <div className="flex items-center">
                  <Star className="text-yellow-300 mr-2" size={24} />
                  <span className="text-lg">{t.ultraHd4k}</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-300 mr-2" size={24} />
                  <span className="text-lg">{t.support247}</span>
                </div>
                <div className="flex items-center">
                  <Zap className="text-blue-300 mr-2" size={24} />
                  <span className="text-lg">{t.instantActivation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 30-Day Warranty Section */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="p-8 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-blue-900">30-Day Service Warranty</h2>
                </div>
                <p className="text-lg text-blue-800 leading-relaxed">
                  We stand behind our service quality. All subscription packages include a comprehensive 30-day warranty. 
                  If you experience any technical issues or are not satisfied with our service during this period, 
                  contact our support team for immediate resolution or receive a full refund - no questions asked.
                </p>
                <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-blue-800">Full refund guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-blue-800">24/7 technical support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-blue-800">No questions asked policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {!selectedPackage ? (
            // Package Selection
            subscriptionPackages.length > 0 ? (
              <div>
                <h2 className="text-3xl font-bold text-center mb-12">Select Your Package</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {subscriptionPackages.map((pkg) => (
                    <div 
                      key={pkg.id}
                      onClick={() => handlePackageSelect(pkg)}
                      className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                    >
                      <ProductSubscriptionCard
                        package={{
                          id: pkg.id,
                          name: pkg.name,
                          category: 'subscription' as const,
                          description: pkg.description,
                          icon: pkg.icon,
                          icon_url: pkg.icon_url,
                          features: pkg.features,
                          price_1_month: pkg.price_3_credits,
                          price_3_months: pkg.price_6_credits,
                          price_6_months: null,
                          price_12_months: pkg.price_12_credits,
                          price_10_credits: null,
                          price_25_credits: null,
                          price_50_credits: null,
                          price_100_credits: null,
                          status: (pkg.status as "active" | "inactive" | "featured") || 'active',
                          sort_order: pkg.sort_order,
                          created_at: pkg.created_at,
                          updated_at: pkg.updated_at,
                        }}
                        featured={pkg.status === 'featured'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Subscription Packages Available</h3>
                <p className="text-gray-600">Subscription packages are currently being updated. Please check back later.</p>
              </div>
            )
          ) : (
            // Plan Selection
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPackage(null)}
                  className="mb-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Packages
                </Button>
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">{selectedPackage.name}</h2>
                  <p className="text-gray-600 mb-6">{selectedPackage.description}</p>
                </div>
              </div>

              <PlanSelector
                packageId={selectedPackage.id}
                packageName={selectedPackage.name}
                packageData={selectedPackage}
                onPlanSelect={handlePlanSelect}
              />
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t.whyChooseTitle}
              </h2>
              <p className="text-xl text-gray-600">
                {t.whyChooseSubtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.premiumQuality}</h3>
                <p className="text-gray-600">
                  {t.premiumQualityDesc}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.guaranteedReliability}</h3>
                <p className="text-gray-600">
                  {t.guaranteedReliabilityDesc}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.fastActivation}</h3>
                <p className="text-gray-600">
                  {t.fastActivationDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form Modal */}
        {showCheckout && selectedPlan && (
          <CheckoutForm
            packageData={{ ...selectedPlan, icon_url: selectedPackage?.icon_url, icon: selectedPackage?.icon }}
            onClose={handleCloseCheckout}
            onSuccess={handleOrderSuccess}
          />
        )}
      </div>
    </StoreLayout>
  );
};

export default Subscription;
