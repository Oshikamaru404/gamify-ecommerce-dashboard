
-- Update the orders table to match the checkout form data structure
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_whatsapp TEXT,
ADD COLUMN IF NOT EXISTS package_category TEXT,
ADD COLUMN IF NOT EXISTS duration_months INTEGER,
ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'activation';

-- Update existing orders to have default values (fixed syntax)
UPDATE public.orders 
SET 
  package_category = 'player' 
WHERE package_category IS NULL;

UPDATE public.orders 
SET 
  duration_months = 1 
WHERE duration_months IS NULL;

UPDATE public.orders 
SET 
  order_type = 'activation' 
WHERE order_type IS NULL;

-- Make sure the columns are not null after setting defaults
ALTER TABLE public.orders 
ALTER COLUMN package_category SET NOT NULL,
ALTER COLUMN duration_months SET NOT NULL,
ALTER COLUMN order_type SET NOT NULL;

-- Add an index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
