import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SubscriptionPackage } from '@/hooks/useSubscriptionPackages';
import { useLocalizedText } from '@/lib/multilingualUtils';

interface SubscriptionPackageCardProps {
  package: SubscriptionPackage;
  featured?: boolean;
}

const SubscriptionPackageCard: React.FC<SubscriptionPackageCardProps> = ({ 
  package: pkg, 
  featured = false 
}) => {
  const packageName = useLocalizedText(pkg.name);
  const packageDescription = useLocalizedText(pkg.description);

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .trim();
  };

  const productSlug = generateSlug(packageName);
  const oneMonthPrice = pkg.price_3_credits || pkg.price_6_credits || pkg.price_12_credits || 0;

  // Calculate yearly savings percentage
  const calculateYearlySavingsPercent = () => {
    if (pkg.price_12_credits && pkg.price_3_credits) {
      const yearlyTotal = pkg.price_3_credits * 4;
      const savings = yearlyTotal - pkg.price_12_credits;
      const savingsPercent = (savings / yearlyTotal) * 100;
      return Math.round(savingsPercent);
    }
    return null;
  };

  const yearlySavingsPercent = calculateYearlySavingsPercent();
  const linkPath = `/products/${productSlug}`;

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
        {/* Top Section - Icon */}
        <div className="h-64 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center relative rounded-2xl">
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
              {pkg.icon || '📺'}
            </div>
          </div>
        </div>

        {/* Bottom Section - Content */}
        <div className="flex-1 bg-white p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center leading-tight">
            {packageName}
          </h3>
          
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-red-600">
              ${oneMonthPrice}
            </div>
            <div className="text-sm text-gray-500 mt-1">Starting from</div>
          </div>

          {yearlySavingsPercent && (
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                <Shield className="w-4 h-4" />
                Save {yearlySavingsPercent}% Yearly
              </div>
            </div>
          )}

          {packageDescription && (
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {packageDescription}
            </p>
          )}

          {pkg.features && pkg.features.length > 0 && (
            <ul className="space-y-2 mb-4 flex-1">
              {pkg.features.slice(0, 3).map((feature, idx) => {
                const featureText = useLocalizedText(feature);
                return (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{featureText}</span>
                  </li>
                );
              })}
            </ul>
          )}

          <Link to={linkPath} className="w-full mt-auto">
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group"
            >
              View Plans
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPackageCard;
