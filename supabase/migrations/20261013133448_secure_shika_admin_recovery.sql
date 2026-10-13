CREATE TABLE private.admin_password_recovery (
  recovery_key text PRIMARY KEY CHECK (recovery_key = 'shika'),
  admin_id uuid NOT NULL UNIQUE REFERENCES public.admin_users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz
);
ALTER TABLE private.admin_password_recovery ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.admin_password_recovery FROM PUBLIC, anon, authenticated, service_role;

DO $$
DECLARE
  recovery_rows integer;
BEGIN
  INSERT INTO private.admin_password_recovery (recovery_key, admin_id, expires_at)
  SELECT 'shika', id, now() + interval '24 hours'
  FROM public.admin_users
  WHERE username = 'shika'
    AND role = 'admin'
    AND user_id IS NULL
    AND NOT coalesce(two_factor_enabled, false);

  GET DIAGNOSTICS recovery_rows = ROW_COUNT;
  IF recovery_rows <> 1 THEN
    RAISE EXCEPTION 'Expected exactly one eligible shika admin account for recovery';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.recover_shika_admin_password(p_password_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
DECLARE
  target_admin_id uuid;
BEGIN
  IF p_password_hash IS NULL
    OR p_password_hash !~ '^\$2[aby]\$12\$[./A-Za-z0-9]{53}$' THEN
    RETURN false;
  END IF;

  SELECT id
  INTO target_admin_id
  FROM public.admin_users
  WHERE username = 'shika'
    AND role = 'admin'
    AND user_id IS NULL
    AND NOT coalesce(two_factor_enabled, false)
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  UPDATE private.admin_password_recovery
  SET consumed_at = now()
  WHERE recovery_key = 'shika'
    AND admin_id = target_admin_id
    AND consumed_at IS NULL
    AND expires_at > now()
  RETURNING admin_id INTO target_admin_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  UPDATE public.admin_users
  SET password_hash = p_password_hash
  WHERE id = target_admin_id
    AND user_id IS NULL
    AND NOT coalesce(two_factor_enabled, false);

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Admin account changed during recovery';
  END IF;

  DELETE FROM private.admin_auth_rate_limits
  WHERE rate_key = encode(sha256(convert_to('shika', 'UTF8')), 'hex');

  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.recover_shika_admin_password(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recover_shika_admin_password(text) TO service_role;