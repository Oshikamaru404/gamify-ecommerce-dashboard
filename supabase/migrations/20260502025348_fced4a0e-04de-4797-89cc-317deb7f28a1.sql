-- ===== Itération B: Auto-Blog IA infrastructure =====

-- 1. Extend blog_articles with multilingual + auto-gen columns
ALTER TABLE public.blog_articles
  ADD COLUMN IF NOT EXISTS language_code TEXT NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS auto_generated BOOLEAN NOT NULL DEFAULT false;

-- Drop existing slug uniqueness if any, then add composite unique (slug, language_code)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blog_articles_slug_key') THEN
    ALTER TABLE public.blog_articles DROP CONSTRAINT blog_articles_slug_key;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS blog_articles_slug_lang_uidx
  ON public.blog_articles (slug, language_code);

CREATE INDEX IF NOT EXISTS blog_articles_lang_pub_idx
  ON public.blog_articles (language_code, published, created_at DESC);

-- 2. blog_topics_queue
CREATE TABLE IF NOT EXISTS public.blog_topics_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_en TEXT,
  topic_fr TEXT,
  topic_ar TEXT,
  target_keywords TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'iptv',
  status TEXT NOT NULL DEFAULT 'pending',
  sort_order INT NOT NULL DEFAULT 0,
  published_languages TEXT[] DEFAULT '{}',
  last_attempted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_topics_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin manage blog topics queue"
  ON public.blog_topics_queue FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- 3. blog_automation_config (singleton)
CREATE TABLE IF NOT EXISTS public.blog_automation_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  languages TEXT[] NOT NULL DEFAULT ARRAY['en','fr','ar'],
  articles_per_run INT NOT NULL DEFAULT 1,
  auto_publish BOOLEAN NOT NULL DEFAULT true,
  ai_model TEXT NOT NULL DEFAULT 'google/gemini-3-flash-preview',
  image_model TEXT NOT NULL DEFAULT 'google/gemini-2.5-flash-image',
  last_run_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_automation_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin manage blog automation config"
  ON public.blog_automation_config FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- 4. blog_generation_logs
CREATE TABLE IF NOT EXISTS public.blog_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.blog_topics_queue(id) ON DELETE SET NULL,
  language TEXT NOT NULL,
  status TEXT NOT NULL,
  article_id UUID,
  error_message TEXT,
  duration_ms INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_generation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin read blog generation logs"
  ON public.blog_generation_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS blog_generation_logs_created_idx
  ON public.blog_generation_logs (created_at DESC);

-- 5. Storage bucket for blog images (public)
INSERT INTO storage.buckets (id, name, public)
  VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Admin write blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-images' AND EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Service role write blog images"
  ON storage.objects FOR ALL
  TO service_role
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');
