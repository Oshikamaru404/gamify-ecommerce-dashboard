
import { supabase } from '@/integrations/supabase/client';

const sampleOrders = [
  {
    id: 'IPTV-2024-001',
    customer_name: 'Ahmed Hassan',
    customer_email: 'ahmed.hassan@gmail.com',
    customer_whatsapp: '+33123456789',
    package_name: 'PROMAX 4K IPTV ⚡',
    package_category: 'player',
    duration_months: 1,
    order_type: 'activation',
    amount: 15.99,
    status: 'delivered',
    payment_status: 'paid',
  },
  {
    id: 'IPTV-2024-002',
    customer_name: 'Sophie Martin',
    customer_email: 'sophie.martin@hotmail.fr',
    customer_whatsapp: '+33987654321',
    package_name: 'TIVIONE 4K IPTV 📺',
    package_category: 'subscription',
    duration_months: 3,
    order_type: 'activation',
    amount: 29.99,
    status: 'processing',
    payment_status: 'paid',
  },
  {
    id: 'IPTV-2024-003',
    customer_name: 'Mohamed Benali',
    customer_email: 'm.benali@yahoo.com',
    customer_whatsapp: '+33555666777',
    package_name: 'STRONG 8K IPTV 🚀',
    package_category: 'reseller',
    duration_months: 12,
    order_type: 'activation',
    amount: 49.99,
    status: 'shipped',
    payment_status: 'paid',
  },
  {
    id: 'IPTV-2024-004',
    customer_name: 'Elena Rodriguez',
    customer_email: 'elena.rodriguez@gmail.com',
    package_name: 'B1G 4K IPTV 🎬',
    package_category: 'player',
    duration_months: 1,
    order_type: 'activation',
    amount: 9.99,
    status: 'pending',
    payment_status: 'pending',
  },
  {
    id: 'IPTV-2024-005',
    customer_name: 'Jean-Pierre Dubois',
    customer_email: 'jp.dubois@orange.fr',
    customer_whatsapp: '+33111222333',
    package_name: 'TREX 8K IPTV 🦖',
    package_category: 'subscription',
    duration_months: 6,
    order_type: 'activation',
    amount: 19.99,
    status: 'delivered',
    payment_status: 'paid',
  }
];

export const seedOrders = async (): Promise<number> => {
  try {
    // First, check if orders already exist
    const { data: existingOrders, error: checkError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing orders:', checkError);
      throw checkError;
    }

    // If orders already exist, don't seed
    if (existingOrders && existingOrders.length > 0) {
      console.log('Orders already exist, skipping seed');
      return 0;
    }

    // Insert sample orders
    const { data, error } = await supabase
      .from('orders')
      .insert(sampleOrders)
      .select();

    if (error) {
      console.error('Error seeding orders:', error);
      throw error;
    }

    console.log('Successfully seeded orders:', data);
    return data?.length || 0;
  } catch (error) {
    console.error('Error in seedOrders:', error);
    throw error;
  }
};
