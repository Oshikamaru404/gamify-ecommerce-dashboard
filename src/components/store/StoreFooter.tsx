
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SocialMediaIcons from '@/components/SocialMediaIcons';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

const StoreFooter = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-red-500">BWIVOX</div>
            <p className="text-gray-400 text-sm">
              {t.footerDescription}
            </p>
            <SocialMediaIcons />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t.quickLinks}</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors">
                {t.home}
              </Link>
              <Link to="/subscription" className="block text-gray-400 hover:text-white transition-colors">
                {t.subscription}
              </Link>
              <Link to="/products" className="block text-gray-400 hover:text-white transition-colors">
                {t.products}
              </Link>
              <Link to="/support" className="block text-gray-400 hover:text-white transition-colors">
                {t.support}
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">{t.services}</h3>
            <div className="space-y-2">
              <Link to="/subscription" className="block text-gray-400 hover:text-white transition-colors">
                {t.iptvSubscription}
              </Link>
              <Link to="/iptv-panel" className="block text-gray-400 hover:text-white transition-colors">
                {t.panelIptv}
              </Link>
              <Link to="/player-panel" className="block text-gray-400 hover:text-white transition-colors">
                {t.playerActivation}
              </Link>
              <Button variant="outline" size="sm" className="mt-2 text-white border-white hover:bg-white hover:text-gray-900">
                {t.freeTrialBtn}
              </Button>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">{t.subscribeNewsletter}</h3>
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder={t.emailPlaceholder}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button className="w-full bg-red-600 hover:bg-red-700">
                {t.subscribe}
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BWIVOX. {t.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
