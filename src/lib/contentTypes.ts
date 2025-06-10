
export interface SubscriptionContent {
  id: string;
  name: string;
  price: number;
  features: string[];
  bgColor?: string;
  accentColor?: string;
  enabled: boolean;
}

export interface ContentData {
  subscriptions: SubscriptionContent[];
  lastUpdated: string;
}

export const defaultSubscriptions: SubscriptionContent[] = [
  {
    id: '1',
    name: 'STRONG 🚀',
    price: 9.99,
    features: [
      '4K Ultra HD streaming',
      '5 simultaneous connections',
      '24/7 customer support',
      'Premium sports channels',
      'International content'
    ],
    bgColor: 'bg-white',
    accentColor: 'text-red-600',
    enabled: true
  },
  {
    id: '2',
    name: 'T-REX 🦖',
    price: 14.99,
    features: [
      '4K Ultra HD streaming',
      '10 simultaneous connections',
      'Priority customer support',
      'All sports & premium channels',
      'Global content library',
      'Ad-free experience'
    ],
    bgColor: 'bg-white',
    accentColor: 'text-red-600',
    enabled: true
  },
  {
    id: '3',
    name: 'PROMAX ⚡',
    price: 19.99,
    features: [
      '4K Ultra HD streaming',
      'Unlimited connections',
      'VIP customer support',
      'Complete channel package',
      'Worldwide content access',
      'Premium features unlocked'
    ],
    bgColor: 'bg-white',
    accentColor: 'text-red-600',
    enabled: true
  }
];
