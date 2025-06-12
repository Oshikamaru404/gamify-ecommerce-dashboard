
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
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
    <Card className={`relative transition-all duration-300 hover:shadow-xl ${
      featured ? 'border-2 border-red-500 shadow-lg scale-105' : 'border border-gray-200'
    }`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
            <Star className="w-4 h-4 mr-1" />
            Most Popular
          </div>
        </div>
      )}
      
      <CardContent className="p-8">
        <div className="text-center mb-8">
          {pkg.icon && (
            <div className="text-4xl mb-4">{pkg.icon}</div>
          )}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {pkg.name}
          </h3>
          <div className="text-4xl font-bold text-red-600 mb-2">
            ${displayPrice?.toFixed(2)}
            <span className="text-lg text-gray-500 font-normal">
              {pkg.price_1_month ? '/month' : ''}
            </span>
          </div>
          {pkg.description && (
            <p className="text-gray-600">{pkg.description}</p>
          )}
        </div>

        <div className="space-y-4 mb-8">
          {pkg.features && pkg.features.length > 0 ? (
            pkg.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700">Premium features included</span>
            </div>
          )}
        </div>

        {(pkg.category === 'subscription' || pkg.category === 'activation-player') ? (
          <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white py-3">
            <Link to={`/product/${productSlug}`}>
              Get Started
            </Link>
          </Button>
        ) : (
          <Button 
            onClick={handleGetStarted}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
          >
            Get Started
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductSubscriptionCard;
