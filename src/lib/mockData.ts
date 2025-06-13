
import { Platform, Product, Order, Metric, SalesData } from './types';

// Mock IPTV Products
export const products: Product[] = [
  {
    id: '1',
    name: 'PROMAX 4K IPTV ⚡',
    slug: 'promax-4k-iptv',
    description: 'Service IPTV premium avec plus de 20,000 chaînes mondiales en qualité 4K.',
    price: 15.99,
    salePrice: 12.99,
    platform: 'iptv',
    imageUrl: 'https://placekitten.com/500/600',
    genre: ['IPTV', 'Premium'],
    rating: 4.8,
    stock: 100,
    featured: true,
  },
  {
    id: '2',
    name: 'TIVIONE 4K IPTV 📺',
    slug: 'tivione-4k-iptv',
    description: 'Package IPTV complet avec films, séries et sport en direct.',
    price: 19.99,
    platform: 'iptv',
    imageUrl: 'https://placekitten.com/500/601',
    genre: ['IPTV', 'Entertainment'],
    rating: 4.7,
    stock: 85,
    featured: true,
  },
  {
    id: '3',
    name: 'STRONG 8K IPTV 🚀',
    slug: 'strong-8k-iptv',
    description: 'Service IPTV haut de gamme avec qualité 8K et support multi-appareils.',
    price: 29.99,
    platform: 'iptv',
    imageUrl: 'https://placekitten.com/500/602',
    genre: ['IPTV', '8K'],
    rating: 4.9,
    stock: 50,
    featured: true,
  },
  {
    id: '4',
    name: 'B1G 4K IPTV 🎬',
    slug: 'b1g-4k-iptv',
    description: 'Solution IPTV avec bibliothèque VOD étendue et chaînes premium.',
    price: 24.99,
    salePrice: 19.99,
    platform: 'iptv',
    imageUrl: 'https://placekitten.com/500/603',
    genre: ['IPTV', 'VOD'],
    rating: 4.6,
    stock: 75,
    featured: false,
  },
  {
    id: '5',
    name: 'TREX 8K IPTV 🦖',
    slug: 'trex-8k-iptv',
    description: 'Service IPTV révolutionnaire avec technologie anti-coupure.',
    price: 34.99,
    platform: 'iptv',
    imageUrl: 'https://placekitten.com/500/604',
    genre: ['IPTV', 'Premium'],
    rating: 4.8,
    stock: 60,
    featured: false,
  }
];

// Updated IPTV orders data to match new Order type
export const orders: Order[] = [
  {
    id: 'IPTV-2024-001',
    customerName: 'Ahmed Hassan',
    customerEmail: 'ahmed.hassan@gmail.com',
    customerPhone: '+33 6 12 34 56 78',
    customerWhatsapp: '+33 6 12 34 56 78',
    packageName: 'PROMAX 4K IPTV ⚡',
    packageCategory: 'subscription',
    durationMonths: 1,
    orderType: 'activation',
    status: 'delivered',
    paymentStatus: 'paid',
    total: 19.19,
    createdAt: '2024-06-10T14:30:00Z',
    updatedAt: '2024-06-10T14:35:00Z'
  },
  {
    id: 'IPTV-2024-002',
    customerName: 'Sophie Martin',
    customerEmail: 'sophie.martin@hotmail.fr',
    customerPhone: '+33 7 23 45 67 89',
    customerWhatsapp: '+33 7 23 45 67 89',
    packageName: 'TIVIONE 4K IPTV 📺',
    packageCategory: 'subscription',
    durationMonths: 1,
    orderType: 'activation',
    status: 'processing',
    paymentStatus: 'paid',
    total: 23.99,
    createdAt: '2024-06-11T09:15:00Z',
    updatedAt: '2024-06-11T09:20:00Z'
  },
  {
    id: 'IPTV-2024-003',
    customerName: 'Mohamed Benali',
    customerEmail: 'm.benali@yahoo.com',
    customerPhone: '+33 6 34 56 78 90',
    customerWhatsapp: '+33 6 34 56 78 90',
    packageName: 'STRONG 8K IPTV 🚀',
    packageCategory: 'subscription',
    durationMonths: 1,
    orderType: 'activation',
    status: 'shipped',
    paymentStatus: 'paid',
    total: 35.99,
    createdAt: '2024-06-11T11:45:00Z',
    updatedAt: '2024-06-11T16:30:00Z'
  },
  {
    id: 'IPTV-2024-004',
    customerName: 'Elena Rodriguez',
    customerEmail: 'elena.rodriguez@gmail.com',
    customerPhone: '+34 6 12 34 56 78',
    customerWhatsapp: '+34 6 12 34 56 78',
    packageName: 'B1G 4K IPTV 🎬',
    packageCategory: 'subscription',
    durationMonths: 1,
    orderType: 'activation',
    status: 'pending',
    paymentStatus: 'pending',
    total: 27.18,
    createdAt: '2024-06-11T16:20:00Z',
    updatedAt: '2024-06-11T16:20:00Z'
  },
  {
    id: 'IPTV-2024-005',
    customerName: 'Jean-Pierre Dubois',
    customerEmail: 'jp.dubois@orange.fr',
    customerPhone: '+33 6 45 67 89 01',
    customerWhatsapp: '+33 6 45 67 89 01',
    packageName: 'TREX 8K IPTV 🦖',
    packageCategory: 'subscription',
    durationMonths: 1,
    orderType: 'activation',
    status: 'delivered',
    paymentStatus: 'paid',
    total: 41.99,
    createdAt: '2024-06-09T13:10:00Z',
    updatedAt: '2024-06-09T15:40:00Z'
  }
];

// IPTV Business Metrics
export const metrics: Metric[] = [
  {
    label: 'Total Revenue',
    value: 15247.85,
    change: 18.7,
    trend: 'up'
  },
  {
    label: 'Active Subscriptions',
    value: 847,
    change: 12.3,
    trend: 'up'
  },
  {
    label: 'Average Revenue Per User',
    value: 18.02,
    change: 5.8,
    trend: 'up'
  },
  {
    label: 'Customer Satisfaction',
    value: 4.7,
    change: 2.1,
    trend: 'up'
  }
];

// IPTV Sales Data for Charts
export const salesData: SalesData[] = [
  { date: '2024-06-01', revenue: 680.25, orders: 28 },
  { date: '2024-06-02', revenue: 745.50, orders: 31 },
  { date: '2024-06-03', revenue: 692.75, orders: 29 },
  { date: '2024-06-04', revenue: 810.30, orders: 34 },
  { date: '2024-06-05', revenue: 756.80, orders: 32 },
  { date: '2024-06-06', revenue: 698.40, orders: 29 },
  { date: '2024-06-07', revenue: 887.95, orders: 37 },
  { date: '2024-06-08', revenue: 742.80, orders: 31 },
  { date: '2024-06-09', revenue: 805.72, orders: 34 },
  { date: '2024-06-10', revenue: 889.50, orders: 37 },
  { date: '2024-06-11', revenue: 712.48, orders: 30 }
];

// Helper function to get filtered products by platform
export const getProductsByPlatform = (platform?: Platform) => {
  if (!platform) return products;
  return products.filter(product => product.platform === platform);
};

// Helper function to get a product by ID
export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};

// Helper function to get a product by slug
export const getProductBySlug = (slug: string) => {
  return products.find(product => product.slug === slug);
};

// Helper function to get an order by ID
export const getOrderById = (id: string) => {
  return orders.find(order => order.id === id);
};
