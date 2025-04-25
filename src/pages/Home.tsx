
import React from 'react';
import { Link } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

const ProductSubscriptionCard = ({ 
  name, 
  price, 
  isTrial,
  features,
  bgColor = 'bg-soft-blue'
}: {
  name: string;
  price: number;
  isTrial?: boolean;
  features: string[];
  bgColor?: string;
}) => (
  <Card className={cn("overflow-hidden transition-all hover:shadow-lg", bgColor)}>
    <div className="p-6">
      <h3 className="mb-2 text-lg font-semibold">{name}</h3>
      <div className="mb-4">
        {isTrial ? (
          <div className="text-2xl font-bold text-primary">ESSAI GRATUIT</div>
        ) : (
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-primary">${price.toFixed(2)}</span>
            <span className="ml-1 text-sm text-muted-foreground">/ mois</span>
          </div>
        )}
      </div>
      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className="text-primary">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button className="w-full rounded-full">
        {isTrial ? 'Essayer Gratuitement' : 'Acheter Maintenant'}
      </Button>
    </div>
  </Card>
);

const PlatformSection = () => {
  const platforms = [
    { name: 'PC', icon: '🖥️', color: 'bg-soft-blue' },
    { name: 'PlayStation', icon: '🎮', color: 'bg-soft-purple' },
    { name: 'Xbox', icon: '🎯', color: 'bg-soft-green' },
    { name: 'Nintendo', icon: '🎲', color: 'bg-soft-peach' },
    { name: 'Mobile', icon: '📱', color: 'bg-soft-yellow' },
  ];

  return (
    <div className="flex justify-center gap-4 overflow-x-auto py-8">
      {platforms.map((platform) => (
        <div
          key={platform.name}
          className={cn(
            "flex min-w-20 flex-col items-center rounded-lg p-4 text-center transition-all hover:shadow-md",
            platform.color
          )}
        >
          <span className="text-2xl">{platform.icon}</span>
          <span className="mt-2 text-sm font-medium">{platform.name}</span>
        </div>
      ))}
    </div>
  );
};

const WhyChooseUs = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Livraison en temps réel',
      description: 'Recevez vos codes instantanément après l\'achat'
    },
    {
      icon: '🔒',
      title: 'Sécurité SSL',
      description: 'Transactions protégées par un certificat SSL'
    },
    {
      icon: '💬',
      title: 'Service 24/7',
      description: 'Support client disponible à tout moment'
    },
    {
      icon: '💰',
      title: 'Garantie de remboursement',
      description: 'Satisfait ou remboursé sous 30 jours'
    }
  ];

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Pourquoi choisir GamsGo ?
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      avatar: "https://placekitten.com/100/100",
      name: "Marie D.",
      text: "Excellent service! Les codes sont livrés instantanément."
    },
    {
      avatar: "https://placekitten.com/101/101",
      name: "Pierre L.",
      text: "Les meilleurs prix que j'ai trouvés pour les jeux en ligne."
    },
    {
      avatar: "https://placekitten.com/102/102",
      name: "Sophie M.",
      text: "Le support client est très réactif et professionnel."
    }
  ];

  return (
    <section className="bg-soft-gray py-16">
      <div className="container">
        <h2 className="mb-2 text-center text-3xl font-bold">
          98% des utilisateurs satisfaits
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.text}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const subscriptionProducts = [
    {
      name: "ChatGPT 4.0 (Plus)",
      price: 15.54,
      features: [
        "Accès à GPT-4",
        "Réponses plus rapides",
        "Priorité aux heures de pointe"
      ],
      bgColor: "bg-soft-blue"
    },
    {
      name: "ChatGPT (Web)",
      price: 0,
      isTrial: true,
      features: [
        "Version de base",
        "Parfait pour découvrir",
        "Fonctionnalités essentielles"
      ],
      bgColor: "bg-soft-green"
    },
    {
      name: "Perplexity AI",
      price: 16.67,
      features: [
        "IA avancée",
        "Recherche intelligente",
        "Support premium"
      ],
      bgColor: "bg-soft-purple"
    }
  ];

  return (
    <StoreLayout>
      <div className="container py-8">
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Partagez l'abonnement premium avec un prix inférieur sur GamsGo
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Toutes les stratégies en règle duclée et adresses caviardé à vie.
          </p>
          <PlatformSection />
        </section>

        <section className="mb-16">
          <div className="grid gap-6 md:grid-cols-3">
            {subscriptionProducts.map((product, index) => (
              <ProductSubscriptionCard key={index} {...product} />
            ))}
          </div>
        </section>

        <WhyChooseUs />
        <Testimonials />
      </div>
    </StoreLayout>
  );
};

export default Home;
