
import { useEffect } from 'react';
import { useIPTVPackages, useCreateIPTVPackage } from './useIPTVPackages';

const defaultSubscriptions = [
  {
    name: "STRONG 8K IPTV 🚀",
    category: 'subscription' as const,
    description: "Premium 8K Ultra HD IPTV service with anti-freeze technology",
    icon: "🚀",
    features: [
      "8K Ultra HD Quality",
      "5000+ Live Channels", 
      "Movies & Series VOD",
      "Anti-Freeze Technology",
      "24/7 Support"
    ],
    price_1_month: 12.99,
    price_3_months: 35.99,
    price_6_months: 65.99,
    price_12_months: 120.99,
    price_10_credits: null,
    price_25_credits: null,
    price_50_credits: null,
    price_100_credits: null,
    status: 'featured' as const,
    sort_order: 1,
  },
  {
    name: "TREX 8K IPTV 🦖",
    category: 'subscription' as const,
    description: "Powerful IPTV solution with 8K/4K streaming capabilities",
    icon: "🦖",
    features: [
      "8K/4K Streaming",
      "4000+ Channels",
      "Sports Packages", 
      "Movie Collection",
      "Fast Servers"
    ],
    price_1_month: 10.99,
    price_3_months: 29.99,
    price_6_months: 55.99,
    price_12_months: 99.99,
    price_10_credits: null,
    price_25_credits: null,
    price_50_credits: null,
    price_100_credits: null,
    status: 'active' as const,
    sort_order: 2,
  },
  {
    name: "PROMAX 4K IPTV ⚡",
    category: 'subscription' as const,
    description: "Professional 4K IPTV service with premium technology",
    icon: "⚡",
    features: [
      "4K Premium Technology",
      "8000+ Channels",
      "4K Quality",
      "Global Content",
      "Premium Support"
    ],
    price_1_month: 18.99,
    price_3_months: 52.99,
    price_6_months: 99.99,
    price_12_months: 189.99,
    price_10_credits: null,
    price_25_credits: null,
    price_50_credits: null,
    price_100_credits: null,
    status: 'active' as const,
    sort_order: 3,
  },
  {
    name: "TIVIONE 4K IPTV 📺",
    category: 'subscription' as const,
    description: "Full 4K streaming with extensive VOD library",
    icon: "📺",
    features: [
      "Full 4K Streaming",
      "6000+ Channels",
      "VOD Library",
      "Stable Connection",
      "Multi-Platform"
    ],
    price_1_month: 13.99,
    price_3_months: 38.99,
    price_6_months: 72.99,
    price_12_months: 139.99,
    price_10_credits: null,
    price_25_credits: null,
    price_50_credits: null,
    price_100_credits: null,
    status: 'active' as const,
    sort_order: 4,
  },
  {
    name: "B1G 4K IPTV 🎬",
    category: 'subscription' as const,
    description: "Big entertainment platform with extensive content library",
    icon: "🎬",
    features: [
      "Big Entertainment",
      "9000+ Channels",
      "4K Resolution",
      "Sports & Movies",
      "24/7 Service"
    ],
    price_1_month: 16.99,
    price_3_months: 47.99,
    price_6_months: 69.99,
    price_12_months: 129.99,
    price_10_credits: null,
    price_25_credits: null,
    price_50_credits: null,
    price_100_credits: null,
    status: 'active' as const,
    sort_order: 5,
  }
];

export const useInitializeSubscriptions = () => {
  const { data: packages, isLoading } = useIPTVPackages();
  const createPackage = useCreateIPTVPackage();

  useEffect(() => {
    if (!isLoading && packages && packages.length === 0) {
      // Only initialize if no packages exist
      console.log('Initializing default subscription packages...');
      defaultSubscriptions.forEach(subscription => {
        createPackage.mutate(subscription);
      });
    }
  }, [packages, isLoading, createPackage]);

  return { packages, isLoading };
};
