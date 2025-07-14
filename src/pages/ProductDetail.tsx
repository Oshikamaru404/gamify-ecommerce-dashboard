
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Check, ShoppingCart, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StoreLayout from '@/components/store/StoreLayout';
import CheckoutForm from '@/components/CheckoutForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const { data: packages, isLoading } = useIPTVPackages();
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [showCheckout, setShowCheckout] = useState(false);

  // Enhanced slug generation to handle category-specific packages
  const generateSlug = (name: string, category: string) => {
    const baseSlug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .trim();
    
    // For activation-player packages, add category suffix to make slug unique
    if (category === 'activation-player') {
      return `${baseSlug}-activation`;
    }
    return baseSlug;
  };

  // Find package by enhanced slug matching
  const findPackageBySlug = (slug: string, packages: any[]) => {
    // First try exact match
    let foundPackage = packages.find(pkg => generateSlug(pkg.name, pkg.category) === slug);
    
    // If not found and slug ends with '-activation', try to find activation-player package
    if (!foundPackage && slug.endsWith('-activation')) {
      const baseName = slug.replace('-activation', '');
      foundPackage = packages.find(pkg => 
        pkg.category === 'activation-player' && 
        generateSlug(pkg.name, 'activation-player') === slug
      );
    }
    
    // If still not found, try base slug match for backward compatibility
    if (!foundPackage) {
      const baseSlug = slug.replace('-activation', '');
      foundPackage = packages.find(pkg => {
        const pkgBaseSlug = pkg.name.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')
          .replace(/--+/g, '-')
          .trim();
        return pkgBaseSlug === baseSlug;
      });
    }
    
    return foundPackage;
  };

  const currentPackage = packages ? findPackageBySlug(slug!, packages) : null;

  console.log('ProductDetail - Current slug:', slug);
  console.log('ProductDetail - Found package:', currentPackage);

  // Auto-select 12-month plan for ALL activation-player packages
  useEffect(() => {
    if (currentPackage) {
      if (currentPackage.category === 'activation-player') {
        // Always auto-select 12 months for activation-player packages
        setSelectedDuration(12);
        console.log(`Auto-selected 12-month plan for activation package: ${currentPackage.name}`);
      } else {
        // For other categories, default to 1 month
        setSelectedDuration(1);
      }
    }
  }, [currentPackage]);

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  const handleOrderSuccess = () => {
    console.log('Order submitted successfully');
  };

  const getPriceForDuration = (duration: number) => {
    if (!currentPackage) return 0;
    
    switch (duration) {
      case 1: return currentPackage.price_1_month || 0;
      case 3: return currentPackage.price_3_months || 0;
      case 6: return currentPackage.price_6_months || 0;
      case 12: return currentPackage.price_12_months || 0;
      default: return 0;
    }
  };

  const getMonthlyPrice = (duration: number) => {
    const totalPrice = getPriceForDuration(duration);
    return totalPrice / duration;
  };

  const getSavings = (duration: number) => {
    if (!currentPackage?.price_1_month || duration === 1) return 0;
    const monthlyPrice = currentPackage.price_1_month;
    const totalRegular = monthlyPrice * duration;
    const totalDiscounted = getPriceForDuration(duration);
    return totalRegular - totalDiscounted;
  };

  // Filter available durations based on package category
  const getAvailableDurations = () => {
    if (currentPackage?.category === 'activation-player') {
      // For activation-player packages, only show 12-month option
      return [
        { months: 12, label: '12 Months', badge: 'Best Value' }
      ].filter(duration => getPriceForDuration(duration.months) > 0);
    }
    
    // For other categories, show all available durations
    return [
      { months: 1, label: '1 Month', badge: null },
      { months: 3, label: '3 Months', badge: '10% Off' },
      { months: 6, label: '6 Months', badge: '20% Off' },
      { months: 12, label: '12 Months', badge: 'Best Value' }
    ].filter(duration => getPriceForDuration(duration.months) > 0);
  };

  const availableDurations = getAvailableDurations();

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="container py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </StoreLayout>
    );
  }

  if (!currentPackage) {
    return (
      <StoreLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h1>
          <p className="text-gray-600 mb-8">The package you're looking for doesn't exist.</p>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Slug: {slug}</p>
            <Button asChild>
              <Link to="/subscription">Browse All Packages</Link>
            </Button>
          </div>
        </div>
      </StoreLayout>
    );
  }

  const selectedPrice = getPriceForDuration(selectedDuration);
  const monthlyPrice = getMonthlyPrice(selectedDuration);
  const savings = getSavings(selectedDuration);

  // Create the package data object for checkout
  const checkoutPackageData = {
    id: currentPackage.id,
    name: currentPackage.name,
    category: currentPackage.category,
    price: selectedPrice,
    duration: selectedDuration
  };

  return (
    <StoreLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container py-8">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              to={currentPackage.category === 'activation-player' ? '/activation' : '/subscription'}
              className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors duration-200 group"
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
              {currentPackage.category === 'activation-player' ? 'Back to Activation' : 'Back to Packages'}
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Package Details */}
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-12">
                  <div className="text-6xl mb-4">
                    {currentPackage.icon_url ? (
                      <img 
                        src={currentPackage.icon_url} 
                        alt={currentPackage.name}
                        className="w-20 h-20 mx-auto rounded-lg object-cover"
                        onError={(e) => {
                          console.log('Image failed to load:', currentPackage.icon_url);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.setAttribute('style', 'display: block');
                        }}
                      />
                    ) : null}
                    {!currentPackage.icon_url && (
                      <span>{currentPackage.icon || '📺'}</span>
                    )}
                    {currentPackage.icon_url && (
                      <span style={{ display: 'none' }}>{currentPackage.icon || '📺'}</span>
                    )}
                  </div>
                  <CardTitle className="text-3xl font-bold">{currentPackage.name}</CardTitle>
                  {currentPackage.status === 'featured' && (
                    <Badge className="bg-yellow-500 text-yellow-900 mt-2">
                      <Star className="mr-1 h-4 w-4" />
                      Most Popular
                    </Badge>
                  )}
                  {/* Special badge for activation-player packages */}
                  {currentPackage.category === 'activation-player' && (
                    <Badge className="bg-green-500 text-white mt-2">
                      <Shield className="mr-1 h-4 w-4" />
                      12-Month Activation Service
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {currentPackage.description || 
                      (currentPackage.category === 'activation-player' 
                        ? 'Professional 12-month device activation service with comprehensive setup and ongoing support.'
                        : 'Premium IPTV subscription with unlimited access to channels and content.')
                    }
                  </p>

                  {/* Features */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Features Included:</h3>
                    {currentPackage.features && currentPackage.features.length > 0 ? (
                      currentPackage.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-600 mt-0.5" />
                          <span className="text-gray-700">
                            {currentPackage.category === 'activation-player' 
                              ? 'Professional device activation & setup' 
                              : '8000+ Live TV Channels'}
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-600 mt-0.5" />
                          <span className="text-gray-700">
                            {currentPackage.category === 'activation-player' 
                              ? '12-month service guarantee' 
                              : 'Ultra HD 4K Quality'}
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-600 mt-0.5" />
                          <span className="text-gray-700">
                            {currentPackage.category === 'activation-player' 
                              ? 'Multi-platform compatibility' 
                              : 'VOD Library'}
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-600 mt-0.5" />
                          <span className="text-gray-700">24/7 Support</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* 12-Month Service Guarantee */}
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                          {currentPackage.category === 'activation-player' ? '12-Month Service Guarantee' : '30-Day Warranty'}
                        </h4>
                        <p className="text-sm text-blue-800">
                          {currentPackage.category === 'activation-player' 
                            ? 'We guarantee full activation service for 12 months from purchase. Professional setup and ongoing support included.'
                            : 'We guarantee service quality for 30 days from activation. If you experience any issues during this period, contact our support team for immediate assistance or a full refund.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pricing & Purchase */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">
                    {currentPackage.category === 'activation-player' ? 'Activation Service Plan' : 'Choose Your Plan'}
                  </CardTitle>
                  <p className="text-gray-600">
                    {currentPackage.category === 'activation-player' 
                      ? 'Professional 12-month activation service'
                      : 'Select the duration that works best for you'}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {availableDurations.map((duration) => (
                    <div
                      key={duration.months}
                      className={`relative p-4 border-2 rounded-lg transition-all duration-200 ${
                        selectedDuration === duration.months
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200'
                      } ${currentPackage.category === 'activation-player' ? 'cursor-default' : 'cursor-pointer hover:border-red-300'}`}
                      onClick={() => currentPackage.category !== 'activation-player' && setSelectedDuration(duration.months)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              selectedDuration === duration.months
                                ? 'border-red-500 bg-red-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedDuration === duration.months && (
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{duration.label}</h4>
                            <p className="text-sm text-gray-600">
                              €{getMonthlyPrice(duration.months).toFixed(2)}/month
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900">
                            €{getPriceForDuration(duration.months).toFixed(2)}
                          </div>
                          {duration.badge && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              {duration.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {getSavings(duration.months) > 0 && (
                        <div className="mt-2 text-sm text-green-600 font-medium">
                          Save €{getSavings(duration.months).toFixed(2)} compared to monthly billing
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Purchase Summary - Exactly like VU Player Pro */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-semibold">{currentPackage.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{selectedDuration} Month{selectedDuration > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly Rate:</span>
                      <span className="font-semibold">€{monthlyPrice.toFixed(2)}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>You Save:</span>
                        <span className="font-semibold">€{savings.toFixed(2)}</span>
                      </div>
                    )}
                    <hr />
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-red-600">€{selectedPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                    onClick={() => setShowCheckout(true)}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {currentPackage.category === 'activation-player' ? 'Purchase Activation Service' : 'Purchase Now'}
                  </Button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {currentPackage.category === 'activation-player' 
                        ? 'Professional setup within 24 hours' 
                        : 'Instant activation after payment'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Checkout Form Modal */}
          {showCheckout && (
            <CheckoutForm
              packageData={checkoutPackageData}
              onClose={handleCloseCheckout}
              onSuccess={handleOrderSuccess}
            />
          )}
        </div>
      </div>
    </StoreLayout>
  );
};

export default ProductDetail;
