export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export interface ChatCategory {
  id: string;
  label: string;
  icon: string;
  priority: Priority;
  subcategories?: { id: string; label: string }[];
}

export const CHAT_CATEGORIES: ChatCategory[] = [
  {
    id: 'subscription',
    label: 'Subscription & Sales',
    icon: '📂',
    priority: 'medium',
    subcategories: [
      { id: 'new', label: 'New Subscription' },
      { id: 'renew', label: 'Renew Subscription' },
      { id: 'trial', label: 'Free Trial Request' },
      { id: 'pricing', label: 'Pricing & Plans' },
      { id: 'promo', label: 'Promotions & Offers' },
    ],
  },
  {
    id: 'technical',
    label: 'Technical Support',
    icon: '🔧',
    priority: 'high',
    subcategories: [
      { id: 'buffering', label: 'Buffering / Freeze' },
      { id: 'channels', label: 'Channels Not Working' },
      { id: 'vod', label: 'VOD Not Working' },
      { id: 'audio', label: 'Audio Problem' },
      { id: 'subtitle', label: 'Subtitle Problem' },
      { id: 'quality', label: 'Low Quality / Resolution' },
      { id: 'epg', label: 'EPG Problem' },
      { id: 'login', label: 'Login Problem' },
      { id: 'xtream', label: 'Xtream Codes Error' },
      { id: 'm3u', label: 'M3U Playlist Problem' },
      { id: 'mac', label: 'MAC Activation Problem' },
      { id: 'expired', label: 'Expired Subscription' },
      { id: 'reset_creds', label: 'Reset Credentials' },
    ],
  },
  {
    id: 'device',
    label: 'Device & Application Help',
    icon: '📱',
    priority: 'medium',
    subcategories: [
      { id: 'smart_tv', label: 'Smart TV Setup' },
      { id: 'android_box', label: 'Android Box Setup' },
      { id: 'firestick', label: 'FireStick Setup' },
      { id: 'mag', label: 'MAG Box Setup' },
      { id: 'win_mac', label: 'Windows / Mac Setup' },
      { id: 'ios', label: 'iPhone / iPad Setup' },
      { id: 'smarters', label: 'IPTV Smarters' },
      { id: 'tivimate', label: 'TiviMate' },
      { id: 'stbemu', label: 'STBEmu' },
      { id: 'xciptv', label: 'XCIPTV' },
      { id: 'duplex', label: 'Duplex IPTV' },
    ],
  },
  {
    id: 'billing',
    label: 'Billing & Payments',
    icon: '💳',
    priority: 'high',
    subcategories: [
      { id: 'payment_problem', label: 'Payment Problem' },
      { id: 'pending', label: 'Payment Pending' },
      { id: 'refund', label: 'Refund Request' },
      { id: 'crypto', label: 'Crypto Payment' },
      { id: 'paypal', label: 'PayPal Issue' },
      { id: 'bank', label: 'Bank Transfer' },
    ],
  },
  {
    id: 'account',
    label: 'Account Management',
    icon: '🔄',
    priority: 'medium',
    subcategories: [
      { id: 'change_device', label: 'Change Device' },
      { id: 'change_mac', label: 'Change MAC Address' },
      { id: 'transfer', label: 'Transfer Subscription' },
      { id: 'update_info', label: 'Account Information Update' },
      { id: 'password', label: 'Password Reset' },
    ],
  },
  {
    id: 'security',
    label: 'Security & Reports',
    icon: '🛡️',
    priority: 'urgent',
    subcategories: [
      { id: 'suspicious', label: 'Suspicious Activity' },
      { id: 'blocked', label: 'Account Blocked' },
      { id: 'unauthorized', label: 'Unauthorized Access' },
      { id: 'abuse', label: 'Report Abuse' },
    ],
  },
  {
    id: 'general',
    label: 'General Assistance',
    icon: '💬',
    priority: 'low',
    subcategories: [
      { id: 'info', label: 'General Information' },
      { id: 'tutorial', label: 'Installation Tutorial' },
      { id: 'channel_req', label: 'Channel Availability Request' },
      { id: 'content_req', label: 'Content Request' },
      { id: 'other', label: 'Other Issue' },
    ],
  },
];

export const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-700', bg: 'bg-red-100 border-red-300' },
  high: { label: 'High', color: 'text-orange-700', bg: 'bg-orange-100 border-orange-300' },
  medium: { label: 'Medium', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-300' },
  low: { label: 'Low', color: 'text-green-700', bg: 'bg-green-100 border-green-300' },
};

export const STATUS_META: Record<string, { label: string; color: string }> = {
  open: { label: 'Open', color: 'bg-blue-100 text-blue-700' },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700' },
};

export function getCategory(id: string) {
  return CHAT_CATEGORIES.find((c) => c.id === id);
}

export function getSubcategoryLabel(catId: string, subId?: string | null) {
  if (!subId) return null;
  return getCategory(catId)?.subcategories?.find((s) => s.id === subId)?.label ?? subId;
}
