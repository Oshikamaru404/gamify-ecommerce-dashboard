
import React from 'react';
import { Card } from '@/components/ui/card';
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
    <div className="relative h-full">
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
            <Star className="w-4 h-4 mr-1 fill-current" />
            Most Popular
          </Badge>
        </div>
      )}

      <div className="flex flex-col h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
        {/* Top Section - Icon (Red Background) */}
        <div className="h-48 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center relative rounded-2xl">
          {/* Icon Background Circle */}
          <div className="w-20 h-20 bg-red-400/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            {pkg.icon ? (
              <div className="text-4xl text-white drop-shadow-lg">{pkg.icon}</div>
            ) : (
              <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
            )}
          </div>
        </div>

        {/* Bottom Section - Content (White Background) */}
        <div className="flex-1 bg-white p-6 flex flex-col">
          {/* Package Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 text-center leading-tight">
            {pkg.name}
          </h3>
          
          {/* Price Display */}
          <div className="text-center mb-4">
            <div className="flex items-baseline justify-center">
              <span className="text-sm text-gray-500 mr-1">€</span>
              <span className="text-2xl font-bold text-red-600">
                {displayPrice?.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                {pkg.price_1_month ? '/ mois' : ''}
              </span>
            </div>
            {pkg.price_1_month && pkg.price_12_months && (
              <div className="text-xs text-green-600 font-medium mt-1">
                Save €{((pkg.price_1_month * 12) - pkg.price_12_months).toFixed(2)} yearly
              </div>
            )}
          </div>

          {/* Package Description */}
          {pkg.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{pkg.description}</p>
          )}

          {/* Features List */}
          <div className="space-y-2 mb-6 flex-grow">
            {pkg.features && pkg.features.length > 0 ? (
              pkg.features.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700 text-xs leading-relaxed">{feature}</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700 text-xs leading-relaxed">4K Premium Technology</span>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700 text-xs leading-relaxed">8000+ Channels</span>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700 text-xs leading-relaxed">VOD Library</span>
                </div>
              </>
            )}
          </div>

          {/* Call to Action Button */}
          <div className="mt-auto">
            {(pkg.category === 'subscription' || pkg.category === 'activation-player') ? (
              <Button asChild className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
                <Link to={`/product/${productSlug}`}>
                  Get Started Now
                </Link>
              </Button>
            ) : (
              <Button 
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
              >
                Get Started Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSubscriptionCard;
