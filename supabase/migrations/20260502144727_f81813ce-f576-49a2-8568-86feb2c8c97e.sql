
-- Replace auth.uid()-based admin policies with permissive ones since admin uses custom auth (matches pattern used by orders, email_template_overrides)

-- blog_automation_config
DROP POLICY IF EXISTS "Admin manage blog automation config" ON public.blog_automation_config;
CREATE POLICY "Anyone can read blog automation config" ON public.blog_automation_config FOR SELECT USING (true);
CREATE POLICY "Anyone can update blog automation config" ON public.blog_automation_config FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can insert blog automation config" ON public.blog_automation_config FOR INSERT WITH CHECK (true);

-- blog_topics_queue
DROP POLICY IF EXISTS "Admin manage blog topics queue" ON public.blog_topics_queue;
CREATE POLICY "Anyone can read blog topics queue" ON public.blog_topics_queue FOR SELECT USING (true);
CREATE POLICY "Anyone can insert blog topics queue" ON public.blog_topics_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update blog topics queue" ON public.blog_topics_queue FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete blog topics queue" ON public.blog_topics_queue FOR DELETE USING (true);

-- blog_generation_logs
DROP POLICY IF EXISTS "Admin read blog generation logs" ON public.blog_generation_logs;
CREATE POLICY "Anyone can read blog generation logs" ON public.blog_generation_logs FOR SELECT USING (true);

-- Add scheduling fields for editable cron schedule
ALTER TABLE public.blog_automation_config
  ADD COLUMN IF NOT EXISTS cron_schedule text NOT NULL DEFAULT '0 9 * * 1,3,5',
  ADD COLUMN IF NOT EXISTS schedule_description text DEFAULT 'Mon/Wed/Fri at 09:00 UTC';
