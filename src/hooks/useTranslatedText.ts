
import { useTranslatedContent } from '@/hooks/useTranslatedContent';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslatedText = () => {
  const { language } = useLanguage();
  const { data: translatedContent } = useTranslatedContent();

  const getTranslatedText = (contentKey: string, fallback: string = ''): string => {
    if (!translatedContent) return fallback;
    
    const content = translatedContent.find(
      item => item.content_key === contentKey && item.language_code === language
    );
    
    if (content) {
      return content.content_value;
    }
    
    // Try English as fallback
    const englishContent = translatedContent.find(
      item => item.content_key === contentKey && item.language_code === 'en'
    );
    
    if (englishContent) {
      return englishContent.content_value;
    }
    
    return fallback;
  };

  return { getTranslatedText };
};
