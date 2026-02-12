
CREATE OR REPLACE FUNCTION public.upsert_site_setting(p_setting_key text, p_setting_value text)
 RETURNS site_settings
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result public.site_settings;
BEGIN
  -- Allow the operation if any admin user record exists
  IF NOT EXISTS (
    SELECT 1 FROM admin_users LIMIT 1
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  INSERT INTO public.site_settings (setting_key, setting_value, updated_at)
  VALUES (p_setting_key, p_setting_value, now())
  ON CONFLICT (setting_key) 
  DO UPDATE SET 
    setting_value = EXCLUDED.setting_value,
    updated_at = now()
  RETURNING * INTO result;
  
  RETURN result;
END;
$function$;
