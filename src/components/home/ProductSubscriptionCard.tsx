
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Rocket, Zap, Tv, Play, Film } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();

  // Generate product ID from name for linking - updated to match ProductDetail
  const productId = name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/^-+|-+$/g, '');

  console.log('ProductSubscriptionCard - name:', name);
  console.log('ProductSubscriptionCard - generated productId:', productId);

  // Function to get appropriate icon based on service name
  const getServiceIcon = () => {
    const serviceName = name.toLowerCase();
    
    if (serviceName.includes('strong') || serviceName.includes('🚀')) {
      return <Rocket className="text-white" size={32} />;
    } else if (serviceName.includes('trex') || serviceName.includes('🦖')) {
      return <Zap className="text-white" size={32} />;
    } else if (serviceName.includes('promax') || serviceName.includes('⚡')) {
      return <Play className="text-white" size={32} />;
    } else if (serviceName.includes('tivione') || serviceName.includes('📺')) {
      return <Tv className="text-white" size={32} />;
    } else if (serviceName.includes('b1g') || serviceName.includes('🎬')) {
      return <Film className="text-white" size={32} />;
    } else {
      // Default icon for any other service
      return <Rocket className="text-white" size={32} />;
    }
  };

  return (
    <div className="group perspective h-full">
      <Card className={cn(
        "relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 transform hover:scale-105 border-2 border-gray-100 hover:border-red-200 h-full flex flex-col min-h-[500px]", 
        bgColor
      )}>
        
        {/* Icon Section - Fixed height */}
        <div className="relative flex-shrink-0 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center rounded-b-[2rem] h-32">
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

        {/* Content Section - Flexible height */}
        <div className="flex-1 flex flex-col p-6 bg-gray-50/30 rounded-t-[2rem] rounded-b-xl">
          {/* Service Name and Pricing - Fixed height */}
          <div className="text-center mb-4">
            <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300 min-h-[2.5rem] flex items-center justify-center">
              {name}
            </h3>
            
            <div className="flex items-baseline justify-center">
              <span className="text-lg text-gray-600 mr-1">$</span>
              <span className={cn("text-3xl font-bold transition-all duration-300 group-hover:scale-110", accentColor)}>
                {price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 ml-1">/month</span>
            </div>
          </div>

          {/* Features Section - Flexible height */}
          <div className="flex-1 mb-6">
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 text-gray-700 opacity-0 animate-fade-in transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms`, opacity: 1 }}
                >
                  <CheckCircle2 
                    size={16} 
                    className={cn("mt-0.5 flex-shrink-0 transition-colors duration-300", accentColor)} 
                  />
                  <span className="text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Section - Fixed height */}
          <div className="mt-auto">
            <Link 
              to={`/product/${productId}`}
              className="block w-full"
            >
              <Button 
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-4 rounded-xl"
              >
                Buy Now
              </Button>
            </Link>
            
            <Link 
              to={`/product/${productId}`}
              className="block w-full text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-300 text-center py-2"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none rounded-lg"></div>
      </Card>
    </div>
  );
};

export default ProductSubscriptionCard;
