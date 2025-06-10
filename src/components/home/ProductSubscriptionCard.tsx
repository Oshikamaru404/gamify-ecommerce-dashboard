
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Star, CheckCircle2 } from 'lucide-react';

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
    <div className="group perspective">
      <Card className={cn(
        "relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 transform hover:scale-105 hover:-translate-y-2 border-2 border-gray-100 hover:border-red-200 h-full", 
        bgColor,
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-1000"
      )}>
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>
        
        {/* Popular badge for certain plans */}
        {(name.includes('ULTRA') || name.includes('MAX')) && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 animate-pulse">
            <Star size={12} className="fill-current" />
            Populaire
          </div>
        )}

        <div className="p-8 h-full flex flex-col relative z-10">
          <div className="text-center mb-8">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
              {name}
            </h3>
            <div className="relative">
              <div className="flex items-baseline justify-center mb-2">
                <span className={cn("text-5xl font-bold transition-all duration-300 group-hover:scale-110", accentColor)}>
                  €{price.toFixed(2)}
                </span>
                <span className="ml-2 text-lg text-gray-600">/ mois</span>
              </div>
              <div className="text-sm text-gray-500">Sans engagement</div>
            </div>
          </div>

          <div className="flex-grow">
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li 
                  key={index} 
                  className={cn(
                    "flex items-start gap-3 text-gray-700 opacity-0 animate-fade-in transition-all duration-300 hover:translate-x-1",
                    `animation-delay-${index * 100}`
                  )}
                  style={{ animationDelay: `${index * 100}ms`, opacity: 1 }}
                >
                  <CheckCircle2 
                    size={20} 
                    className={cn("mt-0.5 transition-colors duration-300", accentColor, "group-hover:animate-pulse")} 
                  />
                  <span className="text-base leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 space-y-3">
            <Button 
              variant="outline"
              className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 py-3 text-sm font-medium"
              onClick={handleTryNow}
            >
              <MessageCircle size={16} />
              Essayer Maintenant
            </Button>
            
            <Button 
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center gap-2 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={handleTryNow}
            >
              <MessageCircle size={20} />
              Commander Maintenant
            </Button>
          </div>
        </div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-4 left-4 w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </Card>
    </div>
  );
};

export default ProductSubscriptionCard;
