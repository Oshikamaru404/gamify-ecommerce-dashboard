
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Check, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Subscription = () => {
  const { t } = useLanguage();

  const subscriptionProducts = [
    {
      id: "strong-8k",
      name: "STRONG 8K IPTV 🚀",
      price: 12.99,
      features: [
        "8K Ultra HD Quality",
        "5000+ Live Channels",
        "Movies & Series VOD",
        "Anti-Freeze Technology",
        "24/7 Support"
      ]
    },
    {
      id: "trex-8k",
      name: "TREX 8K IPTV 🦖",
      price: 10.99,
      features: [
        "8K/4K Streaming",
        "4000+ Channels",
        "Sports Packages",
        "Movie Collection",
        "Fast Servers"
      ]
    },
    {
      id: "promax-4k",
      name: "PROMAX 4K IPTV ⚡",
      price: 18.99,
      features: [
        "4K Premium Technology",
        "8000+ Channels",
        "4K Quality",
        "Global Content",
        "Premium Support"
      ]
    },
    {
      id: "tivione-4k",
      name: "TIVIONE 4K IPTV 📺",
      price: 13.99,
      features: [
        "Full 4K Streaming",
        "6000+ Channels",
        "VOD Library",
        "Stable Connection",
        "Multi-Platform"
      ]
    },
    {
      id: "b1g-4k",
      name: "B1G 4K IPTV 🎬",
      price: 16.99,
      features: [
        "Big Entertainment",
        "9000+ Channels",
        "4K Resolution",
        "Sports & Movies",
        "24/7 Service"
      ]
    }
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {subscriptionProducts.map((product) => (
            <Card key={product.id} className="w-full max-w-sm p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white border-2 border-gray-100 hover:border-red-200">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{product.name}</h3>
                <div className="text-4xl font-bold text-red-600 mb-2">€{product.price}</div>
                <div className="text-gray-600">par mois</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button asChild className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                <Link to={`/product/${product.id}`} className="flex items-center justify-center gap-2">
                  Voir les options
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </Card>
          ))}
        </div>
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
