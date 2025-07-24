
import { useLanguage } from '@/contexts/LanguageContext';

export const parseMultilingualText = (text: string | null | undefined, fallbackLanguage: string = 'en'): Record<string, string> => {
  console.log('🔄 Parsing multilingual text:', text);
  
  if (!text) {
    console.log('❌ No text provided, returning empty object');
    return {};
  }
  
  // If it's already an object, return it
  if (typeof text === 'object' && text !== null) {
    console.log('✅ Text is already an object:', text);
    return text as Record<string, string>;
  }
  
  // If it's a string, try to parse it as JSON
  if (typeof text === 'string') {
    // Clean the string and try to parse it
    const cleanText = text.trim();
    
    // First check if it looks like JSON
    if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
      try {
        const parsed = JSON.parse(cleanText);
        console.log('✅ Successfully parsed JSON:', parsed);
        
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed as Record<string, string>;
        }
      } catch (error) {
        console.log('❌ Failed to parse JSON:', error);
        // If JSON parsing fails, treat as plain text
        return { [fallbackLanguage]: cleanText };
      }
    }
    
    // If it doesn't look like JSON, treat as plain text
    console.log('📝 Treating as plain text for fallback language:', fallbackLanguage);
    return { [fallbackLanguage]: cleanText };
  }
  
  console.log('❌ Unexpected text type, returning empty object');
  return {};
};

export const getLocalizedText = (multilingualText: string | null | undefined, currentLanguage: string, fallbackLanguage: string = 'en'): string => {
  console.log('🌐 Getting localized text for language:', currentLanguage);
  console.log('📝 Input text:', multilingualText);
  
  // Handle empty or null input
  if (!multilingualText) {
    console.log('❌ No multilingual text provided');
    return '';
  }
  
  const parsed = parseMultilingualText(multilingualText, fallbackLanguage);
  console.log('📋 Parsed object:', parsed);
  
  // If parsing resulted in empty object, return the original text
  if (Object.keys(parsed).length === 0) {
    console.log('⚠️ Empty parsed object, returning original text');
    return typeof multilingualText === 'string' ? multilingualText : '';
  }
  
  // Try to get text in current language
  if (parsed[currentLanguage]) {
    console.log('✅ Found text in current language:', parsed[currentLanguage]);
    return parsed[currentLanguage];
  }
  
  // Try fallback language
  if (parsed[fallbackLanguage]) {
    console.log('🔄 Using fallback language text:', parsed[fallbackLanguage]);
    return parsed[fallbackLanguage];
  }
  
  // Try any available language
  const availableLanguages = Object.keys(parsed);
  if (availableLanguages.length > 0) {
    const firstAvailable = parsed[availableLanguages[0]];
    console.log('🔄 Using first available language text:', firstAvailable);
    return firstAvailable;
  }
  
  // Final fallback - return original text if it's a string
  const finalFallback = typeof multilingualText === 'string' ? multilingualText : '';
  console.log('⚠️ Using original text as final fallback:', finalFallback);
  return finalFallback;
};

export const useLocalizedText = (multilingualText: string | null | undefined, fallbackLanguage: string = 'en'): string => {
  try {
    const { language } = useLanguage();
    
    console.log('🎯 useLocalizedText called with:');
    console.log('- Current language:', language);
    console.log('- Multilingual text:', multilingualText);
    console.log('- Fallback language:', fallbackLanguage);
    
    const result = getLocalizedText(multilingualText, language, fallbackLanguage);
    console.log('🎯 Final result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Error in useLocalizedText:', error);
    // Fallback to original text if hook fails
    return typeof multilingualText === 'string' ? multilingualText : '';
  }
};
