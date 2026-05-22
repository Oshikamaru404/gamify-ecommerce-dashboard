import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Loader2, Zap, ChevronDown, Megaphone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LanguageSelector from '@/components/LanguageSelector';
import CurrencySelector from '@/components/CurrencySelector';
import RegionSettingsSheet from '@/components/RegionSettingsSheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useUserAuth } from '@/contexts/UserAuthContext';
import HeaderAuthButton from '@/components/auth/HeaderAuthButton';
import GlobalSearch from '@/components/store/GlobalSearch';

const StoreHeaderWithLanguage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPanelDropdownOpen, setIsPanelDropdownOpen] = useState(false);
  const location = useLocation();
  const { t, isLoading } = useLanguage();
  const { data: siteSettings } = useSiteSettings();
  const { user } = useUserAuth();


  const whatsappNumber =
    siteSettings?.find((s) => s.setting_key === 'whatsapp_number')?.setting_value || '1234567890';

  const navigation = [
    { name: t.home, href: '/' },
    { name: t.subscription, href: '/subscription' },
    { name: t.activation, href: '/activation' },
  ];

  const isActive = (href: string) =>
    href === '/' ? location.pathname === href : location.pathname.startsWith(href);

  const handleFreeTrial = () => {
    const message =
      "Bonjour, je souhaite bénéficier de l'essai gratuit BWIVOX IPTV. Pouvez-vous m'aider?";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-lg">
      {/* ====== DESKTOP (unchanged structure) ====== */}
      <div className="container hidden lg:flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-3xl font-bold">
            <span className="text-red-600">BWIVOX</span>
            <span className="text-gray-800"> IPTV</span>
          </div>
        </Link>

        <nav className="flex items-center gap-8">
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
              <ChevronDown
                size={16}
                className={cn('transition-transform', isPanelDropdownOpen && 'rotate-180')}
              />
            </button>
            <div
              className={cn(
                'absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50 transition-all duration-200',
                isPanelDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
              )}
            >
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

        <div className="flex items-center gap-2">
          <GlobalSearch />
          <HeaderAuthButton />
          <CurrencySelector />
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            </div>
          ) : (
            <LanguageSelector />
          )}
        </div>
      </div>

      {/* ====== MOBILE — 2 LINES (z2u-style) ====== */}
      <div className="lg:hidden">
        {/* Line 1 : logo + currency + language + auth */}
        <div className="container flex h-14 items-center justify-between gap-2">
          <Link to="/" className="flex items-center">
            <div className="text-xl font-bold leading-none">
              <span className="text-red-600">BWIVOX</span>
              <span className="text-gray-800"> IPTV</span>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <RegionSettingsSheet />

            {/* Notifications */}
            <Link
              to="/account"
              aria-label="Notifications"
              className="relative h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700"
            >
              <Megaphone size={18} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Link>

            {/* Chat direct — only when logged in */}
            {user && (
              <Link
                to="/chat"
                aria-label="Chat"
                className="relative h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700"
              >
                <MessageCircle size={18} />
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-white">
                  1
                </span>
              </Link>
            )}

            <HeaderAuthButton />
          </div>

        </div>

        {/* Line 2 : burger + search */}
        <div className="container flex h-12 items-center gap-2 pb-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0 border border-gray-200"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <div className="flex-1">
            <GlobalSearch compact />
          </div>
        </div>
      </div>

      {/* ====== MOBILE MENU PANEL ====== */}
      <div
        className={cn(
          'absolute left-0 right-0 z-50 border-b bg-white pb-4 pt-2 shadow-lg lg:hidden',
          'top-[6.5rem]',
          isMenuOpen ? 'block' : 'hidden',
        )}
      >
        <nav className="flex flex-col space-y-2 px-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="py-3 text-lg font-semibold border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <div className="py-3 border-b border-gray-100">
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
