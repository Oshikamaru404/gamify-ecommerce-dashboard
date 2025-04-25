
import React from 'react';
import { Link } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Grid3X3, Film, Music, Microchip, Code, BookOpen, Shield, GraduationCap } from 'lucide-react';

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
  <Card className={cn("overflow-hidden transition-all hover:shadow-lg hover:scale-105", bgColor)}>
    <div className="p-8">
      <h3 className="mb-3 text-xl font-semibold">{name}</h3>
      <div className="mb-6">
        {isTrial ? (
          <div className="text-2xl font-bold text-primary">ESSAI GRATUIT</div>
        ) : (
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-primary">${price.toFixed(2)}</span>
            <span className="ml-2 text-sm text-muted-foreground">/ mois</span>
          </div>
        )}
      </div>
      <ul className="mb-8 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <span className="text-primary text-lg">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button className="w-full rounded-full text-md py-6">
        {isTrial ? 'Essayer Gratuitement' : 'Acheter Maintenant'}
      </Button>
    </div>
  </Card>
);

const ServiceCategory = ({ icon: Icon, name, color }: { icon: any, name: string, color: string }) => (
  <Link to={`/products?category=${name.toLowerCase()}`}>
    <div className={cn(
      "group flex flex-col items-center rounded-xl p-6 transition-all hover:shadow-lg cursor-pointer min-w-32",
      color
    )}>
      <Icon className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-medium">{name}</span>
    </div>
  </Link>
);

const PlatformSection = () => {
  const categories = [
    { icon: Grid3X3, name: 'Tous', color: 'bg-soft-blue' },
    { icon: Film, name: 'SVOD', color: 'bg-soft-purple' },
    { icon: Music, name: 'Musique', color: 'bg-soft-green' },
    { icon: Microchip, name: 'IA', color: 'bg-soft-peach' },
    { icon: Code, name: 'Logiciel', color: 'bg-soft-yellow' },
    { icon: BookOpen, name: 'En lisant', color: 'bg-soft-blue' },
    { icon: Shield, name: 'Sécurité', color: 'bg-soft-purple' },
    { icon: GraduationCap, name: 'Learning', color: 'bg-soft-green' },
  ];

  return (
    <div className="flex justify-center gap-4 overflow-x-auto py-8 px-4">
      {categories.map((category) => (
        <ServiceCategory
          key={category.name}
          icon={category.icon}
          name={category.name}
          color={category.color}
        />
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
      name: "Pack Digital Premium",
      price: 29.99,
      features: [
        "Accès à ChatGPT-4",
        "Netflix Standard",
        "Spotify Premium",
        "1 compte partageable",
        "Support prioritaire 24/7"
      ],
      bgColor: "bg-soft-blue"
    },
    {
      name: "Pack Streaming Plus",
      price: 19.99,
      features: [
        "Disney+ Premium",
        "Netflix Basic",
        "Prime Video",
        "1 compte partageable",
        "Support standard"
      ],
      bgColor: "bg-soft-purple"
    },
    {
      name: "Pack Productivité",
      price: 24.99,
      features: [
        "Microsoft 365",
        "ChatGPT Plus",
        "Grammarly Premium",
        "1 compte partageable",
        "Support premium"
      ],
      bgColor: "bg-soft-green"
    }
  ];

  return (
    <StoreLayout>
      <div className="container py-8">
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Accédez à vos services préférés à prix réduit
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Abonnements partagés premium pour tous vos services numériques favoris
          </p>
          <PlatformSection />
        </section>

        <section className="mb-16">
          <div className="grid gap-8 md:grid-cols-3">
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
