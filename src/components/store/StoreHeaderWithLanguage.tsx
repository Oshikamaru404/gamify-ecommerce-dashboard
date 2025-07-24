
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Tv, Loader2, Zap, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const StoreHeaderWithLanguage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPanelDropdownOpen, setIsPanelDropdownOpen] = useState(false);
  const location = useLocation();
  const { t, isLoading } = useLanguage();
  const { data: siteSettings } = useSiteSettings();

  // Get WhatsApp number from site settings
  const whatsappNumber = siteSettings?.find(s => s.setting_key === 'whatsapp_number')?.setting_value || '1234567890';

  const navigation = [
    { name: t.home, href: '/' },
    { name: t.subscription, href: '/subscription' },
    { name: t.activation, href: '/activation' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const handleFreeTrial = () => {
    const message = "Bonjour, je souhaite bénéficier de l'essai gratuit BWIVOX IPTV. Pouvez-vous m'aider?";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-lg">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-3xl font-bold">
            <span className="text-red-600">BWIVOX</span>
            <span className="text-gray-800"> IPTV</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:items-center lg:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-lg font-semibold transition-colors hover:text-red-600 ${
                isActive(item.href) ? 'text-red-600' : 'text-gray-900'
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Panel Reseller Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsPanelDropdownOpen(true)}
            onMouseLeave={() => setIsPanelDropdownOpen(false)}
          >
            <button 
              className="flex items-center gap-1 text-lg font-semibold transition-colors hover:text-red-600"
              onClick={() => setIsPanelDropdownOpen(!isPanelDropdownOpen)}
            >
              {t.reseller}
              <ChevronDown size={16} className={cn("transition-transform", isPanelDropdownOpen && "rotate-180")} />
            </button>
            
            <div className={cn(
              "absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50 transition-all duration-200",
              isPanelDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
            )}>
              <Link 
                to="/iptv-panel" 
                className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                onClick={() => setIsPanelDropdownOpen(false)}
              >
                {t.panelIptv}
              </Link>
              <Link 
                to="/player-panel" 
                className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                onClick={() => setIsPanelDropdownOpen(false)}
              >
                {t.playerPanel}
              </Link>
            </div>
          </div>

          <Button 
            onClick={handleFreeTrial}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-2 text-lg"
          >
            <Zap className="mr-2" size={20} />
            {t.freeTrial}
          </Button>
        </nav>

        {/* Mobile Menu Button & Language Selector */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              <span className="text-sm text-gray-500">...</span>
            </div>
          ) : (
            <LanguageSelector />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 lg:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "absolute left-0 right-0 top-20 z-50 border-b bg-white pb-4 pt-2 shadow-lg lg:hidden",
        isMenuOpen ? "block" : "hidden"
      )}>
        <nav className="flex flex-col space-y-4 px-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="py-3 text-lg font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Mobile Panel Reseller Section */}
          <div className="py-3">
            <div className="text-lg font-semibold text-gray-800 mb-2">{t.reseller}</div>
            <div className="ml-4 space-y-2">
              <Link
                to="/iptv-panel"
                className="block py-2 text-base text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.panelIptv}
              </Link>
              <Link
                to="/player-panel"
                className="block py-2 text-base text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.playerPanel}
              </Link>
            </div>
          </div>

          <Button 
            onClick={() => {
              handleFreeTrial();
              setIsMenuOpen(false);
            }}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold mt-2"
          >
            <Zap className="mr-2" size={20} />
            {t.freeTrial}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default StoreHeaderWithLanguage;
