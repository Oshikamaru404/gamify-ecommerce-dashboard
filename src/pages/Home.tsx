
import React from 'react';
import { Link } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import ProductCard from '@/components/store/ProductCard';
import { products } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-to-b from-soft-blue to-background py-16 md:py-24">
    <div className="container relative z-10">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Gaming Without Limits
        </h1>
        <p className="mb-8 text-lg text-muted-foreground md:text-xl">
          Discover the best gaming experiences with instant digital delivery. Find game codes for all platforms at the best prices.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 md:justify-center">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/products">Browse Games</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/admin">Admin Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
    <div className="absolute inset-0 z-0 opacity-20" style={{ 
      backgroundImage: 'url("https://placekitten.com/1200/800")', 
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }} />
  </section>
);

const FeaturedGames = () => {
  const featuredProducts = products.filter(product => product.featured);
  
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Featured Games</h2>
            <p className="mt-1 text-muted-foreground">Our handpicked selection of the best games available.</p>
          </div>
          <Link to="/products" className="hidden text-sm font-medium text-primary hover:underline sm:block">
            View all games →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link to="/products">View all games</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const PlatformSection = () => {
  const platforms = [
    { name: 'PC Games', icon: '🖥️', slug: 'pc', bgColor: 'bg-soft-blue' },
    { name: 'PlayStation', icon: '🎮', slug: 'playstation', bgColor: 'bg-soft-purple' },
    { name: 'Xbox', icon: '🎯', slug: 'xbox', bgColor: 'bg-soft-green' },
    { name: 'Nintendo', icon: '🎲', slug: 'nintendo', bgColor: 'bg-soft-peach' },
    { name: 'Mobile', icon: '📱', slug: 'mobile', bgColor: 'bg-soft-yellow' },
  ];
  
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Shop by Platform</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {platforms.map((platform) => (
            <Link
              key={platform.slug}
              to={`/products?platform=${platform.slug}`}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg p-6 text-center transition-all hover:shadow-md",
                platform.bgColor
              )}
            >
              <span className="mb-2 text-3xl">{platform.icon}</span>
              <span className="font-medium">{platform.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Instant Delivery',
      description: 'Get your game codes instantly after purchase via email.'
    },
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'All transactions are protected with industry-standard security.'
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'We offer competitive prices and regular discounts on top games.'
    },
    {
      icon: '🌟',
      title: '24/7 Support',
      description: 'Our customer service team is always available to help.'
    }
  ];
  
  return (
    <section className="bg-soft-gray py-12 md:py-16">
      <div className="container">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Why Choose GamsGo?</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="rounded-lg bg-card p-6 text-center shadow-sm">
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <StoreLayout>
      <Hero />
      <FeaturedGames />
      <PlatformSection />
      <WhyChooseUs />
    </StoreLayout>
  );
};

export default Home;
