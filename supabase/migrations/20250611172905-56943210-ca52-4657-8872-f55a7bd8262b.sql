
-- Disable RLS on iptv_packages table to allow public read access
ALTER TABLE public.iptv_packages DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on dashboard_metrics table for admin access
ALTER TABLE public.dashboard_metrics DISABLE ROW LEVEL SECURITY;

-- Fix the admin_users table RLS issue by dropping any problematic policies
DROP POLICY IF EXISTS "admin_users_policy" ON public.admin_users;
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
