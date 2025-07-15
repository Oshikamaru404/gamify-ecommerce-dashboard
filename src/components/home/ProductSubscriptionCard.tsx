
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, CheckCircle2, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { IPTVPackage } from '@/hooks/useIPTVPackages';
import CheckoutForm from '@/components/CheckoutForm';

interface ProductSubscriptionCardProps {
  package: IPTVPackage;
  featured?: boolean;
}

const ProductSubscriptionCard: React.FC<ProductSubscriptionCardProps> = ({ 
  package: pkg, 
  featured = false 
}) => {
  const { t } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleQuickCheckout = (duration: number, price: number) => {
    setSelectedPackage({
      id: pkg.id,
      name: `${pkg.name} - ${duration} Month${duration > 1 ? 's' : ''}`,
      category: pkg.category,
      price: price,
      duration: duration
    });
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setIsCheckoutOpen(false);
    setSelectedPackage(null);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedPackage(null);
  };

  const monthlyOptions = [
    { months: 1, price: pkg.price_1_month },
    { months: 3, price: pkg.price_3_months },
    { months: 6, price: pkg.price_6_months },
    { months: 12, price: pkg.price_12_months },
  ].filter(option => option.price);

  const getBestValue = () => {
    if (monthlyOptions.length === 0) return null;
    
    const monthlyRates = monthlyOptions.map(option => ({
      months: option.months,
      monthlyRate: option.price! / option.months
    }));
    
    const bestValue = monthlyRates.reduce((best, current) => 
      current.monthlyRate < best.monthlyRate ? current : best
    );
    
    return bestValue.months;
  };

  const bestValueMonths = getBestValue();

  return (
    <>
      <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
        featured ? 'border-2 border-red-500 shadow-lg' : 'border border-gray-200'
      }`}>
        {featured && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-500 to-red-600 text-white text-center py-2 text-sm font-bold">
            {t.mostPopular}
          </div>
        )}
        
        <CardHeader className={`text-center ${featured ? 'pt-12' : 'pt-6'} pb-2`}>
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-6 mb-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl h-24 w-24 flex items-center justify-center">{pkg.icon || '📺'}</div>
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-red-100 text-sm">{pkg.description}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {pkg.features && pkg.features.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">{t.features}:</h4>
              <ul className="space-y-2">
                {pkg.features.slice(0, 4).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="space-y-3">
            {monthlyOptions.map((option, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-red-600" />
                  <span className="font-medium text-gray-900">
                    {option.months} Month{option.months > 1 ? 's' : ''}
                  </span>
                  {option.months === bestValueMonths && (
                    <Badge variant="destructive" className="text-xs px-2 py-1">
                      {t.bestValue}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">${option.price}</span>
                  <Button 
                    size="sm"
                    onClick={() => handleQuickCheckout(option.months, option.price!)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <ShoppingCart size={14} className="mr-1" />
                    {t.buyNow}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {monthlyOptions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>{t.noPricingAvailable}</p>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Star size={16} className="text-yellow-500" />
              <span>{t.premiumQuality}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Modal */}
      {isCheckoutOpen && selectedPackage && (
        <CheckoutForm
          packageData={selectedPackage}
          onClose={handleCloseCheckout}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </>
  );
};

export default ProductSubscriptionCard;
