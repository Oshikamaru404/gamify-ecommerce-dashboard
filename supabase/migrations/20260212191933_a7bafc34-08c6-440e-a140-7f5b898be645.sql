
-- Add permissive policy to allow all operations on iptv_credit_options (matching pattern used by blog_articles and orders tables)
CREATE POLICY "Allow all operations on iptv_credit_options"
ON public.iptv_credit_options
FOR ALL
USING (true)
WITH CHECK (true);
