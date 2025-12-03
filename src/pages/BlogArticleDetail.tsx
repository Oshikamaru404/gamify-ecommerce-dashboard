import { useParams, useNavigate } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { useBlogArticleBySlug } from '@/hooks/useBlogArticles';

interface BlogArticleDetailProps {
  category: 'iptv' | 'player';
  backPath: string;
  backLabel: string;
}

const BlogArticleDetail = ({ category, backPath, backLabel }: BlogArticleDetailProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: article, isLoading, error } = useBlogArticleBySlug(slug || '');

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
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

  return (
    <StoreLayout>
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
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}

            <header className="mb-8 text-center border-b border-gray-200 pb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>
              
              {article.excerpt && (
                <p className="text-xl text-gray-600 mb-6 italic">
                  {article.excerpt}
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
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

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
    </StoreLayout>
  );
};

export default BlogArticleDetail;
