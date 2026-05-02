import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Tv,
  Zap,
  Users,
  BookOpen,
  MessageCircle,
  Star,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export type InternalLinkKey =
  | 'subscription'
  | 'activation'
  | 'reseller'
  | 'blog'
  | 'reviews'
  | 'support';

interface LinkCard {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  titleEn: string;
  titleFr: string;
  titleAr: string;
  descEn: string;
  descFr: string;
  descAr: string;
}

const ALL_LINKS: Record<InternalLinkKey, LinkCard> = {
  subscription: {
    to: '/subscription',
    icon: Tv,
    titleEn: 'IPTV Subscriptions',
    titleFr: 'Abonnements IPTV',
    titleAr: 'اشتراكات IPTV',
    descEn:
      '20,000+ live channels in 4K with 30-day money-back guarantee.',
    descFr:
      '+20 000 chaînes en direct en 4K avec garantie 30 jours satisfait ou remboursé.',
    descAr:
      'أكثر من 20,000 قناة مباشرة بدقة 4K مع ضمان استرداد المال لمدة 30 يومًا.',
  },
  activation: {
    to: '/activation',
    icon: Zap,
    titleEn: 'Activation Packages',
    titleFr: "Packages d'Activation",
    titleAr: 'باقات التفعيل',
    descEn:
      'Instant IPTV activation for Smart TV, Firestick, Android, iOS and MAG.',
    descFr:
      'Activation IPTV instantanée pour Smart TV, Firestick, Android, iOS et MAG.',
    descAr:
      'تفعيل IPTV الفوري لـ Smart TV و Firestick و Android و iOS و MAG.',
  },
  reseller: {
    to: '/reseller',
    icon: Users,
    titleEn: 'Become a Reseller',
    titleFr: 'Devenir Revendeur',
    titleAr: 'كن موزعًا',
    descEn:
      'Launch your IPTV business with our reseller panel and best wholesale prices.',
    descFr:
      'Lancez votre activité IPTV avec notre panel revendeur et les meilleurs prix grossistes.',
    descAr:
      'ابدأ نشاطك التجاري في IPTV مع لوحة الموزع لدينا وأفضل أسعار الجملة.',
  },
  blog: {
    to: '/blog',
    icon: BookOpen,
    titleEn: 'IPTV Blog & Guides',
    titleFr: 'Blog & Guides IPTV',
    titleAr: 'مدونة وأدلة IPTV',
    descEn: 'Setup tutorials, app reviews and the latest IPTV news.',
    descFr:
      "Tutoriels d'installation, tests d'applications et dernières actualités IPTV.",
    descAr: 'دروس التثبيت، مراجعات التطبيقات وأحدث أخبار IPTV.',
  },
  reviews: {
    to: '/full-reviews',
    icon: Star,
    titleEn: 'Customer Reviews',
    titleFr: 'Avis Clients',
    titleAr: 'آراء العملاء',
    descEn: 'Read genuine reviews from BWIVOX customers worldwide.',
    descFr: 'Lisez les avis authentiques des clients BWIVOX dans le monde entier.',
    descAr: 'اقرأ آراء حقيقية من عملاء BWIVOX حول العالم.',
  },
  support: {
    to: '/support',
    icon: MessageCircle,
    titleEn: '24/7 Support',
    titleFr: 'Support 24/7',
    titleAr: 'دعم 24/7',
    descEn: 'WhatsApp, email and live chat — we answer in minutes.',
    descFr:
      'WhatsApp, email et chat en direct — nous répondons en quelques minutes.',
    descAr: 'WhatsApp والبريد الإلكتروني والدردشة المباشرة — نرد في دقائق.',
  },
};

interface InternalLinksSectionProps {
  exclude?: InternalLinkKey[];
  limit?: number;
  title?: string;
}

const InternalLinksSection: React.FC<InternalLinksSectionProps> = ({
  exclude = [],
  limit = 4,
  title,
}) => {
  const { language } = useLanguage();
  const lang = (['en', 'fr', 'ar'].includes(language)
    ? language
    : 'en') as 'en' | 'fr' | 'ar';

  const sectionTitle =
    title ||
    (lang === 'fr'
      ? 'Découvrir aussi'
      : lang === 'ar'
      ? 'اكتشف أيضًا'
      : 'Discover also');
  const ctaLabel =
    lang === 'fr' ? 'Voir' : lang === 'ar' ? 'عرض' : 'View';

  const cards = (Object.entries(ALL_LINKS) as [InternalLinkKey, LinkCard][])
    .filter(([key]) => !exclude.includes(key))
    .slice(0, limit);

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          {sectionTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(([key, card]) => {
            const Icon = card.icon;
            const cardTitle =
              lang === 'fr'
                ? card.titleFr
                : lang === 'ar'
                ? card.titleAr
                : card.titleEn;
            const desc =
              lang === 'fr'
                ? card.descFr
                : lang === 'ar'
                ? card.descAr
                : card.descEn;
            return (
              <Link
                key={key}
                to={card.to}
                className="group block bg-card rounded-2xl p-6 border border-border hover:border-primary hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {cardTitle}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {desc}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  {ctaLabel} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InternalLinksSection;
