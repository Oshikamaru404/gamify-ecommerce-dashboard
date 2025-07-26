
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

// Enhanced content keys with descriptions and default English values
const contentKeysWithDefaults = [
  // Product Card Text
  { key: 'most_popular_badge', description: 'Badge text for popular items', defaultValue: 'Most Popular' },
  { key: 'per_month', description: 'Time period text', defaultValue: '/month' },
  { key: 'save_yearly', description: 'Yearly savings text', defaultValue: 'Save ${{amount}} yearly' },
  { key: 'money_back_guarantee', description: 'Guarantee text', defaultValue: '30-Day Money Back Guarantee' },
  { key: 'view_details_button', description: 'Details button text', defaultValue: 'View Details' },
  { key: 'feature_4k_technology', description: '4K feature text', defaultValue: '4K Premium Technology' },
  { key: 'feature_8000_channels', description: 'Channels count feature', defaultValue: '8000+ Channels' },
  { key: 'feature_vod_library', description: 'VOD library feature', defaultValue: 'VOD Library' },
  
  // Footer Content
  { key: 'brand_name', description: 'Company brand name', defaultValue: 'BWIVOX IPTV' },
  { key: 'footer_brand_description', description: 'Footer brand description', defaultValue: 'Your premium IPTV service provider with guaranteed quality and 24/7 support.' },
  { key: 'try_now_button', description: 'Try now button text', defaultValue: 'Try Now' },
  { key: 'whatsapp_try_message', description: 'WhatsApp contact message', defaultValue: 'Hello, I would like to try your BWIVOX IPTV services. Can you help me?' },
  
  // Navigation & Services
  { key: 'services_section_title', description: 'Services section heading', defaultValue: 'Services' },
  { key: 'subscription_service_title', description: 'Subscription service name', defaultValue: 'Subscription IPTV' },
  { key: 'activation_service_title', description: 'Activation service name', defaultValue: 'Activation Player' },
  { key: 'panel_reseller_title', description: 'Reseller panel name', defaultValue: 'Panel Reseller' },
  { key: 'panel_iptv_service', description: 'IPTV panel service', defaultValue: 'Panel IPTV' },
  { key: 'panel_player_service', description: 'Player panel service', defaultValue: 'Panel Player' },
  
  // Information & Support
  { key: 'information_section_title', description: 'Information section heading', defaultValue: 'Information' },
  { key: 'blog_section_title', description: 'Blog section heading', defaultValue: 'Blog' },
  { key: 'blog_iptv_title', description: 'IPTV blog title', defaultValue: 'Blog IPTV' },
  { key: 'blog_player_title', description: 'Player blog title', defaultValue: 'Blog Player' },
  { key: 'support_link_title', description: 'Support page link', defaultValue: 'Support' },
  { key: 'how_to_buy_link_title', description: 'How to buy guide link', defaultValue: 'How to Buy' },
  { key: 'full_reviews_link_title', description: 'Reviews page link', defaultValue: 'Full Reviews' },
  { key: 'refund_policy_link_title', description: 'Refund policy link', defaultValue: 'Refund Policy' },
  { key: 'privacy_policy_link_title', description: 'Privacy policy link', defaultValue: 'Privacy Policy' },
  { key: 'copyright_text', description: 'Copyright footer text', defaultValue: `© ${new Date().getFullYear()} BWIVOX IPTV. All rights reserved.` },
  
  // Common UI Text
  { key: 'try_now_text', description: 'Try now action text', defaultValue: 'Try Now' },
  { key: 'get_started_text', description: 'Get started button', defaultValue: 'Get Started' },
  { key: 'learn_more_text', description: 'Learn more link', defaultValue: 'Learn More' },
  { key: 'contact_support_text', description: 'Contact support text', defaultValue: 'Contact Support' },
  { key: 'whatsapp_contact_text', description: 'WhatsApp contact text', defaultValue: 'WhatsApp' },
  { key: 'email_contact_text', description: 'Email contact text', defaultValue: 'Email' },
  { key: 'phone_contact_text', description: 'Phone contact text', defaultValue: 'Phone' },
  { key: 'add_to_cart_text', description: 'Add to cart button', defaultValue: 'Add to Cart' },
  { key: 'buy_now_text', description: 'Buy now button', defaultValue: 'Buy Now' },
  
  // Status & Actions
  { key: 'loading_text', description: 'Loading indicator', defaultValue: 'Loading...' },
  { key: 'saving_text', description: 'Saving indicator', defaultValue: 'Saving...' },
  { key: 'success_text', description: 'Success message', defaultValue: 'Success' },
  { key: 'error_text', description: 'Error message', defaultValue: 'Error' },
  { key: 'confirm_text', description: 'Confirm button', defaultValue: 'Confirm' },
  { key: 'cancel_text', description: 'Cancel button', defaultValue: 'Cancel' },
  { key: 'ok_text', description: 'OK button', defaultValue: 'OK' },
  { key: 'yes_text', description: 'Yes button', defaultValue: 'Yes' },
  { key: 'no_text', description: 'No button', defaultValue: 'No' },
  { key: 'continue_text', description: 'Continue button', defaultValue: 'Continue' },
  { key: 'back_text', description: 'Back button', defaultValue: 'Back' },
  { key: 'next_text', description: 'Next button', defaultValue: 'Next' },
  { key: 'close_text', description: 'Close button', defaultValue: 'Close' },
];

interface ContentKeySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ContentKeySelector: React.FC<ContentKeySelectorProps> = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredKeys = contentKeysWithDefaults.filter(
    item => 
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.defaultValue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="contentKey">Content Key</Label>
      
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search content keys..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Select dropdown */}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a content key" />
        </SelectTrigger>
        <SelectContent className="max-h-80 overflow-y-auto">
          {filteredKeys.map((item) => (
            <SelectItem key={item.key} value={item.key} className="flex flex-col items-start p-3">
              <div className="w-full">
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-medium text-sm">{item.key}</span>
                  <Badge variant="outline" className="text-xs">{item.key.split('_')[0]}</Badge>
                </div>
                <div className="text-xs text-gray-600 mb-1">{item.description}</div>
                <div className="text-xs text-gray-800 font-medium bg-gray-50 px-2 py-1 rounded truncate w-full">
                  "{item.defaultValue}"
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Custom key input */}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or type a custom key"
        className="mt-2"
      />
      
      {/* Show selected key info */}
      {value && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          {(() => {
            const selectedKey = contentKeysWithDefaults.find(item => item.key === value);
            if (selectedKey) {
              return (
                <div>
                  <div className="text-sm font-medium text-blue-800">{selectedKey.key}</div>
                  <div className="text-xs text-blue-600 mt-1">{selectedKey.description}</div>
                  <div className="text-xs text-blue-800 mt-1 font-medium">Default: "{selectedKey.defaultValue}"</div>
                </div>
              );
            } else {
              return (
                <div>
                  <div className="text-sm font-medium text-blue-800">Custom Key: {value}</div>
                  <div className="text-xs text-blue-600">Custom content key</div>
                </div>
              );
            }
          })()}
        </div>
      )}
    </div>
  );
};

export default ContentKeySelector;
