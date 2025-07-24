
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
