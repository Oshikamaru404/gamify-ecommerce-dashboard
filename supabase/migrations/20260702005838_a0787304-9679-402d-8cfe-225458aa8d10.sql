
DROP POLICY IF EXISTS "Admins manage coupons" ON public.coupons;
CREATE POLICY "Admin interface can manage coupons"
  ON public.coupons FOR ALL
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins manage affiliates" ON public.affiliates;
CREATE POLICY "Admin interface can manage affiliates"
  ON public.affiliates FOR ALL
  USING (true) WITH CHECK (true);
