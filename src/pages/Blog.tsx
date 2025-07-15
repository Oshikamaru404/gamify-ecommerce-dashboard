
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';
import { useBlogArticles } from '@/hooks/useBlogArticles';

const Blog = () => {
  const { data: articles, isLoading, error } = useBlogArticles();

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
                <Card key={article.id} className="p-8 hover:shadow-2xl transition-all bg-white">
                  {article.featured_image_url && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{article.title}</h3>
                  <p className="text-gray-600 mb-6">{article.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      {article.author}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 text-xl">Aucun article disponible pour le moment.</p>
            </div>
          )}

          <section className="mt-20 bg-red-600 text-white rounded-lg p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">Restez informé</h2>
            <p className="text-xl mb-8">
              Suivez notre blog pour les dernières actualités IPTV et nos conseils d'experts
            </p>
          </section>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Blog;
