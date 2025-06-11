
-- Create enum for package categories
CREATE TYPE public.package_category AS ENUM ('subscription', 'reseller', 'player');

-- Create enum for package status
CREATE TYPE public.package_status AS ENUM ('active', 'inactive', 'featured');

-- Create table for IPTV packages
CREATE TABLE public.iptv_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category package_category NOT NULL,
  description TEXT,
  icon TEXT,
  features TEXT[] DEFAULT '{}',
  price_10_credits DECIMAL(10,2),
  price_25_credits DECIMAL(10,2), 
  price_50_credits DECIMAL(10,2),
  price_100_credits DECIMAL(10,2),
  status package_status DEFAULT 'active',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for admin users
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create table for tracking dashboard metrics
CREATE TABLE public.dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  metric_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.iptv_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin users can manage packages" ON public.iptv_packages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin users can manage admin table" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin users can view metrics" ON public.dashboard_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Insert initial IPTV packages based on current data
INSERT INTO public.iptv_packages (name, category, description, icon, features, price_10_credits, price_25_credits, price_50_credits, price_100_credits, status) VALUES
-- Subscription packages
('🚀 STRONG PRO', 'subscription', 'Premium quality with ultra HD 4K streaming', '🚀', ARRAY['Premium Quality', 'Ultra HD 4K', 'Fast Activation', 'Instant Activation', '24/7 Support'], 29.99, 69.99, 129.99, 229.99, 'featured'),
('🦖 TREX PRO', 'subscription', 'Guaranteed reliability with premium features', '🦖', ARRAY['Premium Quality', 'Ultra HD 4K', 'Fast Activation', 'Instant Activation', '24/7 Support'], 19.99, 49.99, 89.99, 159.99, 'active'),
('⚡ PROMAX', 'subscription', 'Fast activation with premium streaming', '⚡', ARRAY['Premium Quality', 'Ultra HD 4K', 'Fast Activation', 'Instant Activation', '24/7 Support'], 39.99, 89.99, 159.99, 269.99, 'active'),
('📺 TIVIONE', 'subscription', 'Premium entertainment package', '📺', ARRAY['Premium Quality', 'Ultra HD 4K', 'Fast Activation', 'Instant Activation', '24/7 Support'], 34.99, 79.99, 139.99, 239.99, 'active'),
('🎬 B1G IPTV', 'subscription', 'Complete entertainment solution', '🎬', ARRAY['Premium Quality', 'Ultra HD 4K', 'Fast Activation', 'Instant Activation', '24/7 Support'], 24.99, 59.99, 109.99, 189.99, 'active'),

-- Player packages
('VU Player Pro', 'player', 'Premium quality IPTV player', '📱', ARRAY['Premium Quality', 'Ultra HD 4K', 'Fast Activation', 'Instant Activation', '24/7 Support'], 89.00, 199.00, 349.00, 599.00, 'active'),
('IBO Player Pro', 'player', 'Guaranteed reliability player', '🎮', ARRAY['Premium Quality', 'Ultra HD 4K', 'Fast Activation', 'Instant Activation', '24/7 Support'], 79.00, 179.00, 319.00, 549.00, 'active'),
('STZ Player', 'player', 'Fast activation player', '📺', ARRAY['Premium Quality', 'Ultra HD 4K', 'Fast Activation', 'Instant Activation', '24/7 Support'], 119.00, 269.00, 479.00, 819.00, 'active'),
('RELAX Player', 'player', 'Premium home entertainment', '🏠', ARRAY['Premium Quality', 'Ultra HD 4K', 'Fast Activation', 'Instant Activation', '24/7 Support'], 99.00, 219.00, 389.00, 669.00, 'active'),
('HOT Player', 'player', 'High performance player', '🔥', ARRAY['Premium Quality', 'Ultra HD 4K', 'Fast Activation', 'Instant Activation', '24/7 Support'], 109.00, 249.00, 439.00, 759.00, 'active'),
('ARC Player', 'player', 'Advanced streaming player', '⚡', ARRAY['Premium Quality', 'Ultra HD 4K', 'Fast Activation', 'Instant Activation', '24/7 Support'], 129.00, 289.00, 519.00, 899.00, 'active');

-- Insert sample dashboard metrics
INSERT INTO public.dashboard_metrics (metric_name, metric_value, metric_date) VALUES
('total_revenue', 15420.50, CURRENT_DATE),
('total_orders', 245, CURRENT_DATE),
('active_subscriptions', 1230, CURRENT_DATE),
('new_customers', 45, CURRENT_DATE);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for iptv_packages
CREATE TRIGGER update_iptv_packages_updated_at 
    BEFORE UPDATE ON public.iptv_packages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
