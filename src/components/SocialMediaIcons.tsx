
import React from 'react';
import { MessageCircle, Send } from 'lucide-react';

const SocialMediaIcons: React.FC = () => {
  const handleWhatsAppClick = () => {
    const message = "Hello! I'm interested in your IPTV services. Can you help me?";
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleTelegramClick = () => {
    const telegramUrl = "https://t.me/bwivoxiptv"; // Replace with your actual Telegram handle
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
