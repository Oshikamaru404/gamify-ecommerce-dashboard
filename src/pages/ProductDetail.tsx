
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import StoreLayout from '@/components/store/StoreLayout';
import CheckoutForm from '@/components/CheckoutForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';

const ProductDetail = () => {
  const { productId } = useParams();
  const { t } = useLanguage();
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
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
    console.log('ProductDetail - comparing slug:', slug, 'with productId:', productId);
    return slug === productId;
  });

  console.log('ProductDetail - product found:', product);

  if (!product) {
    return (
      <StoreLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">Product ID: {productId}</p>
          <p className="text-gray-600 mb-4">Available packages: {packages?.map(p => p.name).join(', ')}</p>
          <Button asChild>
            <Link to="/subscription">Back to Subscriptions</Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }

  // Detailed logging for pricing data debugging
  console.log('ProductDetail - detailed pricing analysis:', {
    price_1_month: {
      value: product.price_1_month,
      type: typeof product.price_1_month,
      isNull: product.price_1_month === null,
      isUndefined: product.price_1_month === undefined,
      truthyCheck: !!product.price_1_month
    },
    price_3_months: {
      value: product.price_3_months,
      type: typeof product.price_3_months,
      isNull: product.price_3_months === null,
      isUndefined: product.price_3_months === undefined,
      truthyCheck: !!product.price_3_months
    },
    price_6_months: {
      value: product.price_6_months,
      type: typeof product.price_6_months,
      isNull: product.price_6_months === null,
      isUndefined: product.price_6_months === undefined,
      truthyCheck: !!product.price_6_months
    },
    price_12_months: {
      value: product.price_12_months,
      type: typeof product.price_12_months,
      isNull: product.price_12_months === null,
      isUndefined: product.price_12_months === undefined,
      truthyCheck: !!product.price_12_months
    }
  });

  // Build duration options based on available pricing in the database
  const durations = [];
  
  // Only add duration options if the pricing exists in the database and is greater than 0
  if (product.price_1_month !== null && product.price_1_month !== undefined && product.price_1_month > 0) {
    console.log('Adding 1 month duration:', product.price_1_month);
    durations.push({
      months: 1,
      price: product.price_1_month,
      label: '1 Month',
      discount: 0
    });
  }
  
  if (product.price_3_months !== null && product.price_3_months !== undefined && product.price_3_months > 0) {
    console.log('Adding 3 months duration:', product.price_3_months);
    const monthlyEquivalent = product.price_1_month ? product.price_1_month * 3 : 0;
    durations.push({
      months: 3,
      price: product.price_3_months,
      label: '3 Months',
      discount: monthlyEquivalent > 0 
        ? Math.round((1 - (product.price_3_months / monthlyEquivalent)) * 100)
        : 0
    });
  }
  
  if (product.price_6_months !== null && product.price_6_months !== undefined && product.price_6_months > 0) {
    console.log('Adding 6 months duration:', product.price_6_months);
    const monthlyEquivalent = product.price_1_month ? product.price_1_month * 6 : 0;
    durations.push({
      months: 6,
      price: product.price_6_months,
      label: '6 Months',
      discount: monthlyEquivalent > 0 
        ? Math.round((1 - (product.price_6_months / monthlyEquivalent)) * 100)
        : 0
    });
  }
  
  if (product.price_12_months !== null && product.price_12_months !== undefined && product.price_12_months > 0) {
    console.log('Adding 12 months duration:', product.price_12_months);
    const monthlyEquivalent = product.price_1_month ? product.price_1_month * 12 : 0;
    durations.push({
      months: 12,
      price: product.price_12_months,
      label: '12 Months',
      discount: monthlyEquivalent > 0 
        ? Math.round((1 - (product.price_12_months / monthlyEquivalent)) * 100)
        : 0
    });
  }

  console.log('ProductDetail - durations built:', durations);
  console.log('ProductDetail - total durations found:', durations.length);

  // If no pricing is available in the database, show a message
  if (durations.length === 0) {
    return (
      <StoreLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pricing Not Available</h1>
          <p className="text-gray-600 mb-4">Pricing for this package is not yet configured in the admin dashboard.</p>
          <p className="text-gray-600 mb-4">Product: {product.name}</p>
          <p className="text-gray-600 mb-4">Category: {product.category}</p>
          <p className="text-gray-600 mb-4">Debug - Available pricing fields:</p>
          <pre className="text-xs text-left bg-gray-100 p-4 rounded mb-4">
            {JSON.stringify({
              price_1_month: product.price_1_month,
              price_3_months: product.price_3_months,
              price_6_months: product.price_6_months,
              price_12_months: product.price_12_months,
            }, null, 2)}
          </pre>
          <Button asChild>
            <Link to="/activation">Back to Activation</Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }

  // Set the default selected duration to the first available option
  const validSelectedDuration = durations.find(d => d.months === selectedDuration) ? selectedDuration : durations[0].months;
  const selectedDurationData = durations.find(d => d.months === validSelectedDuration) || durations[0];

  const handlePurchase = () => {
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  const handleOrderSuccess = () => {
    console.log('Order submitted successfully');
    setShowCheckout(false);
  };

  return (
    <StoreLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="container py-12">
            <Link 
              to={product.category === 'activation-player' ? '/activation' : '/subscription'}
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200 group mb-6"
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to {product.category === 'activation-player' ? 'Activation' : 'Subscriptions'}
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
                  {durations.map((duration) => (
                    <button
                      key={duration.months}
                      onClick={() => setSelectedDuration(duration.months)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        validSelectedDuration === duration.months
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
                  className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white h-14 text-lg font-semibold lg:h-16 lg:text-xl"
                  size="lg"
                >
                  Buy Now
                </Button>
              </Card>
            </div>
          </div>
        </div>

        {/* Checkout Form Modal */}
        {showCheckout && (
          <CheckoutForm
            packageData={{
              id: product.id,
              name: product.name,
              category: product.category,
              price: selectedDurationData.price!,
              duration: selectedDurationData.months
            }}
            onClose={handleCloseCheckout}
            onSuccess={handleOrderSuccess}
          />
        )}
      </div>
    </StoreLayout>
  );
};

export default ProductDetail;
