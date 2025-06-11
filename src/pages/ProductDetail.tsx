
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Check, Zap, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import StoreLayout from '@/components/store/StoreLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const ProductDetail = () => {
  const { productId } = useParams();
  const { t } = useLanguage();
  const [selectedDuration, setSelectedDuration] = useState(1);

  // Configuration des produits
  const products: Record<string, any> = {
    'strong-8k': {
      name: "STRONG 8K IPTV 🚀",
      basePrice: 12.99,
      features: [
        "8K Ultra HD Quality",
        "5000+ Live Channels",
        "Movies & Series VOD",
        "Anti-Freeze Technology",
        "24/7 Support"
      ],
      description: "Notre service premium avec la meilleure qualité 8K disponible."
    },
    'trex-8k': {
      name: "TREX 8K IPTV 🦖",
      basePrice: 10.99,
      features: [
        "8K/4K Streaming",
        "4000+ Channels",
        "Sports Packages",
        "Movie Collection",
        "Fast Servers"
      ],
      description: "Service performant avec une large sélection de contenus."
    },
    'promax-4k': {
      name: "PROMAX 4K IPTV ⚡",
      basePrice: 18.99,
      features: [
        "4K Premium Technology",
        "8000+ Channels",
        "4K Quality",
        "Global Content",
        "Premium Support"
      ],
      description: "Solution premium avec le plus large choix de chaînes."
    },
    'tivione-4k': {
      name: "TIVIONE 4K IPTV 📺",
      basePrice: 13.99,
      features: [
        "Full 4K Streaming",
        "6000+ Channels",
        "VOD Library",
        "Stable Connection",
        "Multi-Platform"
      ],
      description: "Service stable et fiable pour toute la famille."
    },
    'b1g-4k': {
      name: "B1G 4K IPTV 🎬",
      basePrice: 16.99,
      features: [
        "Big Entertainment",
        "9000+ Channels",
        "4K Resolution",
        "Sports & Movies",
        "24/7 Service"
      ],
      description: "Divertissement maximum avec une offre complète."
    }
  };

  const product = products[productId as string];

  if (!product) {
    return (
      <StoreLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <Button asChild>
            <Link to="/subscription">Retour aux abonnements</Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }

  const durations = [
    { months: 1, discount: 0, label: "1 Mois" },
    { months: 3, discount: 10, label: "3 Mois" },
    { months: 6, discount: 20, label: "6 Mois" },
    { months: 12, discount: 30, label: "12 Mois" }
  ];

  const selectedDurationData = durations.find(d => d.months === selectedDuration) || durations[0];
  const originalPrice = product.basePrice * selectedDuration;
  const discountAmount = originalPrice * (selectedDurationData.discount / 100);
  const finalPrice = originalPrice - discountAmount;

  const handlePurchase = () => {
    const message = `Bonjour, je souhaite acheter ${product.name} pour ${selectedDuration} mois. Prix: €${finalPrice.toFixed(2)}. Pouvez-vous m'aider?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <StoreLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="container py-12">
            <Link 
              to="/subscription" 
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200 group mb-6"
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Retour aux abonnements
            </Link>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
                <p className="text-xl text-white/90 mb-6">{product.description}</p>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Star className="text-yellow-300 mr-2" size={20} />
                    <span>Premium Quality</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="text-green-300 mr-2" size={20} />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="container py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Features */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Caractéristiques incluses</h2>
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

            {/* Pricing */}
            <div>
              <Card className="p-8 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Choisir la durée</h3>
                
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
                        €{product.basePrice}/mois
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span>Prix de base:</span>
                    <span>€{originalPrice.toFixed(2)}</span>
                  </div>
                  {selectedDurationData.discount > 0 && (
                    <div className="flex justify-between items-center mb-2 text-green-600">
                      <span>Remise ({selectedDurationData.discount}%):</span>
                      <span>-€{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xl font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-red-600">€{finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePurchase}
                  className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4"
                  size="lg"
                >
                  <MessageCircle className="mr-2" size={20} />
                  Acheter maintenant
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
