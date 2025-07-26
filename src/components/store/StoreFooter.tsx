
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useTranslatedText } from '@/hooks/useTranslatedText';

const StoreFooter: React.FC = () => {
  const { t: staticT } = useLanguage();
  const { t } = useTranslatedText();
  const { data: siteSettings } = useSiteSettings();
  const [showBlogSubmenu, setShowBlogSubmenu] = useState(false);

  // Get WhatsApp number from site settings
  const whatsappNumber = siteSettings?.find(s => s.setting_key === 'whatsapp_number')?.setting_value || '1234567890';

  const handleTryNow = () => {
    const message = t('whatsapp_try_message', "Bonjour, je souhaite essayer vos services BWIVOX IPTV. Pouvez-vous m'aider?");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleBlogSubmenu = () => {
    setShowBlogSubmenu(!showBlogSubmenu);
  };

  return (
    <footer className="mt-auto border-t bg-gray-50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-red-600">{t('brand_name', 'BWIVOX IPTV')}</h3>
            <p className="text-sm text-gray-600 mb-6">
              {t('footer_brand_description', staticT.footerDescription)}
            </p>
            <Button onClick={handleTryNow} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
              <MessageCircle className="mr-2" size={16} />
              {t('try_now_button', staticT.tryNow)}
            </Button>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">{t('services_section_title', 'Services')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/subscription" className="text-gray-600 hover:text-red-600 transition-colors">
                  {t('subscription_service_title', 'Subscription IPTV')}
                </Link>
              </li>
              <li>
                <Link to="/activation" className="text-gray-600 hover:text-red-600 transition-colors">
                  {t('activation_service_title', 'Activation Player')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">{t('panel_reseller_title', 'Panel Reseller')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/iptv-panel" className="text-gray-600 hover:text-red-600 transition-colors">
                  {t('panel_iptv_service', 'Panel IPTV')}
                </Link>
              </li>
              <li>
                <Link to="/player-panel" className="text-gray-600 hover:text-red-600 transition-colors">
                  {t('panel_player_service', 'Panel Player')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">{t('information_section_title', 'Information')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <div className="text-gray-700 font-medium mb-1">
                  <button 
                    onClick={toggleBlogSubmenu}
                    className="flex items-center w-full text-left hover:text-red-600 transition-colors"
                  >
                    {t('blog_section_title', 'Blog')}
                    {showBlogSubmenu ? (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronRight className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </div>
                {showBlogSubmenu && (
                  <ul className="ml-4 space-y-1 mt-2">
                    <li>
                      <Link to="/blog-iptv" className="text-gray-600 hover:text-red-600 transition-colors">
                        {t('blog_iptv_title', 'Blog IPTV')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/blog-player" className="text-gray-600 hover:text-red-600 transition-colors">
                        {t('blog_player_title', 'Blog Player')}
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link to="/support" className="text-gray-600 hover:text-red-600 transition-colors">
                  {t('support_link_title', 'Support')}
                </Link>
              </li>
              <li>
                <Link to="/how-to-buy" className="text-gray-600 hover:text-red-600 transition-colors">
                  {t('how_to_buy_link_title', 'How to Buy')}
                </Link>
              </li>
              <li>
                <Link to="/full-reviews" className="text-gray-600 hover:text-red-600 transition-colors">
                  {t('full_reviews_link_title', 'Full Reviews')}
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-gray-600 hover:text-red-600 transition-colors">
                  {t('refund_policy_link_title', 'Refund Policy')}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-red-600 transition-colors">
                  {t('privacy_policy_link_title', 'Privacy Policy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
          <p>{t('copyright_text', `© ${new Date().getFullYear()} BWIVOX IPTV. Tous droits réservés.`)}</p>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
