
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Check, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import StoreLayout from '@/components/store/StoreLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const ProductDetail = () => {
  const { productId } = useParams();
  const { t } = useLanguage();
  const [selectedDuration, setSelectedDuration] = useState(1);

  const products: Record<string, any> = {
    'strong-8k': {
      name: "STRONG 8K IPTV 🚀",
      basePrice: 12.99,
      features: [
        t.ultraHd4k,
        t.premiumQuality,
        t.support247,
        t.fastActivation,
        t.instantActivation
      ],
      description: t.premiumQualityDesc
    },
    'trex-8k': {
      name: "TREX 8K IPTV 🦖",
      basePrice: 10.99,
      features: [
        t.ultraHd4k,
        t.premiumQuality,
        t.support247,
        t.fastActivation,
        t.guaranteedReliability
      ],
      description: t.guaranteedReliabilityDesc
    },
    'promax-4k': {
      name: "PROMAX 4K IPTV ⚡",
      basePrice: 18.99,
      features: [
        t.ultraHd4k,
        t.premiumQuality,
        t.support247,
        t.fastActivation,
        t.instantActivation
      ],
      description: t.fastActivationDesc
    },
    'tivione-4k': {
      name: "TIVIONE 4K IPTV 📺",
      basePrice: 13.99,
      features: [
        t.ultraHd4k,
        t.premiumQuality,
        t.support247,
        t.fastActivation,
        t.guaranteedReliability
      ],
      description: t.premiumQualityDesc
    },
    'b1g-4k': {
      name: "B1G 4K IPTV 🎬",
      basePrice: 16.99,
      features: [
        t.ultraHd4k,
        t.premiumQuality,
        t.support247,
        t.fastActivation,
        t.instantActivation
      ],
      description: t.guaranteedReliabilityDesc
    }
  };

  const product = products[productId as string];

  if (!product) {
    return (
      <StoreLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.noSubscriptionsAvailable}</h1>
          <Button asChild>
            <Link to="/subscription">{t.backToHome}</Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }

  const durations = [
    { months: 1, discount: 0, label: `1 ${t.perMonth.replace('/', '')}` },
    { months: 3, discount: 10, label: `3 ${t.perMonth.replace('/', '')}` },
    { months: 6, discount: 20, label: `6 ${t.perMonth.replace('/', '')}` },
    { months: 12, discount: 30, label: `12 ${t.perMonth.replace('/', '')}` }
  ];

  const selectedDurationData = durations.find(d => d.months === selectedDuration) || durations[0];
  const originalPrice = product.basePrice * selectedDuration;
  const discountAmount = originalPrice * (selectedDurationData.discount / 100);
  const finalPrice = originalPrice - discountAmount;

  const handlePurchase = () => {
    const message = `${t.contact} ${product.name} - ${selectedDuration} ${t.perMonth.replace('/', '')} - ${t.currency}${finalPrice.toFixed(2)}`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <StoreLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="container py-12">
            <Link 
              to="/subscription" 
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200 group mb-6"
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
              {t.backToHome}
            </Link>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
                <p className="text-xl text-white/90 mb-6">{product.description}</p>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Star className="text-yellow-300 mr-2" size={20} />
                    <span>{t.premiumQuality}</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="text-green-300 mr-2" size={20} />
                    <span>{t.support247}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.productFeatures}</h2>
                <div className="grid gap-4">
                  {product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="text-green-600" size={20} />
                      <span className="text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-8 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t.pricing}</h3>
                
                <div className="space-y-3 mb-6">
                  {durations.map((duration) => (
                    <button
                      key={duration.months}
                      onClick={() => setSelectedDuration(duration.months)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedDuration === duration.months
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{duration.label}</span>
                        {duration.discount > 0 && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                            -{duration.discount}%
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {t.currency}{product.basePrice}{t.perMonth}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span>{t.pricing}:</span>
                    <span>{t.currency}{originalPrice.toFixed(2)}</span>
                  </div>
                  {selectedDurationData.discount > 0 && (
                    <div className="flex justify-between items-center mb-2 text-green-600">
                      <span>{t.pricing} ({selectedDurationData.discount}%):</span>
                      <span>-{t.currency}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xl font-bold border-t pt-2">
                    <span>{t.pricing}:</span>
                    <span className="text-red-600">{t.currency}{finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePurchase}
                  className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4"
                  size="lg"
                >
                  <MessageCircle className="mr-2" size={20} />
                  {t.buyNow}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default ProductDetail;
