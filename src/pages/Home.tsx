
import React from 'react';
import { Link } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Tv, Film, Play, Globe, Laptop, Shield, Zap, Video } from 'lucide-react';

const ProductSubscriptionCard = ({ 
  name, 
  price, 
  isTrial,
  features,
  bgColor = 'bg-[#1A1F2C]',
  accentColor = 'text-[#0EA5E9]'
}: {
  name: string;
  price: number;
  isTrial?: boolean;
  features: string[];
  bgColor?: string;
  accentColor?: string;
}) => (
  <Card className={cn("overflow-hidden transition-all hover:shadow-xl transform hover:scale-105", bgColor)}>
    <div className="p-10 text-white">
      <h3 className="mb-4 text-2xl font-bold">{name}</h3>
      <div className="mb-8">
        {isTrial ? (
          <div className={cn("text-3xl font-extrabold", accentColor)}>ESSAI GRATUIT</div>
        ) : (
          <div className="flex items-baseline">
            <span className={cn("text-5xl font-bold", accentColor)}>${price.toFixed(2)}</span>
            <span className="ml-2 text-base text-gray-300">/ mois</span>
          </div>
        )}
      </div>
      <ul className="mb-10 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-base">
            <span className={cn("text-lg", accentColor)}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button className={cn("w-full rounded-full text-lg py-6 bg-opacity-90 hover:bg-opacity-100", 
        isTrial ? "bg-[#8B5CF6] hover:bg-[#7C3AED]" : "bg-[#0EA5E9] hover:bg-[#0284C7]")}>
        {isTrial ? 'Essayer Gratuitement' : 'S\'abonner Maintenant'}
      </Button>
    </div>
  </Card>
);

const ServiceCategory = ({ icon: Icon, name, bgColor, iconColor }: { 
  icon: any, 
  name: string, 
  bgColor: string,
  iconColor: string 
}) => (
  <Link to={`/products?category=${name.toLowerCase()}`}>
    <div className={cn(
      "group flex flex-col items-center rounded-xl p-8 transition-all hover:shadow-2xl cursor-pointer min-w-40 transform hover:scale-105",
      bgColor
    )}>
      <Icon className={cn("h-12 w-12 mb-4 group-hover:scale-125 transition-transform", iconColor)} />
      <span className="text-base font-bold text-white">{name}</span>
    </div>
  </Link>
);

const PlatformSection = () => {
  const categories = [
    { icon: Tv, name: 'Chaînes Live', bgColor: 'bg-[#1A1F2C]', iconColor: 'text-[#0EA5E9]' },
    { icon: Film, name: 'Films', bgColor: 'bg-[#1E293B]', iconColor: 'text-[#8B5CF6]' },
    { icon: Video, name: 'Séries', bgColor: 'bg-[#1A1F2C]', iconColor: 'text-[#F97316]' },
    { icon: Play, name: 'Sports', bgColor: 'bg-[#1E293B]', iconColor: 'text-[#10B981]' },
    { icon: Laptop, name: 'VOD', bgColor: 'bg-[#1A1F2C]', iconColor: 'text-[#EC4899]' },
    { icon: Globe, name: 'International', bgColor: 'bg-[#1E293B]', iconColor: 'text-[#F59E0B]' }
  ];

  return (
    <div className="flex justify-center gap-6 py-10 px-4 overflow-x-auto">
      {categories.map((category) => (
        <ServiceCategory
          key={category.name}
          icon={category.icon}
          name={category.name}
          bgColor={category.bgColor}
          iconColor={category.iconColor}
        />
      ))}
    </div>
  );
};

const WhyChooseUs = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Ultra Rapide',
      description: 'Streaming sans tampon avec notre infrastructure optimisée'
    },
    {
      icon: '🔒',
      title: 'Sécurité Maximale',
      description: 'Connexions cryptées et navigation privée garantie'
    },
    {
      icon: '💬',
      title: 'Support 24/7',
      description: 'Notre équipe technique est disponible à tout moment'
    },
    {
      icon: '💻',
      title: 'Multi-appareils',
      description: 'Compatible avec Smart TV, Android, iOS, PC et Mac'
    }
  ];

  return (
    <section className="py-20 bg-[#111827]">
      <div className="container">
        <h2 className="mb-16 text-center text-4xl font-bold text-white">
          Pourquoi choisir BWIVOX ?
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 text-center bg-[#1A1F2C] border-none hover:shadow-xl transition-all hover:transform hover:scale-105">
              <div className="mb-6 text-5xl">{feature.icon}</div>
              <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-base text-gray-300">{feature.description}</p>
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
      text: "La qualité de l'image est exceptionnelle, même sur les chaînes internationales. Je recommande vivement !"
    },
    {
      avatar: "https://placekitten.com/101/101",
      name: "Pierre L.",
      text: "Le rapport qualité-prix est imbattable. Plus de 8000 chaînes et un catalogue VOD impressionnant."
    },
    {
      avatar: "https://placekitten.com/102/102",
      name: "Sophie M.",
      text: "L'interface est intuitive et le support client est très réactif. Parfait pour toute la famille."
    }
  ];

  return (
    <section className="bg-[#111827] py-20">
      <div className="container">
        <h2 className="mb-4 text-center text-4xl font-bold text-white">
          99% de clients satisfaits
        </h2>
        <p className="text-center text-xl text-gray-300 mb-16">
          Rejoignez notre communauté de téléspectateurs satisfaits
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 bg-[#1A1F2C] border-none hover:shadow-xl transition-all">
              <div className="flex flex-col items-center text-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-20 w-20 rounded-full mb-6 border-4 border-[#0EA5E9]"
                />
                <h4 className="font-bold text-xl text-white mb-2">{testimonial.name}</h4>
                <p className="text-base text-gray-300">{testimonial.text}</p>
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
      name: "BWIVOX Standard",
      price: 9.99,
      features: [
        "Plus de 5000 chaînes en direct",
        "Films et séries en VOD",
        "Qualité HD",
        "Compatible avec 2 appareils",
        "Support par email"
      ],
      bgColor: "bg-[#1A1F2C]",
      accentColor: "text-[#0EA5E9]"
    },
    {
      name: "BWIVOX Premium",
      price: 19.99,
      features: [
        "Plus de 8000 chaînes en direct",
        "Catalogue VOD complet",
        "Qualité Full HD & 4K",
        "Compatible avec 4 appareils",
        "Support prioritaire 24/7"
      ],
      bgColor: "bg-[#1E293B]",
      accentColor: "text-[#8B5CF6]"
    },
    {
      name: "BWIVOX Ultimate",
      price: 29.99,
      features: [
        "Plus de 10000 chaînes en direct",
        "VOD Premium + Nouveautés",
        "Qualité 4K Ultra HD",
        "Compatible avec 6 appareils",
        "Support VIP & installation"
      ],
      bgColor: "bg-[#0F172A]",
      accentColor: "text-[#F97316]"
    }
  ];

  return (
    <StoreLayout>
      <div className="bg-gradient-to-b from-[#0F172A] to-[#111827] text-white">
        <div className="container py-16">
          <section className="mb-20 text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-6xl">
              BWIVOX <span className="text-[#0EA5E9]">IPTV</span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-300">
              Le service de streaming IPTV premium avec plus de 10 000 chaînes en direct,
              films et séries du monde entier en qualité HD et 4K.
            </p>
            <PlatformSection />
          </section>

          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-16">Nos Forfaits <span className="text-[#0EA5E9]">Premium</span></h2>
            <div className="grid gap-8 md:grid-cols-3">
              {subscriptionProducts.map((product, index) => (
                <ProductSubscriptionCard key={index} {...product} />
              ))}
            </div>
          </section>

          <WhyChooseUs />
          <Testimonials />
        </div>
      </div>
    </StoreLayout>
  );
};

export default Home;
