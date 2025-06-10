
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

const Blog = () => {
  const articles = [
    {
      title: "Guide complet pour configurer votre IPTV",
      excerpt: "Apprenez à configurer votre service IPTV sur tous vos appareils avec notre guide détaillé.",
      date: "2024-01-15",
      author: "Équipe BWIVOX"
    },
    {
      title: "Les avantages de l'IPTV 8K",
      excerpt: "Découvrez pourquoi la qualité 8K révolutionne votre expérience de streaming.",
      date: "2024-01-10",
      author: "Équipe BWIVOX"
    },
    {
      title: "Choisir le bon player IPTV",
      excerpt: "Comparatif des meilleurs players IPTV pour optimiser votre expérience.",
      date: "2024-01-05",
      author: "Équipe BWIVOX"
    },
    {
      title: "IPTV vs Télévision traditionnelle",
      excerpt: "Pourquoi l'IPTV est l'avenir du divertissement à domicile.",
      date: "2024-01-01",
      author: "Équipe BWIVOX"
    }
  ];

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

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <Card key={index} className="p-8 hover:shadow-2xl transition-all bg-white">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{article.title}</h3>
                <p className="text-gray-600 mb-6">{article.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(article.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    {article.author}
                  </div>
                </div>
              </Card>
            ))}
          </div>

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
