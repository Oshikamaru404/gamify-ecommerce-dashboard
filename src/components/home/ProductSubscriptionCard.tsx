
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, CheckCircle2, Plus } from 'lucide-react';

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
    <div className="group perspective h-full">
      <Card className={cn(
        "relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 transform hover:scale-105 border-2 border-gray-100 hover:border-red-200 h-full flex flex-col", 
        bgColor
      )}>
        {/* Top Section with Logo and Pricing */}
        <div className="relative p-8 pb-4">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>
          
          {/* Logo/Icon Area */}
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="text-white text-2xl font-bold">
                {name.charAt(0)}
              </div>
              {/* Plus icon overlay */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <Plus size={16} className="text-red-600" />
              </div>
            </div>
          </div>

          {/* Service Name */}
          <h3 className="text-center mb-4 text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
            {name}
          </h3>

          {/* Pricing */}
          <div className="text-center mb-4">
            <div className="flex items-baseline justify-center">
              <span className="text-lg text-gray-600 mr-1">€</span>
              <span className={cn("text-4xl font-bold transition-all duration-300 group-hover:scale-110", accentColor)}>
                {price.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-1">/ mois</div>
          </div>
        </div>

        {/* Features Section */}
        <div className="flex-grow px-8 pb-6">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li 
                key={index} 
                className="flex items-start gap-3 text-gray-700 opacity-0 animate-fade-in transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms`, opacity: 1 }}
              >
                <CheckCircle2 
                  size={16} 
                  className={cn("mt-1 flex-shrink-0 transition-colors duration-300", accentColor)} 
                />
                <span className="text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Action Section */}
        <div className="px-8 pb-8 pt-4 border-t border-gray-100 bg-gray-50/50">
          <Button 
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-3"
            onClick={handleTryNow}
          >
            ACHETEZ MAINTENANT
          </Button>
          
          <button
            className="w-full text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-300"
            onClick={handleTryNow}
          >
            Voir plus de détails
          </button>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          <div className="absolute top-4 left-4 w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
      </Card>
    </div>
  );
};

export default ProductSubscriptionCard;
