
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
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
  const activationPackages = packages?.filter(pkg => 
    pkg.category === 'activation-player' && pkg.status !== 'inactive'
  ) || [];

  console.log('Activation page - filtered activation packages:', activationPackages);

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .trim();
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
              <Link 
                to="/" 
                className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200 group"
              >
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
              {deviceTypes.map((device, index) => (
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
              <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                {activationPackages.map((pkg, index) => {
                  const productSlug = generateSlug(pkg.name);
                  // Auto-select 12-month price for activation packages
                  const price12Months = pkg.price_12_months || 199.99;
                  
                  return (
                    <Card key={pkg.id} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                      {pkg.status === 'featured' && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-bl-lg font-semibold flex items-center">
                          <Star className="mr-1 h-4 w-4" />
                          Popular
                        </div>
                      )}
                      
                      <CardHeader className="text-center pb-2">
                        <div className="text-4xl mb-4">
                          {pkg.icon_url ? (
                            <img 
                              src={pkg.icon_url} 
                              alt={pkg.name}
                              className="w-16 h-16 mx-auto rounded-lg object-cover"
                            />
                          ) : (
                            <span>{pkg.icon || '🚀'}</span>
                          )}
                        </div>
                        <CardTitle className="text-2xl text-gray-900">{pkg.name}</CardTitle>
                        <p className="text-gray-600 mt-2">
                          {pkg.description || 'Professional 12-month device activation with premium support'}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        {/* Features */}
                        {pkg.features && pkg.features.length > 0 ? (
                          <div className="space-y-3">
                            {pkg.features.slice(0, 4).map((feature: string, featureIndex: number) => (
                              <div key={featureIndex} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                              <span className="text-sm text-gray-700">Professional device setup & configuration</span>
                            </div>
                            <div className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                              <span className="text-sm text-gray-700">12-month activation guarantee</span>
                            </div>
                            <div className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                              <span className="text-sm text-gray-700">Multi-platform compatibility</span>
                            </div>
                            <div className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                              <span className="text-sm text-gray-700">Priority technical support</span>
                            </div>
                          </div>
                        )}

                        {/* Auto-Selected 12-Month Pricing */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-500 relative">
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-600 text-white text-xs">
                              AUTO-SELECTED
                            </Badge>
                          </div>
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
                              ✅ Full year activation + support included
                            </div>
                          </div>
                        </div>

                        <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
                          <Link to={`/products/${productSlug}?plan=12months`}>
                            Purchase 12-Month Package
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
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
              {features.map((feature, index) => (
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
