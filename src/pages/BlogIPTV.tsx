
import React, { useState } from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { useBlogArticlesByCategory } from '@/hooks/useBlogArticles';

const BlogIPTV = () => {
  const { data: articles, isLoading, error } = useBlogArticlesByCategory('iptv');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Function to estimate reading time
  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const words = textContent.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Function to create excerpt from rich text content
  const createExcerpt = (content: string, maxLength: number = 150) => {
    const textContent = content.replace(/<[^>]*>/g, '');
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
                Blog <span className="text-red-600">IPTV</span>
              </h1>
              <p className="mx-auto mb-10 max-w-4xl text-2xl text-gray-600">
                Actualités, guides et conseils pour optimiser votre expérience IPTV
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
                Blog <span className="text-red-600">IPTV</span>
              </h1>
              <p className="mx-auto mb-10 max-w-4xl text-2xl text-gray-600">
                Actualités, guides et conseils pour optimiser votre expérience IPTV
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

  // If an article is selected, show the full article view
  if (selectedArticle) {
    return (
      <StoreLayout>
        <div className="bg-white min-h-screen">
          <div className="container py-8">
            <Button
              variant="ghost"
              onClick={() => setSelectedArticle(null)}
              className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              Retour aux articles IPTV
            </Button>

            <article className="max-w-4xl mx-auto">
              {selectedArticle.featured_image_url && (
                <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={selectedArticle.featured_image_url}
                    alt={selectedArticle.title}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                </div>
              )}

              <header className="mb-8 text-center border-b border-gray-200 pb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {selectedArticle.title}
                </h1>
                
                {selectedArticle.excerpt && (
                  <p className="text-xl text-gray-600 mb-6 italic">
                    {selectedArticle.excerpt}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{selectedArticle.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(selectedArticle.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{estimateReadingTime(selectedArticle.content)} min de lecture</span>
                  </div>
                </div>
              </header>

              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-lg leading-relaxed rich-text-content"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>

              <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-red-50 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-semibold text-red-800 mb-2">
                    Besoin d'aide avec votre IPTV ?
                  </h3>
                  <p className="text-red-700 mb-4">
                    Notre équipe d'experts est là pour vous accompagner dans votre expérience IPTV.
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
  }

  // Default blog listing view
  return (
    <StoreLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-gray-900">
              Blog <span className="text-red-600">IPTV</span>
            </h1>
            <p className="mx-auto mb-10 max-w-4xl text-2xl text-gray-600">
              Actualités, guides et conseils pour optimiser votre expérience IPTV
            </p>
          </section>

          {articles && articles.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Card 
                  key={article.id} 
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden"
                  onClick={() => setSelectedArticle(article)}
                >
                  {article.featured_image_url && (
                    <div className="overflow-hidden">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt || createExcerpt(article.content)}
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
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-auto font-medium"
                      >
                        Lire la suite →
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg shadow-lg p-12 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun article IPTV disponible</h3>
                <p className="text-gray-600">Les articles IPTV seront bientôt disponibles. Revenez plus tard !</p>
              </div>
            </div>
          )}

          <section className="mt-20 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-12 text-center shadow-xl">
            <h2 className="text-4xl font-bold mb-6">Restez informé sur l'IPTV</h2>
            <p className="text-xl mb-8 opacity-90">
              Suivez notre blog IPTV pour les dernières actualités et nos conseils d'experts
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                S'abonner à la newsletter
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-red-600">
                Nos services IPTV
              </Button>
            </div>
          </section>
        </div>
      </div>
    </StoreLayout>
  );
};

export default BlogIPTV;
