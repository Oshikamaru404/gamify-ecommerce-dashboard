
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ProductSubscriptionCardProps = {
  name: string;
  price: number;
  features: string[];
  bgColor?: string;
  accentColor?: string;
};

const ProductSubscriptionCard: React.FC<ProductSubscriptionCardProps> = ({ 
  name, 
  price,
  features,
  bgColor = 'bg-white',
  accentColor = 'text-red-500'
}) => (
  <Card className={cn(
    "overflow-hidden transition-all hover:shadow-xl transform hover:scale-105 border border-gray-100", 
    bgColor
  )}>
    <div className="p-6">
      <h3 className="mb-4 text-xl font-bold text-gray-900">{name}</h3>
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className={cn("text-4xl font-bold", accentColor)}>${price.toFixed(2)}</span>
          <span className="ml-2 text-sm text-gray-600">/ mois</span>
        </div>
      </div>
      <ul className="mb-8 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
            <span className={cn("text-lg", accentColor)}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button 
        className="w-full bg-red-500 hover:bg-red-600 text-white"
      >
        S'abonner Maintenant
      </Button>
    </div>
  </Card>
);

export default ProductSubscriptionCard;
