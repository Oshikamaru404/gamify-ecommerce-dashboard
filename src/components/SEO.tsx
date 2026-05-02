import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  getSeoMeta,
  mapToSeoLang,
  SITE_URL,
  type SeoPageKey,
} from '@/lib/seoTranslations';

interface SEOProps {
  page: SeoPageKey;
  /** Override the default title for this page (e.g. for product detail pages) */
  titleOverride?: string;
  /** Override the default description for this page */
  descriptionOverride?: string;
  /** Custom canonical path. Defaults to current pathname. */
  canonicalPath?: string;
  /** Optional OG image URL (defaults to site OG image) */
  image?: string;
  /** Page type for OG (default: website). Use 'article' for blog posts, 'product' for products. */
  ogType?: 'website' | 'article' | 'product';
  /** Additional JSON-LD structured data objects to inject */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const LOCALE_MAP: Record<string, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  ar: 'ar_AR',
};

const SEO: React.FC<SEOProps> = ({
  page,
  titleOverride,
  descriptionOverride,
  canonicalPath,
  image,
  ogType = 'website',
  jsonLd,
}) => {
  const { language } = useLanguage();
  const location = useLocation();
  const seoLang = mapToSeoLang(language);
  const meta = getSeoMeta(page, language);

  const title = titleOverride || meta.title;
  const description = descriptionOverride || meta.description;
  const path = canonicalPath ?? location.pathname;
  const canonical = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/og-image.jpg`;

  // Build hreflang URLs (we keep the same path; the SPA serves the right
  // language via ?lang= query so search engines can index 3 versions).
  const hreflangs: { lang: string; href: string }[] = [
    { lang: 'en', href: `${SITE_URL}${path}?lang=en` },
    { lang: 'fr', href: `${SITE_URL}${path}?lang=fr` },
    { lang: 'ar', href: `${SITE_URL}${path}?lang=ar` },
    { lang: 'x-default', href: canonical },
  ];

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <html lang={seoLang} dir={seoLang === 'ar' ? 'rtl' : 'ltr'} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {meta.keywords && <meta name="keywords" content={meta.keywords} />}
      <link rel="canonical" href={canonical} />

      {/* Hreflang */}
      {hreflangs.map((h) => (
        <link key={h.lang} rel="alternate" hrefLang={h.lang} href={h.href} />
      ))}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="BWIVOX IPTV" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={LOCALE_MAP[seoLang]} />
      {Object.entries(LOCALE_MAP)
        .filter(([k]) => k !== seoLang)
        .map(([, v]) => (
          <meta key={v} property="og:locale:alternate" content={v} />
        ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured data */}
      {jsonLdArray.map((data, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
