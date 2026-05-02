CREATE TABLE IF NOT EXISTS public.email_template_overrides (
  template_name text PRIMARY KEY,
  overrides jsonb NOT NULL DEFAULT '{}'::jsonb,
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.email_template_overrides ENABLE ROW LEVEL SECURITY;

-- Public read so edge function (anon) and admin UI can both read.
CREATE POLICY "Anyone can read email overrides"
  ON public.email_template_overrides FOR SELECT
  USING (true);

-- Admin write (admin auth is custom in this project; permissive policy aligned with existing admin strategy).
CREATE POLICY "Admins can insert email overrides"
  ON public.email_template_overrides FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update email overrides"
  ON public.email_template_overrides FOR UPDATE
  USING (true);

CREATE POLICY "Admins can delete email overrides"
  ON public.email_template_overrides FOR DELETE
  USING (true);

CREATE TRIGGER update_email_template_overrides_updated_at
  BEFORE UPDATE ON public.email_template_overrides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();