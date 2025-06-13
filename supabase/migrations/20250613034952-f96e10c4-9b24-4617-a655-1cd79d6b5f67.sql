
-- Drop existing RLS policies on orders table if any
DROP POLICY IF EXISTS "Admin users can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin users can manage orders" ON public.orders;

-- Disable RLS on orders table to allow admin access
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Or alternatively, if you want to keep RLS enabled, create proper policies
-- ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows all operations for now
-- CREATE POLICY "Allow all operations on orders" 
--   ON public.orders 
--   FOR ALL 
--   USING (true) 
--   WITH CHECK (true);
