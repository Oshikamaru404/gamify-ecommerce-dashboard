import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { useBlogArticles } from '@/hooks/useBlogArticles';
import { useLanguage } from '@/contexts/LanguageContext';

interface RelatedArticlesProps {
  currentSlug: string;
  category?: string;
  limit?: number;
  basePath?: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  currentSlug,
  category,
  limit = 3,
  basePath = '/blog',
}) => {
  const { data: articles } = useBlogArticles();
  const { language } = useLanguage();
  const lang = (['en', 'fr', 'ar'].includes(language)
    ? language
    : 'en') as 'en' | 'fr' | 'ar';

  const related = (articles || [])
    .filter(
      (a) => a.slug !== currentSlug && (!category || a.category === category)
    )
    .slice(0, limit);

  if (related.length === 0) return null;

  const heading =
    lang === 'fr'
      ? 'Articles similaires'
      : lang === 'ar'
      ? 'مقالات ذات صلة'
      : 'Related articles';
  const readMore =
    lang === 'fr'
      ? 'Lire la suite'
      : lang === 'ar'
      ? 'اقرأ المزيد'
      : 'Read more';

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
          {heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((article) => (
            <Link
              key={article.id}
              to={`${basePath}/${article.slug}`}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary hover:shadow-lg transition-all"
            >
              {article.featured_image_url && (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={article.featured_image_url}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" />
                  <time dateTime={article.created_at}>
                    {new Date(article.created_at).toLocaleDateString(
                      lang === 'ar' ? 'ar' : lang
                    )}
                  </time>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>
                )}
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  {readMore} <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles;
