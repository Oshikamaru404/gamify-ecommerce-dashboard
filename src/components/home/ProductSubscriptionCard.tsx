
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ProductSubscriptionCardProps = {
  name: string;
  price: number;
  isTrial?: boolean;
  features: string[];
  bgColor?: string;
  accentColor?: string;
};

const ProductSubscriptionCard: React.FC<ProductSubscriptionCardProps> = ({ 
  name, 
  price, 
  isTrial,
  features,
  bgColor = 'bg-[#1A1F2C]',
  accentColor = 'text-[#0EA5E9]'
}) => (
  <Card className={cn("overflow-hidden transition-all hover:shadow-xl transform hover:scale-105", bgColor)}>
    <div className="p-10 text-white">
      <h3 className="mb-4 text-2xl font-bold">{name}</h3>
      <div className="mb-8">
        {isTrial ? (
          <div className={cn("text-3xl font-extrabold", accentColor)}>ESSAI GRATUIT</div>
        ) : (
          <div className="flex items-baseline">
            <span className={cn("text-5xl font-bold", accentColor)}>${price.toFixed(2)}</span>
            <span className="ml-2 text-base text-gray-300">/ mois</span>
          </div>
        )}
      </div>
      <ul className="mb-10 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-base">
            <span className={cn("text-lg", accentColor)}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button className={cn("w-full rounded-full text-lg py-6 bg-opacity-90 hover:bg-opacity-100", 
        isTrial ? "bg-[#8B5CF6] hover:bg-[#7C3AED]" : "bg-[#0EA5E9] hover:bg-[#0284C7]")}>
        {isTrial ? 'Essayer Gratuitement' : 'S\'abonner Maintenant'}
      </Button>
    </div>
  </Card>
);

export default ProductSubscriptionCard;
