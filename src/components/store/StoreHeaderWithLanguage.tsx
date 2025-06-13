
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

const StoreHeaderWithLanguage = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              BWIVOX
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-red-600 transition-colors">
              {t.home}
            </Link>
            <Link to="/subscription" className="text-gray-700 hover:text-red-600 transition-colors">
              {t.subscription}
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-red-600 transition-colors">
              {t.products}
            </Link>
            <Link to="/support" className="text-gray-700 hover:text-red-600 transition-colors">
              {t.support}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button variant="outline" size="sm">
              {t.freeTrialBtn}
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              {t.tryNowBtn}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StoreHeaderWithLanguage;
