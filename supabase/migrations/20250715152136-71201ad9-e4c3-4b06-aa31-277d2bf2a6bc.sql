
-- Create a table for subscription packages with credit-to-month mappings
CREATE TABLE public.subscription_packages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  icon text,
  icon_url text,
  features text[] DEFAULT '{}',
  price_3_credits numeric,
  price_6_credits numeric,
  price_12_credits numeric,
  credits_3_months integer DEFAULT 3,
  credits_6_months integer DEFAULT 6,
  credits_12_months integer DEFAULT 12,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'featured')),
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_packages ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to manage subscription packages
CREATE POLICY "Admin users can manage subscription packages" 
  ON public.subscription_packages 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ));

-- Create policy for public read access to active packages
CREATE POLICY "Anyone can view active subscription packages" 
  ON public.subscription_packages 
  FOR SELECT 
  USING (status = 'active' OR status = 'featured');

-- Insert some default subscription packages
INSERT INTO public.subscription_packages (name, description, price_3_credits, price_6_credits, price_12_credits, features, credits_3_months, credits_6_months, credits_12_months) VALUES
('STRONG 🚀', 'Premium IPTV service with high-quality streaming', 9.99, 18.99, 34.99, ARRAY['4K Ultra HD streaming', '5 simultaneous connections', '24/7 customer support', 'Premium sports channels', 'International content'], 3, 6, 12),
('T-REX 🦖', 'Advanced IPTV package with enhanced features', 14.99, 28.99, 54.99, ARRAY['4K Ultra HD streaming', '10 simultaneous connections', 'Priority customer support', 'All sports & premium channels', 'Global content library', 'Ad-free experience'], 3, 6, 12),
('PROMAX ⚡', 'Ultimate IPTV experience with unlimited access', 19.99, 38.99, 74.99, ARRAY['4K Ultra HD streaming', 'Unlimited connections', 'VIP customer support', 'Complete channel package', 'Worldwide content access', 'Premium features unlocked'], 3, 6, 12);

-- Add trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_subscription_packages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscription_packages_updated_at
    BEFORE UPDATE ON public.subscription_packages
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_packages_updated_at();
