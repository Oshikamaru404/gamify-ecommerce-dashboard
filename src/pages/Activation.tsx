
import React from 'react';
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
  MessageCircle
} from 'lucide-react';
import StoreLayout from '@/components/store/StoreLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';

const Activation = () => {
  const { t } = useLanguage();
  const { data: packages, isLoading } = useIPTVPackages();

  console.log('Activation page - packages:', packages);

  // Filter packages for activation-player category
  const activationPackages = packages?.filter(pkg => 
    pkg.category === 'activation-player' && pkg.status !== 'inactive'
  ) || [];

  console.log('Activation page - filtered activation packages:', activationPackages);

  const handlePurchase = (packageItem: any, duration: number, price: number) => {
    const message = `Hello, I'm interested in ${packageItem.name} - ${duration} Month(s) - $${price.toFixed(2)}`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getDurationPrice = (pkg: any, months: number) => {
    switch (months) {
      case 1: return pkg.price_1_month || 49.99;
      case 3: return pkg.price_3_months || (pkg.price_1_month || 49.99) * 3 * 0.9;
      case 6: return pkg.price_6_months || (pkg.price_1_month || 49.99) * 6 * 0.85;
      case 12: return pkg.price_12_months || (pkg.price_1_month || 49.99) * 12 * 0.75;
      default: return 49.99;
    }
  };

  const getDiscount = (pkg: any, months: number) => {
    if (months === 1) return 0;
    
    const monthlyPrice = pkg.price_1_month || 49.99;
    const totalPrice = getDurationPrice(pkg, months);
    const regularTotal = monthlyPrice * months;
    
    return Math.round((1 - (totalPrice / regularTotal)) * 100);
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
            <div className="text-center max-w-4xl mx-auto">
              <Crown className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Device Activation Service
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Professional activation service for your streaming devices. Get your IPTV up and running 
                with our premium activation packages designed for all major platforms.
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
                  <span>24/7 Technical Support</span>
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

        {/* Activation Packages */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Activation Packages
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the perfect activation package for your streaming setup. 
                All packages include professional device configuration and ongoing support.
              </p>
            </div>

            {activationPackages.length > 0 ? (
              <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                {activationPackages.map((pkg, index) => (
                  <Card key={pkg.id} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                    {pkg.status === 'featured' && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-bl-lg font-semibold flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        Popular
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-2">
                      <div className="text-4xl mb-4">{pkg.icon || '🚀'}</div>
                      <CardTitle className="text-2xl text-gray-900">{pkg.name}</CardTitle>
                      <p className="text-gray-600 mt-2">
                        {pkg.description || 'Professional device activation with premium support'}
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
                            <span className="text-sm text-gray-700">Professional device setup</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <span className="text-sm text-gray-700">Multi-platform compatibility</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <span className="text-sm text-gray-700">24/7 technical support</span>
                          </div>
                        </div>
                      )}

                      {/* Pricing Options */}
                      <div className="space-y-3">
                        {[1, 3, 6, 12].map((months) => {
                          const price = getDurationPrice(pkg, months);
                          const discount = getDiscount(pkg, months);
                          
                          return (
                            <div key={months} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div>
                                <span className="font-semibold">
                                  {months} Month{months > 1 ? 's' : ''}
                                </span>
                                {discount > 0 && (
                                  <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
                                    -{discount}% OFF
                                  </Badge>
                                )}
                                <div className="text-sm text-gray-600">
                                  ${(price / months).toFixed(2)}/month
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-lg">${price.toFixed(2)}</div>
                                <Button
                                  size="sm"
                                  onClick={() => handlePurchase(pkg, months, price)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  <MessageCircle className="mr-1 h-4 w-4" />
                                  Buy Now
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
                        <Link to={`/product/${pkg.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Crown className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Activation Packages Available
                </h3>
                <p className="text-gray-600 mb-6">
                  Activation packages are currently being configured. Please check back soon.
                </p>
                <Button asChild variant="outline">
                  <Link to="/subscription">
                    Browse Other Packages
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
              Why Choose Our Activation Service?
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
