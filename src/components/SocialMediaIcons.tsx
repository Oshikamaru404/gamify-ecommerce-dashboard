
import React from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const SocialMediaIcons: React.FC = () => {
  const { data: siteSettings } = useSiteSettings();
  
  // Get WhatsApp number and Telegram username from site settings
  const whatsappNumber = siteSettings?.find(s => s.setting_key === 'whatsapp_number')?.setting_value || '1234567890';
  const telegramUsername = siteSettings?.find(s => s.setting_key === 'telegram_username')?.setting_value || 'bwivoxiptv';

  const handleWhatsAppClick = () => {
    const message = "Hello! I'm interested in your IPTV services. Can you help me?";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleTelegramClick = () => {
    const telegramUrl = `https://t.me/${telegramUsername}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="group bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle size={24} className="group-hover:animate-pulse" />
      </button>

      {/* Telegram Button */}
      <button
        onClick={handleTelegramClick}
        className="group bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="Contact us on Telegram"
      >
        <Send size={24} className="group-hover:animate-pulse" />
      </button>
    </div>
  );
};

export default SocialMediaIcons;
