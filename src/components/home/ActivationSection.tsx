import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Crown, 
  Smartphone, 
  Tv, 
  Tablet, 
  Monitor, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';

const ActivationSection = () => {
  const { data: packages, isLoading } = useIPTVPackages();

  // Filter packages for activation-player category
  const activationPackages = packages?.filter(pkg => 
    pkg.category === 'activation-player' && pkg.status !== 'inactive'
  ) || [];

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

  const deviceTypes = [
    { icon: Smartphone, name: 'Mobile Devices', description: 'iOS & Android' },
    { icon: Tv, name: 'Smart TVs', description: 'Samsung, LG, Sony' },
    { icon: Tablet, name: 'Tablets', description: 'iPad & Android Tablets' },
    { icon: Monitor, name: 'Computers', description: 'Windows & Mac' }
  ];

  const features = [
    { icon: Zap, title: 'Instant Activation', description: 'Activate your device in minutes' },
    { icon: Shield, title: 'Secure Connection', description: 'Encrypted streaming protocols' },
    { icon: Clock, title: 'Long-term Support', description: 'Extended device compatibility' },
    { icon: CheckCircle, title: 'Quality Guarantee', description: 'Premium streaming experience' }
  ];

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading activation packages...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <Crown className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Device Activation Service
            </h2>
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
      </section>

      {/* Supported Devices */}
      <section className="py-16 bg-white">
        <div className="container">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Supported Devices
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {deviceTypes.map((device, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <device.icon className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{device.name}</h4>
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
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              12-Month Activation Packages
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our premium activation packages come with a full year of service, professional setup, 
              and comprehensive support. Perfect for long-term streaming needs.
            </p>
          </div>

          {activationPackages.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {activationPackages.map((pkg, index) => {
                const productSlug = generateSlug(pkg.name, pkg.category);
                const price12Months = pkg.price_12_months || 199.99;
                
                return (
                  <div key={pkg.id} className="relative h-full">
                    {pkg.status === 'featured' && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <div className="flex flex-col h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                      {/* Top Section - Icon (Red Background) */}
                      <div className="h-64 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center relative rounded-2xl">
                        <div className="w-32 h-32 bg-red-400/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                          {/* Priority: Use uploaded image URL first */}
                          {pkg.icon_url && (
                            <img 
                              src={pkg.icon_url} 
                              alt={pkg.name}
                              className="w-24 h-24 rounded-2xl object-cover border-4 border-red-500 shadow-xl shadow-red-300/60"
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
                            className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-4xl text-white drop-shadow-lg"
                            style={{ display: pkg.icon_url ? 'none' : 'flex' }}
                          >
                            {pkg.icon || '🚀'}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Section - Content (White Background) */}
                      <div className="flex-1 bg-white p-6 flex flex-col">
                        {/* Enhanced 30-Day Money Back Guarantee Badge */}
                        <div className="flex justify-center mb-4">
                          <div className="bg-white border-2 border-red-500 text-red-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center transform hover:scale-105 transition-all duration-300">
                            <Shield className="w-4 h-4 mr-2" />
                            30-Day Money Back Guarantee
                          </div>
                        </div>

                        {/* Package Title */}
                        <h4 className="text-lg font-bold text-gray-900 mb-2 text-center leading-tight">
                          {pkg.name}
                        </h4>
                        
                        {/* Package Description */}
                        {pkg.description && (
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">{pkg.description}</p>
                        )}

                        {/* Features */}
                        {pkg.features && pkg.features.length > 0 ? (
                          <div className="space-y-2 mb-6 flex-grow">
                            {pkg.features.slice(0, 4).map((feature: string, featureIndex: number) => (
                              <div key={featureIndex} className="flex items-start">
                                <div className="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 text-xs leading-relaxed">{feature}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2 mb-6 flex-grow">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              </div>
                              <span className="text-gray-700 text-xs leading-relaxed">Professional device setup & configuration</span>
                            </div>
                            <div className="flex items-start">
                              <div className="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              </div>
                              <span className="text-gray-700 text-xs leading-relaxed">12-month activation guarantee</span>
                            </div>
                            <div className="flex items-start">
                              <div className="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              </div>
                              <span className="text-gray-700 text-xs leading-relaxed">Multi-platform compatibility</span>
                            </div>
                            <div className="flex items-start">
                              <div className="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              </div>
                              <span className="text-gray-700 text-xs leading-relaxed">Priority technical support</span>
                            </div>
                          </div>
                        )}

                        {/* 12-Month Pricing */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-500 mb-4">
                          <div className="text-center">
                            <Badge className="bg-green-600 text-white mb-3">
                              <Crown className="mr-1 h-4 w-4" />
                              12 Months Plan
                            </Badge>
                            <div className="text-3xl font-bold text-green-700 mb-2">
                              €{price12Months.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              €{(price12Months / 12).toFixed(2)}/month
                            </div>
                            <div className="text-xs text-green-600 font-medium">
                              Full year activation + support included
                            </div>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <div className="mt-auto">
                          <Button asChild className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
                            <Link to={`/products/${productSlug}`}>
                              View Details & Purchase
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Crown className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                No Activation Packages Available
              </h4>
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
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our 12-Month Activation Service?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <feature.icon className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActivationSection;
