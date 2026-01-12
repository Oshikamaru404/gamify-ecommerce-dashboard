
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Shield, Star, Crown, CheckCircle, Zap, Clock } from 'lucide-react';
import PaymentOptionsCheckout from '@/components/PaymentOptionsCheckout';
import PlanSelector from '@/components/PlanSelector';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';
import { useLocalizedText, getLocalizedText } from '@/lib/multilingualUtils';
import { useLanguage } from '@/contexts/LanguageContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: packages, isLoading } = useIPTVPackages();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const { language } = useLanguage();

  // Enhanced slug generation to match all package types (handles multilingual names)
  const generateSlug = (name: any, category: string) => {
    const rawText = typeof name === 'string' ? name : JSON.stringify(name || '');
    const localized = getLocalizedText(rawText, language, 'en');
    const baseSlug = localized
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .trim();
    
    // Add category suffix for activation-player packages to make slug unique
    if (category === 'activation-player') {
      return `${baseSlug}-activation`;
    }
    return baseSlug;
  };

  // Find the package by slug across all categories (prefer subscription variants if duplicates exist)
  let pkg: any = null;
  let packageCategory = '';

  if (packages) {
    const matches = packages.filter((p: any) => {
      if (p.status === 'inactive') return false;
      const generatedSlug = generateSlug(p.name, p.category);
      return generatedSlug === slug;
    });

    if (matches.length > 0) {
      // Prefer subscription > iptv > panel-iptv > activation-player for duplicate slugs
      const preferredOrder = ['subscription', 'iptv', 'panel-iptv', 'activation-player'];
      matches.sort((a: any, b: any) => {
        const ia = preferredOrder.indexOf(a.category);
        const ib = preferredOrder.indexOf(b.category);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      });
      pkg = matches[0];
      packageCategory = pkg.category;
    }
  }

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setSelectedPlan(null);
  };

  const handleOrderSuccess = () => {
    setShowCheckout(false);
    setSelectedPlan(null);
  };

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
          <div className="container py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading package details...</p>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (!pkg) {
    console.log('ProductDetail - Package not found for slug:', slug);
    return (
      <StoreLayout>
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
          <div className="container py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Package Not Found</h1>
              <p className="text-gray-600 mb-8">The package you're looking for doesn't exist.</p>
              <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  // Use multilingual utility functions
  const packageName = useLocalizedText(pkg.name);
  const packageDescription = useLocalizedText(pkg.description);

  // Determine colors and styling based on package category
  const isActivationPackage = packageCategory === 'activation-player';
  const primaryColor = 'red';
  const gradientFrom = 'from-red-600';
  const gradientTo = 'to-red-700';

  console.log('ProductDetail - Rendering package:', pkg.name, 'category:', packageCategory);

  return (
    <StoreLayout>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="container py-16">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-8 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* Activation Player Layout - Similar to home page cards */}
          {isActivationPackage ? (
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Card Style Display */}
                <div className="relative">
                  {pkg.status === 'featured' && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="flex flex-col h-full rounded-2xl shadow-lg overflow-hidden">
                    {/* Top Section - Icon (Red Background) */}
                    <div className="h-64 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center relative rounded-t-2xl">
                      <div className="w-32 h-32 bg-red-400/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                        {pkg.icon_url && (
                          <img 
                            src={pkg.icon_url} 
                            alt={packageName}
                            className="w-24 h-24 rounded-2xl object-cover border-4 border-red-500 shadow-xl shadow-red-300/60"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallbackContainer = e.currentTarget.parentElement?.nextElementSibling as HTMLElement;
                              if (fallbackContainer) fallbackContainer.style.display = 'flex';
                            }}
                          />
                        )}
                        <div 
                          className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-4xl text-white drop-shadow-lg"
                          style={{ display: pkg.icon_url ? 'none' : 'flex' }}
                        >
                          {pkg.icon || '🚀'}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section - Content (White Background) */}
                    <div className="flex-1 bg-white p-6 flex flex-col">
                      {/* Package Title */}
                      <h1 className="text-2xl font-bold text-gray-900 mb-3 text-center leading-tight">
                        {packageName}
                      </h1>

                      {/* 12-Month Pricing - Under package name */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-500 mb-4">
                        <div className="text-center">
                          <Badge className="bg-green-600 text-white mb-2">
                            <Crown className="mr-1 h-4 w-4" />
                            12 Months Plan
                          </Badge>
                          <div className="text-3xl font-bold text-green-700 mb-1">
                            €{(pkg.price_12_months || 199.99).toFixed(2)}
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            ✅ Full year activation + support included
                          </div>
                        </div>
                      </div>
                      
                      {/* Package Description */}
                      {packageDescription && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{packageDescription}</p>
                      )}

                      {/* Features */}
                      {pkg.features && pkg.features.length > 0 ? (
                        <div className="space-y-2 mb-4 flex-grow">
                          {pkg.features.slice(0, 4).map((feature: string, featureIndex: number) => (
                            <div key={featureIndex} className="flex items-start">
                              <div className="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              </div>
                              <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2 mb-4 flex-grow">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-700 text-sm leading-relaxed">Professional device setup & configuration</span>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-700 text-sm leading-relaxed">12-month activation guarantee</span>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-700 text-sm leading-relaxed">Multi-platform compatibility</span>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-700 text-sm leading-relaxed">Priority technical support</span>
                          </div>
                        </div>
                      )}

                      {/* 30-Day Money Back Guarantee Badge - At bottom */}
                      <div className="flex justify-center mb-4">
                        <div className="bg-green-50 border-2 border-green-500 text-green-700 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center transform hover:scale-105 transition-all duration-300">
                          <Shield className="w-4 h-4 mr-2" />
                          30-Day Money Back Guarantee
                        </div>
                      </div>

                      {/* Buy Now Button */}
                      <div className="mt-auto">
                        <Button 
                          onClick={() => handlePlanSelect({ price: pkg.price_12_months || 199.99, duration: 12 })}
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
                        >
                          Buy Now - €{(pkg.price_12_months || 199.99).toFixed(2)}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Service Info */}
                <div className="space-y-6">
                  {/* Service Information */}
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <Zap className="mr-3 h-6 w-6 text-red-600" />
                      Service Information
                    </h2>
                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-semibold text-red-600 mb-2">12-Month Activation</h3>
                        <p className="text-gray-700 text-sm">
                          Professional device activation with full year support and maintenance.
                        </p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-semibold text-red-600 mb-2">Professional Service</h3>
                        <p className="text-gray-700 text-sm">
                          Expert technicians handle the complete setup and configuration process.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Why Choose Us */}
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <CheckCircle className="mr-3 h-6 w-6 text-red-600" />
                      Why Choose Us
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Instant activation within minutes</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Multi-device compatibility</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">24/7 Technical support</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Secure encrypted connection</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Layout for Non-Activation Packages */
            <>
              {/* Package Header */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
                <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white p-8`}>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 flex items-center justify-center">
                      {pkg.icon_url ? (
                        <img 
                          src={pkg.icon_url} 
                          alt={packageName} 
                          className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-lg" 
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
                        {pkg.icon || '📺'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold mb-2">{packageName}</h1>
                      <p className="text-white/90 text-xl">{packageDescription}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <Badge className="bg-white/20 text-white">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          Premium IPTV
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
                      <CheckCircle className="mr-3 h-6 w-6 text-red-600" />
                      Package Features
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {pkg.features && pkg.features.length > 0 ? (
                        pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1 mr-3">
                              <Check className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                              <p className="text-gray-700">{feature}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1 mr-3">
                              <Check className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Premium Quality</h3>
                              <p className="text-gray-600 text-sm">High-quality IPTV streaming</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1 mr-3">
                              <Check className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Fast Setup</h3>
                              <p className="text-gray-600 text-sm">Quick and easy activation process</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1 mr-3">
                              <Check className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Guaranteed Reliability</h3>
                              <p className="text-gray-600 text-sm">Reliable service with high uptime</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1 mr-3">
                              <Check className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                              <p className="text-gray-600 text-sm">Round-the-clock customer support</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>

                  {/* Service Information */}
                  <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <Clock className="mr-3 h-6 w-6 text-red-600" />
                      Service Information
                    </h2>
                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-semibold text-red-600 mb-2">Subscription Service</h3>
                        <p className="text-gray-700">Premium IPTV subscription with access to thousands of channels.</p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-semibold text-red-600 mb-2">Professional Service</h3>
                        <p className="text-gray-700">Advanced streaming technology with professional management tools.</p>
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

                {/* Right Column - Plan Selection */}
                <div className="space-y-6">
                  <div className="sticky top-6">
                    <PlanSelector
                      packageId={pkg.id}
                      packageName={packageName}
                      packageData={pkg}
                      onPlanSelect={handlePlanSelect}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Payment Options Checkout Modal */}
        {showCheckout && selectedPlan && pkg && (
          <PaymentOptionsCheckout
            packageData={{
              id: pkg.id,
              name: useLocalizedText(pkg.name),
              category: pkg.category,
              description: pkg.description,
              icon_url: pkg.icon_url,
              price: selectedPlan.price,
              duration: selectedPlan.credits || selectedPlan.months || selectedPlan.duration
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
