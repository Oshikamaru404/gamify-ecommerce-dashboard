
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Crown, Smartphone, Tv, Tablet, Monitor, Zap, Shield, Clock, CheckCircle, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import StoreLayout from '@/components/store/StoreLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';

const Activation = () => {
  const { t } = useLanguage();
  const { data: packages, isLoading } = useIPTVPackages();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log('Activation page - packages:', packages);

  // Filter packages for activation-player category
  const activationPackages = packages?.filter(pkg => pkg.category === 'activation-player' && pkg.status !== 'inactive') || [];
  console.log('Activation page - filtered activation packages:', activationPackages);

  // Enhanced slug generation to match ProductDetail page
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

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="container py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activation packages...</p>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="container py-20">
            <div className="flex items-center mb-8">
              <Link to="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200 group">
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Home
              </Link>
            </div>
            
            <div className="text-center max-w-4xl mx-auto">
              <Crown className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Device Activation Service
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Professional activation service for your streaming devices. Get your IPTV up and running 
                with our premium 12-month activation packages designed for all major platforms.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-lg">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-6 w-6 text-green-300" />
                  <span>Professional Setup</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-6 w-6 text-green-300" />
                  <span>Multi-Device Support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-6 w-6 text-green-300" />
                  <span>12-Month Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Devices */}
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Supported Devices
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Smartphone, name: 'Mobile Devices', description: 'iOS & Android' },
                { icon: Tv, name: 'Smart TVs', description: 'Samsung, LG, Sony' },
                { icon: Tablet, name: 'Tablets', description: 'iPad & Android Tablets' },
                { icon: Monitor, name: 'Computers', description: 'Windows & Mac' }
              ].map((device, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8">
                    <device.icon className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{device.name}</h3>
                    <p className="text-gray-600">{device.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 12-Month Activation Packages */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                12-Month Activation Packages
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our premium activation packages come with a full year of service, professional setup, 
                and comprehensive support. Perfect for long-term streaming needs.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto mt-6">
                <p className="text-green-800 font-medium">
                  ✅ All packages automatically include 12-month activation
                </p>
              </div>
            </div>

            {activationPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {activationPackages.map((pkg, index) => {
                  const productSlug = generateSlug(pkg.name, pkg.category);
                  const price12Months = pkg.price_12_months || 199.99;
                  console.log('Activation page - generating slug for:', pkg.name, 'category:', pkg.category, 'slug:', productSlug);
                  
                  return (
                    <div key={pkg.id} className="relative">
                      {pkg.status === 'featured' && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            Most Popular
                          </Badge>
                        </div>
                      )}

                      <AspectRatio ratio={1} className="w-full">
                        <div className="flex flex-col h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                          {/* Top Section - Icon (Red Background) - 60% of card height */}
                          <div className="h-[60%] bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center relative">
                            <div className="w-20 h-20 bg-red-400/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                              {/* Priority: Use uploaded image URL first */}
                              {pkg.icon_url && (
                                <img 
                                  src={pkg.icon_url} 
                                  alt={pkg.name}
                                  className="w-16 h-16 rounded-xl object-cover border-2 border-red-500 shadow-lg"
                                  onError={(e) => {
                                    // If image fails to load, hide it and show fallback
                                    e.currentTarget.style.display = 'none';
                                    const fallbackContainer = e.currentTarget.parentElement?.nextElementSibling as HTMLElement;
                                    if (fallbackContainer) fallbackContainer.style.display = 'flex';
                                  }}
                                />
                              )}
                              
                              {/* Fallback: Use emoji if no image URL or if image fails to load */}
                              <div 
                                className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-2xl text-white drop-shadow-lg"
                                style={{ display: pkg.icon_url ? 'none' : 'flex' }}
                              >
                                {pkg.icon || '🚀'}
                              </div>
                            </div>
                          </div>

                          {/* Bottom Section - Content (White Background) - 40% of card height */}
                          <div className="h-[40%] bg-white p-3 flex flex-col justify-between">
                            {/* Enhanced 30-Day Money Back Guarantee Badge */}
                            <div className="flex justify-center mb-2">
                              <div className="bg-white border border-red-500 text-red-600 px-2 py-1 rounded-full text-xs font-bold shadow-sm flex items-center">
                                <Shield className="w-3 h-3 mr-1" />
                                30-Day Guarantee
                              </div>
                            </div>

                            {/* Package Title */}
                            <h3 className="text-sm font-bold text-gray-900 mb-1 text-center leading-tight line-clamp-2">
                              {pkg.name}
                            </h3>
                            
                            {/* Price Display - Updated to use USD */}
                            <div className="text-center mb-2">
                              <div className="flex items-baseline justify-center">
                                <span className="text-xs text-gray-500 mr-1">$</span>
                                <span className="text-lg font-bold text-red-600">
                                  {price12Months?.toFixed(0)}
                                </span>
                                <span className="text-xs text-gray-500 ml-1">
                                  / 12mo
                                </span>
                              </div>
                            </div>

                            {/* View Details Button */}
                            <div className="mt-auto">
                              <Button asChild className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-1 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-lg h-8">
                                <Link to={`/products/${productSlug}`}>
                                  Purchase Package
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AspectRatio>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Crown className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Activation Packages Available
                </h3>
                <p className="text-gray-600 mb-6">
                  12-month activation packages are currently being configured. Please check back soon.
                </p>
                <Button asChild variant="outline">
                  <Link to="/subscription">
                    Browse Subscription Packages
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Our 12-Month Activation Service?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Zap, title: 'Instant Activation', description: 'Activate your device in minutes' },
                { icon: Shield, title: 'Secure Connection', description: 'Encrypted streaming protocols' },
                { icon: Clock, title: 'Long-term Support', description: 'Extended device compatibility' },
                { icon: CheckCircle, title: 'Quality Guarantee', description: 'Premium streaming experience' }
              ].map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <feature.icon className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </StoreLayout>
  );
};

export default Activation;
