
import React from 'react';
import { Link } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock, Play } from 'lucide-react';
import { useBlogArticlesByCategory } from '@/hooks/useBlogArticles';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedText } from '@/lib/multilingualUtils';

const BlogPlayer = () => {
  const { data: articles, isLoading, error } = useBlogArticlesByCategory('player');
  const { language } = useLanguage();

  // Function to estimate reading time
  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const localizedContent = getLocalizedText(content, language);
    const textContent = localizedContent.replace(/<[^>]*>/g, '');
    const words = textContent.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Function to create excerpt from rich text content
  const createExcerpt = (content: string, maxLength: number = 150) => {
    const localizedContent = getLocalizedText(content, language);
    const textContent = localizedContent.replace(/<[^>]*>/g, '');
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...' 
      : textContent;
  };

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="bg-gray-50 min-h-screen">
          <div className="container py-16">
            <section className="mb-20 text-center">
              <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-gray-900">
                Blog <span className="text-red-600">Player</span>
              </h1>
              <p className="mx-auto mb-10 max-w-4xl text-2xl text-gray-600">
                Guides et conseils pour optimiser votre lecteur IPTV
              </p>
            </section>

            <div className="text-center py-8">
              <div className="text-lg">Chargement des articles...</div>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (error) {
    return (
      <StoreLayout>
        <div className="bg-gray-50 min-h-screen">
          <div className="container py-16">
            <section className="mb-20 text-center">
              <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-gray-900">
                Blog <span className="text-red-600">Player</span>
              </h1>
              <p className="mx-auto mb-10 max-w-4xl text-2xl text-gray-600">
                Guides et conseils pour optimiser votre lecteur IPTV
              </p>
            </section>

            <div className="text-center py-8">
              <div className="text-lg text-red-600">Erreur lors du chargement des articles</div>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  // Default blog listing view
  return (
    <StoreLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-gray-900">
              Blog <span className="text-red-600">Player</span>
            </h1>
            <p className="mx-auto mb-10 max-w-4xl text-2xl text-gray-600">
              Guides et conseils pour optimiser votre lecteur IPTV
            </p>
          </section>

          {articles && articles.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.id} to={`/blog-player/${article.slug}`}>
                  <Card 
                    className="group cursor-pointer hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden h-full"
                  >
                    {article.featured_image_url && (
                      <div className="overflow-hidden">
                      <img
                          src={article.featured_image_url}
                          alt={getLocalizedText(article.title, language)}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Play size={16} className="text-red-600" />
                        <span className="text-sm font-medium text-red-600">Player IPTV</span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                        {getLocalizedText(article.title, language)}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt ? getLocalizedText(article.excerpt, language) : createExcerpt(article.content)}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(article.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {estimateReadingTime(article.content)} min
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User size={14} />
                          {article.author}
                        </div>
                        
                        <span className="text-red-600 hover:text-red-700 font-medium">
                          Lire la suite →
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg shadow-lg p-12 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <Play className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun article Player disponible</h3>
                <p className="text-gray-600">Les articles sur les lecteurs IPTV seront bientôt disponibles. Revenez plus tard !</p>
              </div>
            </div>
          )}

          <section className="mt-20 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-12 text-center shadow-xl">
            <h2 className="text-4xl font-bold mb-6">Optimisez votre lecteur IPTV</h2>
            <p className="text-xl mb-8 opacity-90">
              Suivez notre blog Player pour les meilleurs conseils d'utilisation et de configuration
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                S'abonner à la newsletter
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-red-600">
                Nos services Player
              </Button>
            </div>
          </section>
        </div>
      </div>
    </StoreLayout>
  );
};

export default BlogPlayer;
