
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Check, Zap } from 'lucide-react';
import ProductSubscriptionCard from '@/components/home/ProductSubscriptionCard';
import StoreLayout from '@/components/store/StoreLayout';
import CheckoutForm from '@/components/CheckoutForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';

const Subscription = () => {
  const { t } = useLanguage();
  const { data: packages, isLoading } = useIPTVPackages();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Filter only subscription packages
  const subscriptionPackages = packages?.filter(pkg => pkg.category === 'subscription' && pkg.status !== 'inactive') || [];

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
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                {t.subscriptionsTitle}
              </p>
              
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

        {/* Subscriptions Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {subscriptionPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {subscriptionPackages.map((pkg) => (
                <ProductSubscriptionCard
                  key={pkg.id}
                  package={pkg}
                  featured={pkg.status === 'featured'}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Subscription Packages Available</h3>
              <p className="text-gray-600">Subscription packages are currently being updated. Please check back later.</p>
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

export default Subscription;
