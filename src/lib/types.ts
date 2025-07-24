
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
  type?: string;
  category?: string;
  duration?: number;
};

export type CartItem = {
  productId: string;
  quantity: number;
  product: Product;
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'credit_card' | 'paypal';

// Updated Order type to match the database structure
export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerWhatsapp?: string;
  packageName: string;
  packageCategory: string;
  durationMonths: number;
  orderType: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  createdAt: string;
  updatedAt?: string;
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

// Store context type
export type StoreContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
};
