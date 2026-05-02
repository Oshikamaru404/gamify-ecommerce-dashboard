import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import StoreLayout from '@/components/store/StoreLayout';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { useBlogArticleBySlug } from '@/hooks/useBlogArticles';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedText } from '@/lib/multilingualUtils';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedArticles from '@/components/RelatedArticles';
import { buildArticleSchema, buildFaqSchema } from '@/lib/seoSchemas';
import { SITE_URL } from '@/lib/seoTranslations';

interface BlogArticleDetailProps {
  category: 'iptv' | 'player';
  backPath: string;
  backLabel: string;
}

const BlogArticleDetail = ({ category, backPath, backLabel }: BlogArticleDetailProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: article, isLoading, error } = useBlogArticleBySlug(slug || '');
  const { language } = useLanguage();

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const localizedContent = getLocalizedText(content, language);
    const textContent = localizedContent.replace(/<[^>]*>/g, '');
    const words = textContent.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="bg-white min-h-screen">
          <div className="container py-16">
            <div className="text-center">
              <div className="text-lg">Chargement de l'article...</div>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (error || !article) {
    return (
      <StoreLayout>
        <div className="bg-white min-h-screen">
          <div className="container py-16">
            <Button
              variant="ghost"
              onClick={() => navigate(backPath)}
              className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              {backLabel}
            </Button>
            <div className="text-center py-8">
              <div className="text-lg text-red-600">Article non trouvé</div>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  const articleTitle = getLocalizedText(article.title, language);
  const articleExcerpt = article.excerpt ? getLocalizedText(article.excerpt, language) : '';
  const metaDesc = (article as any).meta_description || articleExcerpt || articleTitle;
  const articleUrl = `${SITE_URL}${backPath}/${article.slug}`;
  const lang = (article as any).language_code || language || 'en';
  const faqArr: any[] = Array.isArray((article as any).faq) ? (article as any).faq : [];

  const articleSchema = buildArticleSchema({
    headline: articleTitle,
    description: metaDesc,
    image: article.featured_image_url || undefined,
    datePublished: article.created_at,
    dateModified: article.updated_at,
    author: article.author,
    url: articleUrl,
    inLanguage: lang,
  });
  const faqSchema = faqArr.length > 0 ? buildFaqSchema(faqArr) : null;

  return (
    <StoreLayout>
      <Helmet>
        <title>{articleTitle} | BWIVOX</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={articleUrl} />
        <meta property="og:title" content={articleTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        {article.featured_image_url && (
          <meta property="og:image" content={article.featured_image_url} />
        )}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        {faqSchema && (
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        )}
      </Helmet>
      <Breadcrumbs
        items={[
          { label: 'Blog', href: backPath },
          { label: articleTitle },
        ]}
      />
      <div className="bg-white min-h-screen">
        <div className="container py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(backPath)}
            className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            {backLabel}
          </Button>

          <article className="max-w-4xl mx-auto">
            {article.featured_image_url && (
              <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
                <img
                  src={article.featured_image_url}
                  alt={getLocalizedText(article.title, language)}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}

            <header className="mb-8 text-center border-b border-gray-200 pb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {getLocalizedText(article.title, language)}
              </h1>
              
              {article.excerpt && (
                <p className="text-xl text-gray-600 mb-6 italic">
                  {getLocalizedText(article.excerpt, language)}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(article.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{estimateReadingTime(article.content)} min de lecture</span>
                </div>
              </div>
            </header>

            <div className="prose prose-lg max-w-none">
              <div 
                className="text-lg leading-relaxed rich-text-content"
                dangerouslySetInnerHTML={{ __html: getLocalizedText(article.content, language) }}
              />
            </div>

            {faqArr.length > 0 && (
              <section className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">FAQ</h2>
                <div className="space-y-4">
                  {faqArr.map((item, idx) => (
                    <details
                      key={idx}
                      className="group bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-red-500 transition-colors"
                    >
                      <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                        <span>{item.question}</span>
                        <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-3 text-gray-700 leading-relaxed">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-red-50 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  {category === 'iptv' 
                    ? "Besoin d'aide avec votre IPTV ?" 
                    : "Besoin d'aide avec votre lecteur IPTV ?"}
                </h3>
                <p className="text-red-700 mb-4">
                  {category === 'iptv'
                    ? "Notre équipe d'experts est là pour vous accompagner dans votre expérience IPTV."
                    : "Notre équipe d'experts est là pour vous accompagner dans le choix et l'utilisation de votre lecteur IPTV."}
                </p>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Contacter le support
                </Button>
              </div>
            </footer>
          </article>
        </div>
      </div>
      <RelatedArticles
        currentSlug={article.slug}
        category={article.category}
        basePath={backPath}
      />
    </StoreLayout>
  );
};

export default BlogArticleDetail;
