
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

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
  accentColor = 'text-red-600'
}) => {
  const handleTryNow = () => {
    const message = `Bonjour, je suis intéressé par l'abonnement ${name} à ${price.toFixed(2)}€/mois. Pouvez-vous me donner plus d'informations?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-2xl transform hover:scale-105 border-2 border-gray-100 h-full", 
      bgColor
    )}>
      <div className="p-8 h-full flex flex-col">
        <h3 className="mb-6 text-2xl font-bold text-gray-900 text-center">{name}</h3>
        <div className="mb-8 text-center">
          <div className="flex items-baseline justify-center">
            <span className={cn("text-5xl font-bold", accentColor)}>€{price.toFixed(2)}</span>
            <span className="ml-2 text-lg text-gray-600">/ mois</span>
          </div>
        </div>
        <ul className="mb-8 space-y-4 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-700">
              <span className={cn("text-xl font-bold", accentColor)}>✓</span>
              <span className="text-base">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 py-4 text-lg font-semibold"
          onClick={handleTryNow}
        >
          <MessageCircle size={20} />
          Commander Maintenant
        </Button>
      </div>
    </Card>
  );
};

export default ProductSubscriptionCard;
