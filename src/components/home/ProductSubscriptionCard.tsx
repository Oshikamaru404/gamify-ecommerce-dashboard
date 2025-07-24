
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Shield, ArrowRight } from 'lucide-react';
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
  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .trim();
  };

  const productSlug = generateSlug(pkg.name);

  // Get the one-month price to display
  const oneMonthPrice = pkg.price_1_month || pkg.price_3_months || pkg.price_6_months || pkg.price_12_months || pkg.price_10_credits || 0;

  // Calculate savings for yearly plan
  const calculateYearlySavings = () => {
    if (pkg.price_12_months && pkg.price_1_month) {
      const yearlyTotal = pkg.price_12_months;
      const monthlyTotal = pkg.price_1_month * 12;
      const savings = ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;
      return Math.round(savings);
    }
    return null;
  };

  const yearlySavings = calculateYearlySavings();

  // Determine the link path - subscription packages go directly to subscription page with package selection
  const linkPath = pkg.category === 'subscription' ? '/subscription' : `/products/${productSlug}`;

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
        <div className="h-64 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center relative rounded-2xl">
          <div className="w-32 h-32 bg-red-400/30 rounded-3xl flex items-center justify-center backdrop-blur-sm">
            {pkg.icon_url && (
              <img 
                src={pkg.icon_url} 
                alt={pkg.name}
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
              {pkg.icon || '📺'}
            </div>
          </div>
        </div>

        {/* Bottom Section - Content (White Background) */}
        <div className="flex-1 bg-white p-6 flex flex-col">
          {/* Package Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center leading-tight">
            {pkg.name}
          </h3>
          
          {/* Price Display - One Month Price */}
          <div className="text-center mb-4">
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-2xl px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              ${oneMonthPrice.toFixed(2)}/month
            </Badge>
            
            {/* Yearly Savings Badge */}
            {yearlySavings && (
              <div className="mt-2">
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2 rounded-full shadow-md">
                  Save up to {yearlySavings}% yearly
                </Badge>
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

          {/* Enhanced 30-Day Money Back Guarantee Badge - Moved above button */}
          <div className="flex justify-center mb-4">
            <div className="bg-white border-2 border-green-500 text-green-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center transform hover:scale-105 transition-all duration-300">
              <Shield className="w-4 h-4 mr-2" />
              30-Day Money Back Guarantee
            </div>
          </div>

          {/* View Details Button */}
          <div className="mt-auto">
            <Button asChild className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <Link to={linkPath}>
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSubscriptionCard;
