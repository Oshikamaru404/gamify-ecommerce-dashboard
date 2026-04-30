
import { useLanguage } from '@/contexts/LanguageContext';

export const parseMultilingualText = (text: string | null | undefined, fallbackLanguage: string = 'en'): Record<string, string> => {
  if (!text) return {};
  
  try {
    const parsed = JSON.parse(text);
    return typeof parsed === 'object' && parsed !== null ? parsed : { [fallbackLanguage]: text };
  } catch {
    return { [fallbackLanguage]: text };
  }
};

export const getLocalizedText = (multilingualText: string | null | undefined, currentLanguage: string, fallbackLanguage: string = 'en'): string => {
  const parsed = parseMultilingualText(multilingualText, fallbackLanguage);
  return parsed[currentLanguage] || parsed[fallbackLanguage] || multilingualText || '';
};

export const useLocalizedText = (multilingualText: string | null | undefined, fallbackLanguage: string = 'en'): string => {
  const { language } = useLanguage();
  return getLocalizedText(multilingualText, language, fallbackLanguage);
};

/**
 * Slugify a single string (lowercase, dashes, strip non-word chars).
 */
const slugifyString = (s: string): string =>
  s.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Generate the canonical URL slug for a package (always based on the English name).
 */
export const generateProductSlug = (name: string | null | undefined, category?: string): string => {
  const localized = getLocalizedText(name, 'en', 'en').trim();
  const baseSlug = slugifyString(localized);

  if (category === 'activation-player') {
    return `${baseSlug}-activation`;
  }
  return baseSlug;
};

/**
 * Return all slug variants a package can be matched by (every translated name).
 * Useful for backward-compat with links generated from a non-English UI.
 */
export const getAllProductSlugs = (name: string | null | undefined, category?: string): string[] => {
  const parsed = parseMultilingualText(name, 'en');
  const variants = new Set<string>();
  Object.values(parsed).forEach((v) => {
    if (!v) return;
    const base = slugifyString(String(v).trim());
    if (!base) return;
    variants.add(category === 'activation-player' ? `${base}-activation` : base);
  });
  // Always include the canonical English slug too
  variants.add(generateProductSlug(name, category));
  return Array.from(variants).filter(Boolean);
};
