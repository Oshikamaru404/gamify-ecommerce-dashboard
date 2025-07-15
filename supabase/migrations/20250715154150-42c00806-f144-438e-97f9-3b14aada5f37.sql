
-- Add a new table for dynamic credit options
CREATE TABLE public.subscription_credit_options (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id uuid NOT NULL REFERENCES public.subscription_packages(id) ON DELETE CASCADE,
  credits integer NOT NULL,
  months integer NOT NULL,
  price numeric NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_credit_options ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to manage credit options
CREATE POLICY "Admin users can manage credit options" 
  ON public.subscription_credit_options 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ));

-- Create policy for public read access to credit options for active packages
CREATE POLICY "Anyone can view credit options for active packages" 
  ON public.subscription_credit_options 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM subscription_packages 
    WHERE subscription_packages.id = package_id 
    AND (subscription_packages.status = 'active' OR subscription_packages.status = 'featured')
  ));

-- Migrate existing data from subscription_packages to the new structure
INSERT INTO public.subscription_credit_options (package_id, credits, months, price, sort_order)
SELECT 
  id as package_id,
  3 as credits,
  credits_3_months as months,
  price_3_credits as price,
  1 as sort_order
FROM public.subscription_packages 
WHERE price_3_credits IS NOT NULL;

INSERT INTO public.subscription_credit_options (package_id, credits, months, price, sort_order)
SELECT 
  id as package_id,
  6 as credits,
  credits_6_months as months,
  price_6_credits as price,
  2 as sort_order
FROM public.subscription_packages 
WHERE price_6_credits IS NOT NULL;

INSERT INTO public.subscription_credit_options (package_id, credits, months, price, sort_order)
SELECT 
  id as package_id,
  12 as credits,
  credits_12_months as months,
  price_12_credits as price,
  3 as sort_order
FROM public.subscription_packages 
WHERE price_12_credits IS NOT NULL;

-- Add trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_subscription_credit_options_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscription_credit_options_updated_at
    BEFORE UPDATE ON public.subscription_credit_options
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_credit_options_updated_at();
