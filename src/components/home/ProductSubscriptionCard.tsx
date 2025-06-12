
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IPTVPackage } from '@/hooks/useIPTVPackages';

interface ProductSubscriptionCardProps {
  package: IPTVPackage;
  featured?: boolean;
}

const ProductSubscriptionCard: React.FC<ProductSubscriptionCardProps> = ({ 
  package: pkg, 
  featured = false 
}) => {
  // Generate a URL-friendly slug from the package name
  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .trim();
  };

  const productSlug = generateSlug(pkg.name);

  // Determine the base price for display (prefer 1-month, fallback to others)
  const displayPrice = pkg.price_1_month || pkg.price_3_months || pkg.price_6_months || pkg.price_12_months || pkg.price_10_credits;

  const handleGetStarted = () => {
    // For subscription packages, navigate to product detail page
    if (pkg.category === 'subscription' || pkg.category === 'activation-player') {
      // The Link component will handle navigation
    } else {
      // For other categories, use WhatsApp contact
      const message = `Hello, I'm interested in ${pkg.name}`;
      const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <Card className={`relative h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden ${
      featured 
        ? 'border-2 border-red-500 shadow-xl ring-4 ring-red-100' 
        : 'border border-gray-200 hover:border-red-300'
    }`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
            <Star className="w-4 h-4 mr-1 fill-current" />
            Most Popular
          </Badge>
        </div>
      )}

      {/* Gradient overlay for featured packages */}
      {featured && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 to-transparent pointer-events-none" />
      )}
      
      {/* Two-part design with golden ratio (1/3 and 2/3 proportions) */}
      <div className="flex h-full relative z-10">
        {/* Left section - Icon area (1/3) */}
        <div className="w-1/3 bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center p-6 border-r border-red-200">
          {pkg.icon && (
            <div className="text-6xl mb-4 drop-shadow-sm">{pkg.icon}</div>
          )}
          
          {/* Price Display in icon section */}
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">
              ${displayPrice?.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {pkg.price_1_month ? '/month' : ''}
            </div>
            {pkg.price_1_month && pkg.price_12_months && (
              <div className="text-xs text-green-600 font-medium mt-1">
                Save ${((pkg.price_1_month * 12) - pkg.price_12_months).toFixed(2)} yearly
              </div>
            )}
          </div>
        </div>

        {/* Right section - Package details (2/3) */}
        <div className="w-2/3 flex flex-col">
          <CardContent className="p-6 h-full flex flex-col">
            {/* Package Title and Description */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                {pkg.name}
              </h3>
              
              {pkg.description && (
                <p className="text-gray-600 text-sm leading-relaxed">{pkg.description}</p>
              )}
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-6 flex-grow">
              {pkg.features && pkg.features.length > 0 ? (
                pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 ml-3 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 ml-3 text-sm leading-relaxed">Premium features included</span>
                </div>
              )}
            </div>

            {/* 30-Day Money Back Guarantee */}
            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-center justify-center text-green-700">
                <Shield className="w-4 h-4 mr-2" />
                <span className="font-semibold text-xs">30-Day Money Back Guarantee</span>
              </div>
            </div>

            {/* Call to Action Button */}
            <div className="mt-auto">
              {(pkg.category === 'subscription' || pkg.category === 'activation-player') ? (
                <Button asChild className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to={`/product/${productSlug}`}>
                    Get Started Now
                  </Link>
                </Button>
              ) : (
                <Button 
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started Now
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default ProductSubscriptionCard;
