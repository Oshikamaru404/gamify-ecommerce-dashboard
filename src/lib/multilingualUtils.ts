
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
 * Generate a URL-friendly slug from a package name (handles JSON multilingual names).
 * Always extracts the English text first, then slugifies.
 */
export const generateProductSlug = (name: string | null | undefined, category?: string): string => {
  const localized = getLocalizedText(name, 'en', 'en');
  const baseSlug = localized
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .trim();
  
  if (category === 'activation-player') {
    return `${baseSlug}-activation`;
  }
  return baseSlug;
};
