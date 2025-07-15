
-- Create a table for blog articles
CREATE TABLE public.blog_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Équipe BWIVOX',
  featured_image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to published articles
CREATE POLICY "Anyone can view published articles" 
  ON public.blog_articles 
  FOR SELECT 
  USING (published = true);

-- Create policies for admin access
CREATE POLICY "Admin users can manage all articles" 
  ON public.blog_articles 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ));

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE TRIGGER update_blog_articles_updated_at
  BEFORE UPDATE ON public.blog_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample articles
INSERT INTO public.blog_articles (title, slug, excerpt, content, published) VALUES
(
  'Guide complet pour configurer votre IPTV',
  'guide-configuration-iptv',
  'Apprenez à configurer votre service IPTV sur tous vos appareils avec notre guide détaillé.',
  'Contenu détaillé du guide de configuration IPTV...',
  true
),
(
  'Les avantages de l''IPTV 8K',
  'avantages-iptv-8k',
  'Découvrez pourquoi la qualité 8K révolutionne votre expérience de streaming.',
  'Contenu détaillé sur les avantages de l''IPTV 8K...',
  true
),
(
  'Choisir le bon player IPTV',
  'choisir-player-iptv',
  'Comparatif des meilleurs players IPTV pour optimiser votre expérience.',
  'Contenu détaillé sur le choix du player IPTV...',
  true
),
(
  'IPTV vs Télévision traditionnelle',
  'iptv-vs-television-traditionnelle',
  'Pourquoi l''IPTV est l''avenir du divertissement à domicile.',
  'Contenu détaillé sur la comparaison IPTV vs télévision traditionnelle...',
  true
);
