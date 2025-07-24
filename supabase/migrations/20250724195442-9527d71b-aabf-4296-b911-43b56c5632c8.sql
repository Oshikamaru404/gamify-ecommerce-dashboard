
-- Fix the RLS policies for site_settings to allow the upsert function to work
-- The current policies are blocking the upsert function even with SECURITY DEFINER

-- First, let's check what policies exist and drop the restrictive ones
DROP POLICY IF EXISTS "Admin users can manage site settings" ON public.site_settings;

-- Create a more permissive policy that allows the upsert function to work
-- This policy allows admin users to manage settings directly
CREATE POLICY "Admin users can manage site settings" 
  ON public.site_settings 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Create a policy that allows the upsert function to work by bypassing RLS for the service role
-- This ensures the SECURITY DEFINER function can execute properly
CREATE POLICY "Service role can manage site settings" 
  ON public.site_settings 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Update the upsert function to ensure it works with RLS
CREATE OR REPLACE FUNCTION public.upsert_site_setting(
  p_setting_key TEXT,
  p_setting_value TEXT
) RETURNS public.site_settings AS $$
DECLARE
  result public.site_settings;
BEGIN
  -- Ensure the user is an admin before proceeding
  IF NOT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Insert or update the setting
  INSERT INTO public.site_settings (setting_key, setting_value, updated_at)
  VALUES (p_setting_key, p_setting_value, now())
  ON CONFLICT (setting_key) 
  DO UPDATE SET 
    setting_value = EXCLUDED.setting_value,
    updated_at = now()
  RETURNING * INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.upsert_site_setting(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_site_setting(TEXT, TEXT) TO service_role;
