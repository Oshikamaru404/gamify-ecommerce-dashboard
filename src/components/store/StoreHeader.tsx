
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, User, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import LanguageSelector from '@/components/LanguageSelector';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const StoreHeader: React.FC = () => {
  const { t } = useLanguage();
  const { state } = useStore();
  const { data: siteSettings } = useSiteSettings();

  // Get WhatsApp number from site settings
  const whatsappNumber = siteSettings?.find(s => s.setting_key === 'whatsapp_number')?.setting_value || '1234567890';

  const handleTryNow = () => {
    const message = t.tryFree;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">BWIVOX</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-red-600 transition-colors">
                {t.home}
              </Link>
              <Link to="/subscription" className="text-gray-700 hover:text-red-600 transition-colors">
                {t.subscription}
              </Link>
              <Link to="/activation" className="text-gray-700 hover:text-red-600 transition-colors">
                {t.activation}
              </Link>
              <Link to="/reseller" className="text-gray-700 hover:text-red-600 transition-colors">
                {t.reseller}
              </Link>
              <Link to="/support" className="text-gray-700 hover:text-red-600 transition-colors">
                {t.support}
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={handleTryNow}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="mr-2" size={16} />
              {t.tryNow}
            </Button>
            
            <LanguageSelector />
            
            <Link to="/cart" className="relative">
              <Button variant="outline" size="sm">
                <ShoppingCart size={16} />
                {state.cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {state.cart.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StoreHeader;
