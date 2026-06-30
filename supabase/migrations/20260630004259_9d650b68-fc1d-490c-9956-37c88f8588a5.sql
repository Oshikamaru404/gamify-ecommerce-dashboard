
-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  category text NOT NULL DEFAULT 'system',
  severity text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  body text,
  link text,
  icon text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  read_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_recent
  ON public.notifications (user_id, archived_at, read_at, created_at DESC);

GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins read all notifications" ON public.notifications
  FOR SELECT TO authenticated USING (public.is_admin_user());

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- ============================================================
-- EXTEND chat_conversations
-- ============================================================
ALTER TABLE public.chat_conversations
  ADD COLUMN IF NOT EXISTS conversation_type text NOT NULL DEFAULT 'support',
  ADD COLUMN IF NOT EXISTS assigned_admin_id uuid,
  ADD COLUMN IF NOT EXISTS color text,
  ADD COLUMN IF NOT EXISTS emoji text,
  ADD COLUMN IF NOT EXISTS pinned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS muted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS internal_notes text,
  ADD COLUMN IF NOT EXISTS last_seen_user_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_seen_admin_at timestamptz,
  ADD COLUMN IF NOT EXISTS typing_user_at timestamptz,
  ADD COLUMN IF NOT EXISTS typing_admin_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_chat_conv_type_user
  ON public.chat_conversations (conversation_type, user_id, archived);

ALTER TABLE public.chat_conversations REPLICA IDENTITY FULL;

-- ============================================================
-- EXTEND chat_messages
-- ============================================================
ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS read_at timestamptz,
  ADD COLUMN IF NOT EXISTS edited_at timestamptz,
  ADD COLUMN IF NOT EXISTS reply_to_id uuid REFERENCES public.chat_messages(id) ON DELETE SET NULL;

ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;

-- ============================================================
-- NOTIFICATION HELPER
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id uuid,
  p_type text,
  p_category text,
  p_severity text,
  p_title text,
  p_body text,
  p_link text,
  p_icon text,
  p_metadata jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  IF p_user_id IS NULL THEN RETURN NULL; END IF;
  INSERT INTO public.notifications(user_id, type, category, severity, title, body, link, icon, metadata)
  VALUES (p_user_id, p_type, p_category, p_severity, p_title, p_body, p_link, p_icon, COALESCE(p_metadata,'{}'::jsonb))
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Resolve user_id from order: prefer affiliates.user_id mismatch fix, use profiles.email
CREATE OR REPLACE FUNCTION public.resolve_user_from_email(p_email text)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.profiles WHERE lower(email) = lower(p_email) LIMIT 1;
$$;

-- ============================================================
-- ORDER TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_order_events()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid;
BEGIN
  uid := public.resolve_user_from_email(NEW.customer_email);
  IF uid IS NULL THEN RETURN NEW; END IF;

  IF TG_OP = 'INSERT' THEN
    PERFORM public.create_notification(
      uid, 'order_created', 'order', 'info',
      'Order received',
      'Your order for ' || COALESCE(NEW.package_name,'a package') || ' has been received.',
      '/account/orders/' || NEW.id::text,
      'ShoppingBag',
      jsonb_build_object('order_id', NEW.id, 'amount', NEW.amount)
    );
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.payment_status = 'paid' AND COALESCE(OLD.payment_status,'') <> 'paid' THEN
      PERFORM public.create_notification(
        uid, 'payment_confirmed', 'payment', 'success',
        'Payment confirmed',
        'We received your payment for ' || COALESCE(NEW.package_name,'your order') || '.',
        '/account/orders/' || NEW.id::text,
        'CreditCard', jsonb_build_object('order_id', NEW.id)
      );
    END IF;

    IF NEW.status IS DISTINCT FROM OLD.status THEN
      PERFORM public.create_notification(
        uid, 'order_status_updated', 'order', 'info',
        'Order status updated',
        'Your order is now: ' || NEW.status,
        '/account/orders/' || NEW.id::text,
        'Package', jsonb_build_object('order_id', NEW.id, 'status', NEW.status)
      );
    END IF;

    IF NEW.credentials_delivered_at IS NOT NULL AND OLD.credentials_delivered_at IS NULL THEN
      PERFORM public.create_notification(
        uid, 'credentials_delivered', 'credentials', 'success',
        'Credentials delivered',
        'Your access credentials are ready.',
        '/account/orders/' || NEW.id::text,
        'KeyRound', jsonb_build_object('order_id', NEW.id)
      );
    END IF;
  END IF;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_notify_order_events ON public.orders;
CREATE TRIGGER trg_notify_order_events
AFTER INSERT OR UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.notify_order_events();

-- ============================================================
-- COUPON REDEMPTION TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_coupon_redeemed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.user_id IS NULL THEN RETURN NEW; END IF;
  PERFORM public.create_notification(
    NEW.user_id, 'coupon_applied', 'coupon', 'success',
    'Coupon applied',
    'You saved ' || NEW.discount_amount::text || ' ' || COALESCE(NEW.currency,'EUR') || '.',
    '/account/coupons', 'Tag',
    jsonb_build_object('coupon_id', NEW.coupon_id, 'order_id', NEW.order_id)
  );
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_notify_coupon_redeemed ON public.coupon_redemptions;
CREATE TRIGGER trg_notify_coupon_redeemed
AFTER INSERT ON public.coupon_redemptions
FOR EACH ROW EXECUTE FUNCTION public.notify_coupon_redeemed();

-- ============================================================
-- AFFILIATE TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_affiliate_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.user_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'active' THEN
      PERFORM public.create_notification(
        NEW.user_id, 'affiliate_approved', 'affiliate', 'success',
        'Affiliate approved',
        'Your affiliate account is now active. Start sharing your referral link!',
        '/account/affiliate', 'Users', '{}'::jsonb
      );
    ELSIF NEW.status IN ('rejected','suspended') THEN
      PERFORM public.create_notification(
        NEW.user_id, 'affiliate_rejected', 'affiliate', 'warning',
        'Affiliate status: ' || NEW.status,
        'Your affiliate account status changed to ' || NEW.status || '.',
        '/account/affiliate', 'Users', '{}'::jsonb
      );
    END IF;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_notify_affiliate_status ON public.affiliates;
CREATE TRIGGER trg_notify_affiliate_status
AFTER UPDATE ON public.affiliates
FOR EACH ROW EXECUTE FUNCTION public.notify_affiliate_status();

CREATE OR REPLACE FUNCTION public.notify_commission_events()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid;
BEGIN
  SELECT user_id INTO uid FROM public.affiliates WHERE id = NEW.affiliate_id;
  IF uid IS NULL THEN RETURN NEW; END IF;

  IF TG_OP = 'INSERT' THEN
    PERFORM public.create_notification(
      uid, 'commission_created', 'affiliate', 'info',
      'New commission',
      'A new commission of ' || NEW.amount::text || ' ' || COALESCE(NEW.currency,'EUR') || ' is pending validation.',
      '/account/affiliate', 'DollarSign',
      jsonb_build_object('commission_id', NEW.id)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'approved' AND COALESCE(OLD.status,'') <> 'approved' THEN
      PERFORM public.create_notification(
        uid, 'commission_approved', 'affiliate', 'success',
        'Commission approved',
        'Your commission of ' || NEW.amount::text || ' ' || COALESCE(NEW.currency,'EUR') || ' has been approved.',
        '/account/affiliate', 'CheckCircle', jsonb_build_object('commission_id', NEW.id)
      );
    END IF;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_notify_commission_events ON public.affiliate_commissions;
CREATE TRIGGER trg_notify_commission_events
AFTER INSERT OR UPDATE ON public.affiliate_commissions
FOR EACH ROW EXECUTE FUNCTION public.notify_commission_events();

CREATE OR REPLACE FUNCTION public.notify_payout_completed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid;
BEGIN
  IF NEW.status = 'paid' AND COALESCE(OLD.status,'') <> 'paid' THEN
    SELECT user_id INTO uid FROM public.affiliates WHERE id = NEW.affiliate_id;
    IF uid IS NULL THEN RETURN NEW; END IF;
    PERFORM public.create_notification(
      uid, 'payout_completed', 'affiliate', 'success',
      'Payout completed',
      'Your payout of ' || NEW.amount::text || ' ' || COALESCE(NEW.currency,'EUR') || ' has been sent.',
      '/account/affiliate', 'Banknote', jsonb_build_object('payout_id', NEW.id)
    );
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_notify_payout_completed ON public.affiliate_payouts;
CREATE TRIGGER trg_notify_payout_completed
AFTER UPDATE ON public.affiliate_payouts
FOR EACH ROW EXECUTE FUNCTION public.notify_payout_completed();

-- ============================================================
-- CHAT REPLY NOTIFICATION
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_chat_reply()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  conv record;
BEGIN
  IF NEW.sender_type <> 'admin' THEN RETURN NEW; END IF;
  SELECT user_id, conversation_type, id, muted FROM public.chat_conversations WHERE id = NEW.conversation_id INTO conv;
  IF conv.user_id IS NULL OR conv.muted THEN RETURN NEW; END IF;
  PERFORM public.create_notification(
    conv.user_id, 'chat_reply', 'chat', 'info',
    'New reply from support',
    LEFT(NEW.content, 140),
    '/chat' || CASE WHEN conv.conversation_type = 'general_room' THEN '?quick=1' ELSE '' END,
    'MessageCircle',
    jsonb_build_object('conversation_id', conv.id)
  );
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_notify_chat_reply ON public.chat_messages;
CREATE TRIGGER trg_notify_chat_reply
AFTER INSERT ON public.chat_messages
FOR EACH ROW EXECUTE FUNCTION public.notify_chat_reply();
