
-- Add a category column to the blog_articles table to distinguish between IPTV and Player blogs
ALTER TABLE public.blog_articles 
ADD COLUMN category text NOT NULL DEFAULT 'iptv';

-- Add a check constraint to ensure only valid categories are used
ALTER TABLE public.blog_articles 
ADD CONSTRAINT blog_articles_category_check 
CHECK (category IN ('iptv', 'player'));

-- Update existing articles to have 'iptv' category (they can be changed later in admin)
UPDATE public.blog_articles SET category = 'iptv' WHERE category IS NULL;

-- Create an index on category for better performance
CREATE INDEX idx_blog_articles_category ON public.blog_articles(category);

-- Create an index on category and published for optimal querying of published articles by category
CREATE INDEX idx_blog_articles_category_published ON public.blog_articles(category, published) WHERE published = true;
