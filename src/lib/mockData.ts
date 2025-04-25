
import { Platform, Product, Order, Metric, SalesData } from './types';

// Mock Products
export const products: Product[] = [
  {
    id: '1',
    name: 'FIFA 24',
    slug: 'fifa-24',
    description: 'The latest installment in the FIFA series. Experience the most realistic football simulation with updated teams and features.',
    price: 59.99,
    salePrice: 49.99,
    platform: 'playstation',
    imageUrl: 'https://placekitten.com/500/600',
    genre: ['Sports', 'Simulation'],
    rating: 4.5,
    stock: 50,
    featured: true,
  },
  {
    id: '2',
    name: 'Call of Duty: Modern Warfare III',
    slug: 'call-of-duty-modern-warfare-3',
    description: 'The sequel to 2022\'s blockbuster Modern Warfare II, featuring a gripping single-player campaign and immersive multiplayer experience.',
    price: 69.99,
    platform: 'pc',
    imageUrl: 'https://placekitten.com/500/601',
    genre: ['FPS', 'Action'],
    rating: 4.7,
    stock: 35,
    featured: true,
  },
  {
    id: '3',
    name: 'The Legend of Zelda: Tears of the Kingdom',
    slug: 'legend-of-zelda-tears-of-the-kingdom',
    description: 'Embark on an epic adventure in the kingdom of Hyrule. Discover new lands, battle fearsome enemies, and solve intricate puzzles.',
    price: 59.99,
    platform: 'nintendo',
    imageUrl: 'https://placekitten.com/500/602',
    genre: ['Adventure', 'RPG'],
    rating: 4.9,
    stock: 20,
    featured: true,
  },
  {
    id: '4',
    name: 'Assassin\'s Creed Mirage',
    slug: 'assassins-creed-mirage',
    description: 'Return to the series\' roots in this action-adventure game set in 9th-century Baghdad during the Islamic Golden Age.',
    price: 49.99,
    salePrice: 39.99,
    platform: 'xbox',
    imageUrl: 'https://placekitten.com/500/603',
    genre: ['Action', 'Adventure'],
    rating: 4.3,
    stock: 42,
    featured: false,
  },
  {
    id: '5',
    name: 'Minecraft',
    slug: 'minecraft',
    description: 'Build anything you can imagine. Create, explore and survive in a blocky, procedurally-generated 3D world.',
    price: 29.99,
    platform: 'pc',
    imageUrl: 'https://placekitten.com/500/604',
    genre: ['Sandbox', 'Adventure'],
    rating: 4.8,
    stock: 100,
    featured: false,
  },
  {
    id: '6',
    name: 'Starfield',
    slug: 'starfield',
    description: 'Bethesda\'s first new IP in 25 years, a next-generation role-playing game set amongst the stars.',
    price: 69.99,
    platform: 'xbox',
    imageUrl: 'https://placekitten.com/500/605',
    genre: ['RPG', 'Adventure', 'Sci-Fi'],
    rating: 4.6,
    stock: 25,
    featured: true,
  },
  {
    id: '7',
    name: 'Genshin Impact',
    slug: 'genshin-impact',
    description: 'An open-world action RPG. Embark on a journey across Teyvat to find your lost sibling and seek answers from The Seven, the elemental gods.',
    price: 0,
    platform: 'mobile',
    imageUrl: 'https://placekitten.com/500/606',
    genre: ['RPG', 'Adventure', 'Fantasy'],
    rating: 4.4,
    stock: 999,
    featured: false,
  },
  {
    id: '8',
    name: 'Spider-Man 2',
    slug: 'spider-man-2',
    description: 'Swing through the streets of Manhattan as both Peter Parker and Miles Morales in this action-packed superhero adventure.',
    price: 69.99,
    platform: 'playstation',
    imageUrl: 'https://placekitten.com/500/607',
    genre: ['Action', 'Adventure'],
    rating: 4.8,
    stock: 15,
    featured: true,
  }
];

// Mock Orders
export const orders: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'CUST-001',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 (555) 123-4567',
    items: [
      {
        productId: '1',
        quantity: 1,
        product: products[0]
      }
    ],
    shippingAddress: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    },
    status: 'processing',
    paymentStatus: 'pending',
    paymentMethod: 'cod',
    subtotal: 49.99,
    tax: 5.00,
    shipping: 4.99,
    total: 59.98,
    createdAt: '2023-04-15T10:30:00Z',
    updatedAt: '2023-04-15T10:35:00Z'
  },
  {
    id: 'ORD-002',
    customerId: 'CUST-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+1 (555) 987-6543',
    items: [
      {
        productId: '2',
        quantity: 1,
        product: products[1]
      },
      {
        productId: '5',
        quantity: 1,
        product: products[4]
      }
    ],
    shippingAddress: {
      address: '456 Elm St',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA'
    },
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'cod',
    subtotal: 99.98,
    tax: 10.00,
    shipping: 0,
    total: 109.98,
    createdAt: '2023-04-10T14:20:00Z',
    updatedAt: '2023-04-12T09:15:00Z'
  },
  {
    id: 'ORD-003',
    customerId: 'CUST-003',
    customerName: 'Robert Johnson',
    customerEmail: 'robert.johnson@example.com',
    customerPhone: '+1 (555) 456-7890',
    items: [
      {
        productId: '3',
        quantity: 1,
        product: products[2]
      }
    ],
    shippingAddress: {
      address: '789 Oak St',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60007',
      country: 'USA'
    },
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'cod',
    subtotal: 59.99,
    tax: 6.00,
    shipping: 4.99,
    total: 70.98,
    createdAt: '2023-04-14T11:45:00Z',
    updatedAt: '2023-04-14T16:30:00Z'
  },
  {
    id: 'ORD-004',
    customerId: 'CUST-004',
    customerName: 'Emily Wilson',
    customerEmail: 'emily.wilson@example.com',
    customerPhone: '+1 (555) 789-0123',
    items: [
      {
        productId: '6',
        quantity: 1,
        product: products[5]
      }
    ],
    shippingAddress: {
      address: '321 Pine St',
      city: 'Miami',
      state: 'FL',
      postalCode: '33101',
      country: 'USA'
    },
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'cod',
    subtotal: 69.99,
    tax: 7.00,
    shipping: 4.99,
    total: 81.98,
    createdAt: '2023-04-15T09:10:00Z',
    updatedAt: '2023-04-15T09:10:00Z'
  },
  {
    id: 'ORD-005',
    customerId: 'CUST-005',
    customerName: 'Michael Brown',
    customerEmail: 'michael.brown@example.com',
    customerPhone: '+1 (555) 234-5678',
    items: [
      {
        productId: '8',
        quantity: 1,
        product: products[7]
      },
      {
        productId: '4',
        quantity: 1,
        product: products[3]
      }
    ],
    shippingAddress: {
      address: '654 Cedar St',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'USA'
    },
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'cod',
    subtotal: 109.98,
    tax: 11.00,
    shipping: 0,
    total: 120.98,
    createdAt: '2023-04-05T13:25:00Z',
    updatedAt: '2023-04-07T15:40:00Z'
  },
];

// Mock Metrics
export const metrics: Metric[] = [
  {
    label: 'Total Revenue',
    value: 10452.97,
    change: 12.5,
    trend: 'up'
  },
  {
    label: 'Orders',
    value: 127,
    change: 8.3,
    trend: 'up'
  },
  {
    label: 'Average Order Value',
    value: 82.31,
    change: 4.2,
    trend: 'up'
  },
  {
    label: 'Conversion Rate',
    value: 3.57,
    change: -1.2,
    trend: 'down'
  }
];

// Mock Sales Data for Charts
export const salesData: SalesData[] = [
  { date: '2023-04-01', revenue: 480.25, orders: 6 },
  { date: '2023-04-02', revenue: 512.50, orders: 7 },
  { date: '2023-04-03', revenue: 495.75, orders: 6 },
  { date: '2023-04-04', revenue: 610.30, orders: 8 },
  { date: '2023-04-05', revenue: 542.80, orders: 7 },
  { date: '2023-04-06', revenue: 498.40, orders: 6 },
  { date: '2023-04-07', revenue: 687.95, orders: 9 },
  { date: '2023-04-08', revenue: 542.80, orders: 7 },
  { date: '2023-04-09', revenue: 605.72, orders: 8 },
  { date: '2023-04-10', revenue: 689.50, orders: 9 },
  { date: '2023-04-11', revenue: 512.48, orders: 7 },
  { date: '2023-04-12', revenue: 573.20, orders: 7 },
  { date: '2023-04-13', revenue: 509.90, orders: 6 },
  { date: '2023-04-14', revenue: 625.75, orders: 8 },
  { date: '2023-04-15', revenue: 702.60, orders: 9 },
  { date: '2023-04-16', revenue: 589.35, orders: 8 },
  { date: '2023-04-17', revenue: 498.40, orders: 6 },
  { date: '2023-04-18', revenue: 542.80, orders: 7 },
  { date: '2023-04-19', revenue: 573.20, orders: 7 },
  { date: '2023-04-20', revenue: 625.75, orders: 8 },
  { date: '2023-04-21', revenue: 498.40, orders: 6 },
  { date: '2023-04-22', revenue: 542.80, orders: 7 },
  { date: '2023-04-23', revenue: 589.35, orders: 8 },
  { date: '2023-04-24', revenue: 512.48, orders: 7 },
  { date: '2023-04-25', revenue: 498.40, orders: 6 },
  { date: '2023-04-26', revenue: 625.75, orders: 8 },
  { date: '2023-04-27', revenue: 542.80, orders: 7 },
  { date: '2023-04-28', revenue: 573.20, orders: 7 },
  { date: '2023-04-29', revenue: 702.60, orders: 9 },
  { date: '2023-04-30', revenue: 595.35, orders: 8 },
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
