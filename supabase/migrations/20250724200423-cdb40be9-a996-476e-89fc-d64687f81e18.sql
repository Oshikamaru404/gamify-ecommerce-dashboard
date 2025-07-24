
-- Create a security definer function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE user_id = auth.uid()
  );
$$;

-- Drop existing RLS policies for site_settings
DROP POLICY IF EXISTS "Admin users can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Service role can manage site settings" ON public.site_settings;

-- Create new RLS policy using the security definer function
CREATE POLICY "Admin users can manage site settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Keep the read policy for contact settings
-- (Already exists: "Anyone can read contact settings")
