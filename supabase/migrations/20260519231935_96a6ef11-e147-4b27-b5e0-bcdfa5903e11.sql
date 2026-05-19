-- Stock + quantity-based promo columns for both package tables
ALTER TABLE public.iptv_packages
  ADD COLUMN IF NOT EXISTS stock_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS stock_quantity integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS low_stock_threshold integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS quantity_promo_mode text NOT NULL DEFAULT 'percentage',
  ADD COLUMN IF NOT EXISTS quantity_promos jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.subscription_packages
  ADD COLUMN IF NOT EXISTS stock_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS stock_quantity integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS low_stock_threshold integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS quantity_promo_mode text NOT NULL DEFAULT 'percentage',
  ADD COLUMN IF NOT EXISTS quantity_promos jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Orders: quantity + multiple MAC addresses (with optional device label)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS mac_addresses jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Validation constraints
ALTER TABLE public.iptv_packages
  DROP CONSTRAINT IF EXISTS iptv_packages_promo_mode_chk;
ALTER TABLE public.iptv_packages
  ADD CONSTRAINT iptv_packages_promo_mode_chk CHECK (quantity_promo_mode IN ('percentage','fixed'));

ALTER TABLE public.subscription_packages
  DROP CONSTRAINT IF EXISTS subscription_packages_promo_mode_chk;
ALTER TABLE public.subscription_packages
  ADD CONSTRAINT subscription_packages_promo_mode_chk CHECK (quantity_promo_mode IN ('percentage','fixed'));

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_quantity_chk;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_quantity_chk CHECK (quantity >= 1);

-- Decrement stock automatically when payment_status transitions to 'paid'
CREATE OR REPLACE FUNCTION public.handle_order_paid_stock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  decremented integer := 0;
BEGIN
  IF NEW.package_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.payment_status = 'paid'
     AND (TG_OP = 'INSERT' OR COALESCE(OLD.payment_status, '') <> 'paid') THEN

    -- Try iptv_packages first (only if stock tracking is enabled)
    UPDATE public.iptv_packages
       SET stock_quantity = GREATEST(stock_quantity - COALESCE(NEW.quantity, 1), 0)
     WHERE id = NEW.package_id AND stock_enabled = true;
    GET DIAGNOSTICS decremented = ROW_COUNT;

    IF decremented = 0 THEN
      UPDATE public.subscription_packages
         SET stock_quantity = GREATEST(stock_quantity - COALESCE(NEW.quantity, 1), 0)
       WHERE id = NEW.package_id AND stock_enabled = true;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orders_paid_decrement_stock ON public.orders;
CREATE TRIGGER trg_orders_paid_decrement_stock
AFTER INSERT OR UPDATE OF payment_status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_order_paid_stock();