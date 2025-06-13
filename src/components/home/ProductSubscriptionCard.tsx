
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Star, 
  ArrowRight, 
  MessageCircle
} from 'lucide-react';

interface ProductSubscriptionCardProps {
  package: any;
  featured?: boolean;
  onBuyNow?: (packageData: any) => void;
}

const ProductSubscriptionCard: React.FC<ProductSubscriptionCardProps> = ({ 
  package: pkg, 
  featured = false,
  onBuyNow 
}) => {
  const getDurationPrice = (months: number) => {
    switch (months) {
      case 1: return pkg.price_1_month;
      case 3: return pkg.price_3_months;
      case 6: return pkg.price_6_months;
      case 12: return pkg.price_12_months;
      default: return null;
    }
  };

  const handleBuyNow = (duration: number, price: number) => {
    if (onBuyNow) {
      onBuyNow({
        id: pkg.id,
        name: pkg.name,
        category: pkg.category,
        price: price,
        duration: duration
      });
    } else {
      // Fallback to WhatsApp
      const message = `Hello, I'm interested in ${pkg.name} - ${duration} Month(s) - $${price.toFixed(2)}`;
      const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <Card className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 ${
      featured ? 'ring-2 ring-yellow-400' : ''
    }`}>
      {featured && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-bl-lg font-semibold flex items-center z-10">
          <Star className="mr-1 h-4 w-4" />
          Popular
        </div>
      )}
      
      <CardHeader className="text-center pb-2">
        <div className="text-4xl mb-4">{pkg.icon || '📺'}</div>
        <CardTitle className="text-2xl text-gray-900">{pkg.name}</CardTitle>
        <p className="text-gray-600 mt-2">
          {pkg.description || 'Premium IPTV service with advanced features'}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Features */}
        {pkg.features && pkg.features.length > 0 ? (
          <div className="space-y-3">
            {pkg.features.slice(0, 4).map((feature: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span className="text-sm text-gray-700">HD/4K streaming quality</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span className="text-sm text-gray-700">Multi-device support</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span className="text-sm text-gray-700">24/7 customer support</span>
            </div>
          </div>
        )}

        {/* Pricing Options */}
        <div className="space-y-3">
          {[1, 3, 6, 12].map((months) => {
            const price = getDurationPrice(months);
            if (!price || price <= 0) return null;
            
            return (
              <div 
                key={months} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <span className="font-semibold">
                    {months === 1 ? '1 Month' : `${months} Months`}
                  </span>
                  {months > 1 && (
                    <div className="text-sm text-gray-600">
                      ${(price / months).toFixed(2)}/month
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">${price.toFixed(2)}</div>
                  <Button
                    size="sm"
                    onClick={() => handleBuyNow(months, price)}
                    className="bg-red-600 hover:bg-red-700 text-white mt-1"
                  >
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
  );
};

export default ProductSubscriptionCard;
