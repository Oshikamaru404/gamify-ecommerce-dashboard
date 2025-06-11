export type Platform = 'pc' | 'playstation' | 'xbox' | 'nintendo' | 'mobile' | 'iptv';

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  platform: Platform;
  imageUrl: string;
  genre: string[];
  rating: number;
  stock: number;
  featured?: boolean;
};

export type CartItem = {
  productId: string;
  quantity: number;
  product: Product;
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'credit_card' | 'paypal';

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Metric = {
  label: string;
  value: number;
  change: number; // Percentage change
  trend: 'up' | 'down' | 'neutral';
};

export type TimeRange = 'day' | 'week' | 'month' | 'year';

export type SalesData = {
  date: string;
  revenue: number;
  orders: number;
};
