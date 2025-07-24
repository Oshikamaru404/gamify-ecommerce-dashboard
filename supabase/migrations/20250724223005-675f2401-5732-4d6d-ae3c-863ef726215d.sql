
-- Create the translated_content table
CREATE TABLE IF NOT EXISTS public.translated_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT NOT NULL,
  content_value TEXT NOT NULL,
  language_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_key, language_code)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.translated_content ENABLE ROW LEVEL SECURITY;

-- Create policies for the translated_content table
CREATE POLICY "Admin users can manage translated content" 
  ON public.translated_content 
  FOR ALL 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Anyone can read translated content" 
  ON public.translated_content 
  FOR SELECT 
  USING (true);
