import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildBreadcrumbSchema } from '@/lib/seoSchemas';
import { SITE_URL } from '@/lib/seoTranslations';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { language } = useLanguage();
  const homeLabel =
    language === 'fr' ? 'Accueil' : language === 'ar' ? 'الرئيسية' : 'Home';

  const schemaItems = [
    { name: homeLabel, url: SITE_URL },
    ...items.map((it) => ({
      name: it.label,
      url: it.href ? `${SITE_URL}${it.href}` : SITE_URL,
    })),
  ];

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(buildBreadcrumbSchema(schemaItems))}
        </script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="container py-4">
        <ol className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
          <li>
            <Link
              to="/"
              className="flex items-center hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">{homeLabel}</span>
            </Link>
          </li>
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
              {item.href && idx < items.length - 1 ? (
                <Link
                  to={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-foreground font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
