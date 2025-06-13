
-- Create orders table if it doesn't exist with proper structure
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_whatsapp TEXT,
  package_id UUID,
  package_name TEXT NOT NULL,
  package_category TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  order_type TEXT NOT NULL DEFAULT 'activation',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add trigger to automatically update the updated_at column
CREATE OR REPLACE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS for orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access for admin dashboard
CREATE POLICY "Allow public read access for orders" 
  ON public.orders 
  FOR SELECT 
  TO public 
  USING (true);

-- Create policy to allow public insert for new orders
CREATE POLICY "Allow public insert for orders" 
  ON public.orders 
  FOR INSERT 
  TO public 
  WITH CHECK (true);

-- Create policy to allow public update for order status changes
CREATE POLICY "Allow public update for orders" 
  ON public.orders 
  FOR UPDATE 
  TO public 
  USING (true);
