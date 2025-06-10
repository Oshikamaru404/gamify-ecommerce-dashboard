
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, CheckCircle2, Plus, Rocket, Zap, Tv, Play, Film } from 'lucide-react';

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

  // Function to get appropriate icon based on service name
  const getServiceIcon = () => {
    const serviceName = name.toLowerCase();
    
    if (serviceName.includes('strong') || serviceName.includes('🚀')) {
      return <Rocket className="text-white" size={32} />;
    } else if (serviceName.includes('trex') || serviceName.includes('🦖')) {
      return <Zap className="text-white" size={32} />;
    } else if (serviceName.includes('promax') || serviceName.includes('⚡')) {
      return <Zap className="text-white" size={32} />;
    } else if (serviceName.includes('tivione') || serviceName.includes('📺')) {
      return <Tv className="text-white" size={32} />;
    } else if (serviceName.includes('b1g') || serviceName.includes('🎬')) {
      return <Film className="text-white" size={32} />;
    } else {
      // Default icon for any other service
      return <Play className="text-white" size={32} />;
    }
  };

  return (
    <div className="group perspective h-full">
      <Card className={cn(
        "relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 transform hover:scale-105 border-2 border-gray-100 hover:border-red-200 h-full flex flex-col", 
        bgColor
      )}>
        {/* Golden Ratio Division: ~38% for icon section, ~62% for content */}
        
        {/* First Part - Large Icon Section (38% of height) */}
        <div className="relative flex-shrink-0 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center rounded-b-[2rem]" style={{ height: '38%', minHeight: '140px' }}>
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] rounded-b-[2rem]"></div>
          
          {/* Large Icon */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl border border-white/30 group-hover:scale-110 transition-transform duration-300">
              {getServiceIcon()}
            </div>
          </div>

          {/* Animated background elements */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Spacing between sections */}
        <div className="h-4"></div>

        {/* Second Part - Content Section (62% of height) */}
        <div className="flex-1 flex flex-col mx-4 bg-gray-50/30 rounded-t-[2rem] rounded-b-xl" style={{ minHeight: '58%' }}>
          {/* Service Name and Pricing */}
          <div className="px-6 py-6 text-center">
            <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
              {name}
            </h3>
            
            <div className="flex items-baseline justify-center">
              <span className="text-lg text-gray-600 mr-1">€</span>
              <span className={cn("text-3xl font-bold transition-all duration-300 group-hover:scale-110", accentColor)}>
                {price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 ml-1">/ mois</span>
            </div>
          </div>

          {/* Features Section */}
          <div className="flex-1 px-6 py-2">
            <ul className="space-y-2">
              {features.slice(0, 5).map((feature, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-2 text-gray-700 opacity-0 animate-fade-in transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms`, opacity: 1 }}
                >
                  <CheckCircle2 
                    size={14} 
                    className={cn("mt-1 flex-shrink-0 transition-colors duration-300", accentColor)} 
                  />
                  <span className="text-xs leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Action Section - Respecting golden ratio */}
          <div className="px-6 pb-6 pt-2" style={{ height: '38%', minHeight: '80px' }}>
            <Button 
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 text-xs shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-3 rounded-xl"
              onClick={handleTryNow}
            >
              ACHETEZ MAINTENANT
            </Button>
            
            <button
              className="w-full text-red-600 hover:text-red-700 text-xs font-medium transition-colors duration-300"
              onClick={handleTryNow}
            >
              Voir plus de détails
            </button>
            
            {/* Space under button as requested */}
            <div className="h-2"></div>
          </div>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none rounded-lg"></div>
      </Card>
    </div>
  );
};

export default ProductSubscriptionCard;
