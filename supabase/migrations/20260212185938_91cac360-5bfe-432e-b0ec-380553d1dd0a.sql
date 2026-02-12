
-- Create iptv_credit_options table for flexible credit tiers per package
CREATE TABLE public.iptv_credit_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID NOT NULL REFERENCES public.iptv_packages(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.iptv_credit_options ENABLE ROW LEVEL SECURITY;

-- Admin can manage
CREATE POLICY "Admin users can manage iptv credit options"
ON public.iptv_credit_options
FOR ALL
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Anyone can view credit options for active packages
CREATE POLICY "Anyone can view iptv credit options"
ON public.iptv_credit_options
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM iptv_packages
  WHERE iptv_packages.id = iptv_credit_options.package_id
  AND (iptv_packages.status = 'active' OR iptv_packages.status = 'featured')
));

-- Trigger for updated_at
CREATE TRIGGER update_iptv_credit_options_updated_at
BEFORE UPDATE ON public.iptv_credit_options
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing data: for each iptv_package with credit-based pricing, create credit options
INSERT INTO public.iptv_credit_options (package_id, credits, price, sort_order)
SELECT id, 10, price_10_credits, 1 FROM public.iptv_packages WHERE price_10_credits IS NOT NULL AND price_10_credits > 0 AND (category = 'panel-iptv' OR category = 'player');

INSERT INTO public.iptv_credit_options (package_id, credits, price, sort_order)
SELECT id, 25, price_25_credits, 2 FROM public.iptv_packages WHERE price_25_credits IS NOT NULL AND price_25_credits > 0 AND (category = 'panel-iptv' OR category = 'player');

INSERT INTO public.iptv_credit_options (package_id, credits, price, sort_order)
SELECT id, 50, price_50_credits, 3 FROM public.iptv_packages WHERE price_50_credits IS NOT NULL AND price_50_credits > 0 AND (category = 'panel-iptv' OR category = 'player');

INSERT INTO public.iptv_credit_options (package_id, credits, price, sort_order)
SELECT id, 100, price_100_credits, 4 FROM public.iptv_packages WHERE price_100_credits IS NOT NULL AND price_100_credits > 0 AND (category = 'panel-iptv' OR category = 'player');
