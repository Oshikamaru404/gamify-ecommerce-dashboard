import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Shield, Star, Crown, CheckCircle, Zap, Clock } from 'lucide-react';
import CheckoutForm from '@/components/CheckoutForm';
import PlanSelector from '@/components/PlanSelector';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: packages, isLoading } = useIPTVPackages();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  console.log('ProductDetail - Current slug:', slug);
  console.log('ProductDetail - All packages:', packages);

  // Enhanced slug generation to match all package types
  const generateSlug = (name: string, category: string) => {
    const baseSlug = name.toLowerCase()
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

  // Find the package by slug across all categories
  let pkg = null;
  let packageCategory = '';

  if (packages) {
    // Check all package categories
    for (const p of packages) {
      if (p.status !== 'inactive') {
        const generatedSlug = generateSlug(p.name, p.category);
        console.log(`ProductDetail - Checking package: ${p.name}, category: ${p.category}, generated slug: ${generatedSlug}, target slug: ${slug}`);
        
        if (generatedSlug === slug) {
          pkg = p;
          packageCategory = p.category;
          console.log('ProductDetail - Found matching package:', pkg);
          break;
        }
      }
    }
  }

  const handlePlanSelect = (plan: any) => {
    console.log('ProductDetail - Plan selected:', plan);
    // Ensure the plan includes the icon_url from the original package
    const enrichedPlan = {
      ...plan,
      icon_url: pkg?.icon_url,
      icon: pkg?.icon
    };
    console.log('ProductDetail - Enriched plan with icon data:', enrichedPlan);
    setSelectedPlan(enrichedPlan);
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setSelectedPlan(null);
  };

  const handleOrderSuccess = () => {
    console.log('Order submitted successfully');
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

          {/* Package Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white p-8`}>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 flex items-center justify-center">
                  {pkg.icon_url ? (
                    <img 
                      src={pkg.icon_url} 
                      alt={pkg.name} 
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
                    {pkg.icon || (isActivationPackage ? '🚀' : '📺')}
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{pkg.name}</h1>
                  <p className="text-white/90 text-xl">{pkg.description}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <Badge className="bg-white/20 text-white">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {isActivationPackage ? 'Device Activation' : 'Premium IPTV'}
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
                  <CheckCircle className={`mr-3 h-6 w-6 text-${primaryColor}-600`} />
                  Package Features
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {pkg.features && pkg.features.length > 0 ? (
                    pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className={`flex-shrink-0 w-6 h-6 bg-${primaryColor}-600/10 rounded-full flex items-center justify-center mt-1 mr-3`}>
                          <Check className={`w-4 h-4 text-${primaryColor}-600`} />
                        </div>
                        <div>
                          <p className="text-gray-700">{feature}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-6 h-6 bg-${primaryColor}-600/10 rounded-full flex items-center justify-center mt-1 mr-3`}>
                          <Check className={`w-4 h-4 text-${primaryColor}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Premium Quality</h3>
                          <p className="text-gray-600 text-sm">
                            {isActivationPackage ? 'Professional device activation service' : 'High-quality IPTV streaming'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-6 h-6 bg-${primaryColor}-600/10 rounded-full flex items-center justify-center mt-1 mr-3`}>
                          <Check className={`w-4 h-4 text-${primaryColor}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Fast Setup</h3>
                          <p className="text-gray-600 text-sm">Quick and easy activation process</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-6 h-6 bg-${primaryColor}-600/10 rounded-full flex items-center justify-center mt-1 mr-3`}>
                          <Check className={`w-4 h-4 text-${primaryColor}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Guaranteed Reliability</h3>
                          <p className="text-gray-600 text-sm">Reliable service with high uptime</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-6 h-6 bg-${primaryColor}-600/10 rounded-full flex items-center justify-center mt-1 mr-3`}>
                          <Check className={`w-4 h-4 text-${primaryColor}-600`} />
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
                  {isActivationPackage ? <Zap className={`mr-3 h-6 w-6 text-${primaryColor}-600`} /> : <Clock className={`mr-3 h-6 w-6 text-${primaryColor}-600`} />}
                  Service Information
                </h2>
                <div className="space-y-4">
                  <div className={`bg-${primaryColor}-600/5 border border-${primaryColor}-600/20 rounded-lg p-4`}>
                    <h3 className={`font-semibold text-${primaryColor}-600 mb-2`}>
                      {isActivationPackage ? '12-Month Activation' : 'Subscription Service'}
                    </h3>
                    <p className="text-gray-700">
                      {isActivationPackage 
                        ? 'Professional device activation with full year support and maintenance.'
                        : 'Premium IPTV subscription with access to thousands of channels.'}
                    </p>
                  </div>
                  <div className={`bg-${primaryColor}-600/5 border border-${primaryColor}-600/20 rounded-lg p-4`}>
                    <h3 className={`font-semibold text-${primaryColor}-600 mb-2`}>Professional Service</h3>
                    <p className="text-gray-700">
                      {isActivationPackage 
                        ? 'Expert technicians handle the complete setup and configuration process.'
                        : 'Advanced streaming technology with professional management tools.'}
                    </p>
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
                  packageName={pkg.name}
                  packageData={pkg}
                  onPlanSelect={handlePlanSelect}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form Modal */}
        {showCheckout && selectedPlan && (
          <CheckoutForm 
            packageData={selectedPlan} 
            onClose={handleCloseCheckout} 
            onSuccess={handleOrderSuccess} 
          />
        )}
      </div>
    </StoreLayout>
  );
};

export default ProductDetail;
