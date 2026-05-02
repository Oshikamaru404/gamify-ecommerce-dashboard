// JSON-LD schema builders for structured data (SEO rich snippets)
import { SITE_URL } from './seoTranslations';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BWIVOX IPTV',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    description:
      'Premium 4K IPTV subscription provider offering 20,000+ live channels, full VOD library, and worldwide instant activation.',
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BWIVOX IPTV',
    url: SITE_URL,
    inLanguage: ['en', 'fr', 'ar'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface ProductSchemaInput {
  name: string;
  description: string;
  image?: string;
  price: number;
  currency?: string;
  url: string;
  rating?: { value: number; count: number };
}

export function buildProductSchema(p: ProductSchemaInput) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    url: p.url,
    brand: { '@type': 'Brand', name: 'BWIVOX' },
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: p.currency || 'EUR',
      availability: 'https://schema.org/InStock',
      url: p.url,
    },
  };
  if (p.image) schema.image = p.image;
  if (p.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: p.rating.value,
      reviewCount: p.rating.count,
    };
  }
  return schema;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: it.answer,
      },
    })),
  };
}

export interface ArticleSchemaInput {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
  inLanguage?: string;
}

export function buildArticleSchema(a: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.headline,
    description: a.description,
    image: a.image,
    datePublished: a.datePublished,
    dateModified: a.dateModified || a.datePublished,
    author: { '@type': 'Organization', name: a.author || 'BWIVOX' },
    publisher: {
      '@type': 'Organization',
      name: 'BWIVOX',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.png` },
    },
    mainEntityOfPage: a.url,
    inLanguage: a.inLanguage || 'en',
  };
}
