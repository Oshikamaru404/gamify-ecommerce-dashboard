
ALTER TABLE public.iptv_packages
  ADD COLUMN IF NOT EXISTS stock_by_plan jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.subscription_packages
  ADD COLUMN IF NOT EXISTS stock_by_plan jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE OR REPLACE FUNCTION public.handle_order_paid_stock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  decremented integer := 0;
  plan_key text;
  qty integer;
  current_stock integer;
  new_stock integer;
BEGIN
  IF NEW.package_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.payment_status = 'paid'
     AND (TG_OP = 'INSERT' OR COALESCE(OLD.payment_status, '') <> 'paid') THEN

    qty := COALESCE(NEW.quantity, 1);
    plan_key := COALESCE(NEW.duration_months::text, '');

    -- iptv_packages
    IF plan_key <> '' THEN
      UPDATE public.iptv_packages p
         SET stock_by_plan = jsonb_set(
               COALESCE(p.stock_by_plan, '{}'::jsonb),
               ARRAY[plan_key],
               to_jsonb(GREATEST(COALESCE((p.stock_by_plan->>plan_key)::int, 0) - qty, 0))
             )
       WHERE p.id = NEW.package_id
         AND p.stock_enabled = true
         AND p.stock_by_plan ? plan_key;
      GET DIAGNOSTICS decremented = ROW_COUNT;
    END IF;

    IF decremented = 0 THEN
      UPDATE public.iptv_packages
         SET stock_quantity = GREATEST(stock_quantity - qty, 0)
       WHERE id = NEW.package_id AND stock_enabled = true;
      GET DIAGNOSTICS decremented = ROW_COUNT;
    END IF;

    -- subscription_packages fallback
    IF decremented = 0 AND plan_key <> '' THEN
      UPDATE public.subscription_packages p
         SET stock_by_plan = jsonb_set(
               COALESCE(p.stock_by_plan, '{}'::jsonb),
               ARRAY[plan_key],
               to_jsonb(GREATEST(COALESCE((p.stock_by_plan->>plan_key)::int, 0) - qty, 0))
             )
       WHERE p.id = NEW.package_id
         AND p.stock_enabled = true
         AND p.stock_by_plan ? plan_key;
      GET DIAGNOSTICS decremented = ROW_COUNT;
    END IF;

    IF decremented = 0 THEN
      UPDATE public.subscription_packages
         SET stock_quantity = GREATEST(stock_quantity - qty, 0)
       WHERE id = NEW.package_id AND stock_enabled = true;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;
