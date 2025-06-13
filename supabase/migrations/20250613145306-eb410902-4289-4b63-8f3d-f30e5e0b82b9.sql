
-- Drop existing policies on orders table to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access for orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert for orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update for orders" ON public.orders;

-- Disable RLS temporarily to clear any issues
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with proper policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies for orders
CREATE POLICY "Enable read access for all users" ON public.orders
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.orders
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.orders
    FOR DELETE USING (true);
