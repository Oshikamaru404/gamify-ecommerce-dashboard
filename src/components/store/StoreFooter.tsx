
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const StoreFooter: React.FC = () => {
  const handleTryNow = () => {
    const message = "Bonjour, je souhaite essayer vos services BWIVOX IPTV. Pouvez-vous m'aider?";
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className="mt-auto border-t bg-gray-50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-red-600">BWIVOX IPTV</h3>
            <p className="text-sm text-gray-600 mb-6">
              Services IPTV premium avec des milliers de chaînes en direct, 
              films et séries en qualité 8K Ultra HD.
            </p>
            <Button 
              onClick={handleTryNow}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              <MessageCircle className="mr-2" size={16} />
              Try Now
            </Button>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/subscription" className="text-gray-600 hover:text-red-600 transition-colors">
                  Subscription IPTV
                </Link>
              </li>
              <li>
                <Link to="/activation" className="text-gray-600 hover:text-red-600 transition-colors">
                  Activation Player
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Panel Reseller</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/iptv-panel" className="text-gray-600 hover:text-red-600 transition-colors">
                  Panel IPTV
                </Link>
              </li>
              <li>
                <Link to="/player-panel" className="text-gray-600 hover:text-red-600 transition-colors">
                  Panel Player
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-red-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-600 hover:text-red-600 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/how-to-buy" className="text-gray-600 hover:text-red-600 transition-colors">
                  How to Buy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-gray-600 hover:text-red-600 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} BWIVOX IPTV. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
