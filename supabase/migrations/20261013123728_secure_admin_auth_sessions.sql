CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS private.admin_auth_rate_limits (
  rate_key text PRIMARY KEY CHECK (rate_key ~ '^[0-9a-f]{64}$'),
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  window_started_at timestamptz NOT NULL DEFAULT now(),
  locked_until timestamptz
);
ALTER TABLE private.admin_auth_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.admin_auth_rate_limits FROM PUBLIC, anon, authenticated, service_role;
CREATE INDEX IF NOT EXISTS admin_auth_rate_limits_window_started_at_idx
  ON private.admin_auth_rate_limits (window_started_at);

CREATE OR REPLACE FUNCTION public.admin_auth_rate_limit(p_key text, p_success boolean)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, private
AS $$
DECLARE
  current_attempts integer;
  current_window timestamptz;
  current_lock timestamptz;
BEGIN
  IF p_key !~ '^[0-9a-f]{64}$' THEN
    RETURN false;
  END IF;

  DELETE FROM private.admin_auth_rate_limits
  WHERE window_started_at < now() - interval '24 hours'
    AND (locked_until IS NULL OR locked_until <= now());

  PERFORM pg_advisory_xact_lock(hashtextextended(p_key, 0));

  IF p_success THEN
    DELETE FROM private.admin_auth_rate_limits WHERE rate_key = p_key;
    RETURN true;
  END IF;

  SELECT attempt_count, window_started_at, locked_until
  INTO current_attempts, current_window, current_lock
  FROM private.admin_auth_rate_limits
  WHERE rate_key = p_key;

  IF current_lock > now() THEN
    RETURN false;
  END IF;

  IF current_window IS NULL OR current_window < now() - interval '15 minutes' THEN
    current_attempts := 0;
    current_window := now();
  END IF;

  current_attempts := current_attempts + 1;
  current_lock := CASE
    WHEN current_attempts >= 8 THEN now() + interval '15 minutes'
    ELSE NULL
  END;

  INSERT INTO private.admin_auth_rate_limits (rate_key, attempt_count, window_started_at, locked_until)
  VALUES (p_key, current_attempts, current_window, current_lock)
  ON CONFLICT (rate_key) DO UPDATE
  SET attempt_count = EXCLUDED.attempt_count,
      window_started_at = EXCLUDED.window_started_at,
      locked_until = EXCLUDED.locked_until;

  RETURN current_lock IS NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_auth_rate_limit(text, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_auth_rate_limit(text, boolean) TO service_role;

CREATE OR REPLACE FUNCTION public.consume_admin_backup_code(p_admin_id uuid, p_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  changed_rows integer;
BEGIN
  UPDATE public.admin_users
  SET backup_codes = array_remove(backup_codes, upper(p_code))
  WHERE id = p_admin_id
    AND upper(p_code) = ANY(backup_codes);

  GET DIAGNOSTICS changed_rows = ROW_COUNT;
  RETURN changed_rows = 1;
END;
$$;
REVOKE ALL ON FUNCTION public.consume_admin_backup_code(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_admin_backup_code(uuid, text) TO service_role;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;
REVOKE ALL ON FUNCTION public.is_admin_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.reset_product_sales()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  reset_count integer;
BEGIN
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
  END IF;

  UPDATE public.dashboard_metrics
  SET metric_value = 0
  WHERE metric_name IN ('total_sales', 'monthly_sales', 'weekly_sales');

  GET DIAGNOSTICS reset_count = ROW_COUNT;
  RETURN reset_count;
END;
$$;
REVOKE ALL ON FUNCTION public.reset_product_sales() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reset_product_sales() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.upsert_site_setting(p_setting_key text, p_setting_value text)
RETURNS public.site_settings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  result public.site_settings;
BEGIN
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
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
$$;
REVOKE ALL ON FUNCTION public.upsert_site_setting(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_site_setting(text, text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.delete_all_published_feedback()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  deleted_count integer;
BEGIN
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
  END IF;

  DELETE FROM public.feedbacks
  WHERE status = 'approved';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;
REVOKE ALL ON FUNCTION public.delete_all_published_feedback() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_all_published_feedback() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.update_blog_cron_schedule(new_schedule text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, cron, extensions
AS $$
DECLARE
  v_job_id bigint;
BEGIN
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
  END IF;

  SELECT jobid INTO v_job_id
  FROM cron.job
  WHERE jobname = 'auto-blog-generation'
  LIMIT 1;

  IF v_job_id IS NULL THEN
    RAISE EXCEPTION 'auto-blog-generation cron job not found';
  END IF;

  PERFORM cron.alter_job(job_id := v_job_id, schedule := new_schedule);
  UPDATE public.blog_automation_config
  SET cron_schedule = new_schedule, updated_at = now();
END;
$$;
REVOKE ALL ON FUNCTION public.update_blog_cron_schedule(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_blog_cron_schedule(text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.create_notification(uuid, text, text, text, text, text, text, text, jsonb)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_notification(uuid, text, text, text, text, text, text, text, jsonb)
  TO service_role;
REVOKE ALL ON FUNCTION public.resolve_user_from_email(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_user_from_email(text) TO service_role;

DROP POLICY IF EXISTS "Admin users can manage admin table" ON public.admin_users;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_users FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.admin_users TO service_role;

DROP POLICY IF EXISTS "Admin users can view metrics" ON public.dashboard_metrics;
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.dashboard_metrics FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.dashboard_metrics TO authenticated, service_role;
CREATE POLICY "Admins can view dashboard metrics"
  ON public.dashboard_metrics
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "Admin delete conversations" ON public.chat_conversations;
CREATE POLICY "Admin delete conversations"
  ON public.chat_conversations
  FOR DELETE TO authenticated
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "Admin delete messages" ON public.chat_messages;
CREATE POLICY "Admin delete messages"
  ON public.chat_messages
  FOR DELETE TO authenticated
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "Admin users can manage all feedbacks" ON public.feedbacks;
CREATE POLICY "Admin users can manage all feedbacks"
  ON public.feedbacks
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin users can manage homepage content" ON public.homepage_content;
CREATE POLICY "Admin users can manage homepage content"
  ON public.homepage_content
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin users can manage iptv credit options" ON public.iptv_credit_options;
CREATE POLICY "Admin users can manage iptv credit options"
  ON public.iptv_credit_options
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin users can manage packages" ON public.iptv_packages;
CREATE POLICY "Admin users can manage packages"
  ON public.iptv_packages
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin can manage orders" ON public.orders;
CREATE POLICY "Admin can manage orders"
  ON public.orders
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin users can manage credit options" ON public.subscription_credit_options;
CREATE POLICY "Admin users can manage credit options"
  ON public.subscription_credit_options
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin users can manage subscription packages" ON public.subscription_packages;
CREATE POLICY "Admin users can manage subscription packages"
  ON public.subscription_packages
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin users can manage translated content" ON public.translated_content;
CREATE POLICY "Admin users can manage translated content"
  ON public.translated_content
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin users can manage translations" ON public.translations;
CREATE POLICY "Admin users can manage translations"
  ON public.translations
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin users can manage WhatsApp templates" ON public.whatsapp_templates;
CREATE POLICY "Admin users can manage WhatsApp templates"
  ON public.whatsapp_templates
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());