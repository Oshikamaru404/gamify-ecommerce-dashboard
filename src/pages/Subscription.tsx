
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductSubscriptionCard from '@/components/home/ProductSubscriptionCard';
import { contentService } from '@/lib/contentService';
import { SubscriptionContent } from '@/lib/contentTypes';
import { useLanguage } from '@/contexts/LanguageContext';

const Subscription = () => {
  const { t } = useLanguage();
  const [subscriptions, setSubscriptions] = useState<SubscriptionContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscriptions = () => {
      try {
        const content = contentService.getContent();
        // Filtrer seulement les abonnements actifs
        const activeSubscriptions = content.subscriptions.filter(sub => sub.enabled);
        setSubscriptions(activeSubscriptions);
      } catch (error) {
        console.error('Error loading subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t.loadingSubscriptions}</p>
        </div>
      </div>
    );
  }

  return (
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
              {t.ourSubscriptions.split(' ')[0]} <span className="text-yellow-300">{t.ourSubscriptions.split(' ')[1]}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Choisissez l'abonnement qui vous convient le mieux pour profiter de milliers de chaînes en haute qualité
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
        {subscriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="w-full max-w-sm">
                <ProductSubscriptionCard
                  name={subscription.name}
                  price={subscription.price}
                  features={subscription.features}
                  bgColor={subscription.bgColor}
                  accentColor={subscription.accentColor}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t.noSubscriptionsAvailable}
            </h2>
            <p className="text-gray-600 mb-8">
              {t.noSubscriptionsMessage}
            </p>
            <Button asChild>
              <Link to="/">
                {t.backToHome}
              </Link>
            </Button>
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
    </div>
  );
};

export default Subscription;
