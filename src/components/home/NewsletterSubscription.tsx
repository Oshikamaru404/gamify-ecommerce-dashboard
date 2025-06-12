
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Send } from 'lucide-react';
import { useSubscribeNewsletter } from '@/hooks/useNewsletter';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const subscribeNewsletter = useSubscribeNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    try {
      await subscribeNewsletter.mutateAsync(email.trim());
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
    }
  };

  return (
    <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
      <div className="container text-center">
        <div className="max-w-2xl mx-auto">
          <Mail className="w-12 h-12 mx-auto mb-6 text-red-200" />
          <h3 className="text-3xl font-bold mb-4">
            Stay Updated with BWIVOX IPTV
          </h3>
          <p className="text-xl text-red-100 mb-8">
            Subscribe to our newsletter for the latest updates, special offers, and IPTV news
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 text-gray-900 border-0 rounded-lg focus:ring-2 focus:ring-red-300"
              required
            />
            <Button
              type="submit"
              disabled={subscribeNewsletter.isPending}
              className="bg-white text-red-600 hover:bg-red-50 px-6 py-3 font-semibold rounded-lg transition-colors duration-200"
            >
              {subscribeNewsletter.isPending ? (
                'Subscribing...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Subscribe
                </>
              )}
            </Button>
          </form>
          
          <p className="text-sm text-red-200 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscription;
