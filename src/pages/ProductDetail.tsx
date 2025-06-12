
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Check, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import StoreLayout from '@/components/store/StoreLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';

const ProductDetail = () => {
  const { productId } = useParams();
  const { t } = useLanguage();
  const [selectedDuration, setSelectedDuration] = useState(1);
  const { data: packages, isLoading } = useIPTVPackages();

  console.log('ProductDetail - productId:', productId);
  console.log('ProductDetail - packages:', packages);

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="container py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </StoreLayout>
    );
  }

  // Find the package by matching the productId with the package name (converted to slug format)
  const product = packages?.find(pkg => {
    const slug = pkg.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .trim();
    return slug === productId;
  });

  console.log('ProductDetail - product found:', product);

  if (!product) {
    return (
      <StoreLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">Product ID: {productId}</p>
          <Button asChild>
            <Link to="/subscription">Back to Subscriptions</Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }

  // Define default pricing based on category
  const getDefaultPrice = (category: string) => {
    switch (category) {
      case 'subscription':
        return 12.99; // Default monthly subscription price
      case 'activation-player':
        return 49.99; // Default activation price per month
      case 'player':
        return 19.99; // Default player price
      default:
        return 9.99; // General default
    }
  };

  // Define month options with pricing, providing fallbacks if database values are missing
  const durations = [
    {
      months: 1,
      price: product.price_1_month || getDefaultPrice(product.category),
      label: '1 Month',
      discount: 0
    },
    {
      months: 3,
      price: product.price_3_months || (product.price_1_month || getDefaultPrice(product.category)) * 3 * 0.9, // 10% discount if not set
      label: '3 Months',
      discount: product.price_1_month && product.price_3_months 
        ? Math.round((1 - (product.price_3_months / (product.price_1_month * 3))) * 100)
        : 10
    },
    {
      months: 6,
      price: product.price_6_months || (product.price_1_month || getDefaultPrice(product.category)) * 6 * 0.85, // 15% discount if not set
      label: '6 Months',
      discount: product.price_1_month && product.price_6_months 
        ? Math.round((1 - (product.price_6_months / (product.price_1_month * 6))) * 100)
        : 15
    },
    {
      months: 12,
      price: product.price_12_months || (product.price_1_month || getDefaultPrice(product.category)) * 12 * 0.75, // 25% discount if not set
      label: '12 Months',
      discount: product.price_1_month && product.price_12_months 
        ? Math.round((1 - (product.price_12_months / (product.price_1_month * 12))) * 100)
        : 25
    }
  ];

  // Show all 4 duration options for all categories including activation-player
  const availableDurations = durations;

  const selectedDurationData = availableDurations.find(d => d.months === selectedDuration) || availableDurations[0];

  const handlePurchase = () => {
    const message = `Hello, I'm interested in ${product.name} - ${selectedDuration} Month(s) - $${selectedDurationData.price?.toFixed(2)}`;
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
              Back to Subscriptions
            </Link>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
                <p className="text-xl text-white/90 mb-6">
                  {product.description || `Premium ${product.category} service with advanced features`}
                </p>
                
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

        <div className="container py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Features</h2>
                <div className="grid gap-4">
                  {product.features && product.features.length > 0 ? (
                    product.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="text-green-600" size={20} />
                        <span className="text-lg">{feature}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-3">
                      <Check className="text-green-600" size={20} />
                      <span className="text-lg">Premium {product.category} features included</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-8 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Choose Your Plan</h3>
                
                <div className="space-y-3 mb-6">
                  {availableDurations.map((duration) => (
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
                        ${duration.price?.toFixed(2)} total
                      </div>
                      {duration.months > 1 && (
                        <div className="text-xs text-gray-500 mt-1">
                          ${(duration.price! / duration.months).toFixed(2)}/month
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-red-600">${selectedDurationData.price?.toFixed(2)}</span>
                  </div>
                  {selectedDurationData.discount > 0 && (
                    <div className="text-sm text-green-600 mt-1">
                      Save {selectedDurationData.discount}% compared to monthly
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handlePurchase}
                  className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4"
                  size="lg"
                >
                  <MessageCircle className="mr-2" size={20} />
                  Buy Now
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
