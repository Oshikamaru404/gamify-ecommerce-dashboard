
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const SocialMediaIcons: React.FC = () => {
  const { data: siteSettings, refetch } = useSiteSettings();
  
  // Get WhatsApp number from site settings with fallback
  const whatsappNumber = siteSettings?.find(s => s.setting_key === 'whatsapp_number')?.setting_value || '1234567890';

  // Force immediate refetch on mount and more frequent updates
  React.useEffect(() => {
    // Immediately refetch when component mounts
    refetch();
    
    // Set up more frequent polling
    const interval = setInterval(() => {
      refetch();
    }, 10000); // Refetch every 10 seconds instead of 30

    return () => clearInterval(interval);
  }, [refetch]);

  // Add focus event listener to refetch when window gains focus
  React.useEffect(() => {
    const handleFocus = () => {
      refetch();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  const handleWhatsAppClick = () => {
    console.log('WhatsApp number used:', whatsappNumber);
    console.log('All site settings:', siteSettings);
    const message = "Hello! I'm interested in your IPTV services. Can you help me?";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="group bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="Contact us on WhatsApp"
        title={`Contact us on WhatsApp: ${whatsappNumber}`}
      >
        <MessageCircle size={24} className="group-hover:animate-pulse" />
      </button>
    </div>
  );
};

export default SocialMediaIcons;
