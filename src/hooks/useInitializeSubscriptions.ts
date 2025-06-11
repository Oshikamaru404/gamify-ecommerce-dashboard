
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
    price_10_credits: 12.99,
    price_25_credits: 29.99,
    price_50_credits: 55.99,
    price_100_credits: 99.99,
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
    price_10_credits: 10.99,
    price_25_credits: 24.99,
    price_50_credits: 47.99,
    price_100_credits: 89.99,
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
    price_10_credits: 18.99,
    price_25_credits: 42.99,
    price_50_credits: 79.99,
    price_100_credits: 149.99,
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
    price_10_credits: 13.99,
    price_25_credits: 31.99,
    price_50_credits: 59.99,
    price_100_credits: 109.99,
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
    price_10_credits: 16.99,
    price_25_credits: 37.99,
    price_50_credits: 69.99,
    price_100_credits: 129.99,
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
