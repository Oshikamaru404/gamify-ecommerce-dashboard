
export type CountryCode = 'FR' | 'US' | 'ES' | 'SA' | 'DE' | 'GB' | 'CA' | 'MX' | 'AR' | 'EG' | 'MA' | 'TN' | 'DZ' | 'AT' | 'CH';

export const getLanguageFromCountry = (countryCode: string): string => {
  const countryToLanguage: Record<string, string> = {
    'FR': 'fr',
    'BE': 'fr',
    'CH': 'fr',
    'CA': 'fr',
    'US': 'en',
    'GB': 'en',
    'AU': 'en',
    'NZ': 'en',
    'IE': 'en',
    'ZA': 'en',
    'ES': 'es',
    'MX': 'es',
    'AR': 'es',
    'CO': 'es',
    'PE': 'es',
    'VE': 'es',
    'CL': 'es',
    'EC': 'es',
    'GT': 'es',
    'CU': 'es',
    'BO': 'es',
    'HN': 'es',
    'PY': 'es',
    'SV': 'es',
    'NI': 'es',
    'CR': 'es',
    'PA': 'es',
    'UY': 'es',
    'PR': 'es',
    'DO': 'es',
    'SA': 'ar',
    'AE': 'ar',
    'EG': 'ar',
    'MA': 'ar',
    'TN': 'ar',
    'DZ': 'ar',
    'LB': 'ar',
    'SY': 'ar',
    'JO': 'ar',
    'IQ': 'ar',
    'KW': 'ar',
    'QA': 'ar',
    'BH': 'ar',
    'OM': 'ar',
    'YE': 'ar',
    'LY': 'ar',
    'SD': 'ar',
    'DE': 'de',
    'AT': 'de',
    'LU': 'de',
    'LI': 'de',
  };
  
  return countryToLanguage[countryCode] || 'fr';
};

export const detectLanguageFromIP = async (): Promise<string> => {
  try {
    console.log('🌍 Détection de la langue basée sur la géolocalisation IP...');
    
    // Utiliser ipapi.co pour obtenir le pays basé sur l'IP
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Échec de la géolocalisation IP');
    }
    
    const data = await response.json();
    console.log('📍 Données de géolocalisation:', data);
    
    if (data.country_code) {
      const detectedLanguage = getLanguageFromCountry(data.country_code);
      console.log(`🗺️ Langue détectée par IP: ${detectedLanguage} (pays: ${data.country_code})`);
      return detectedLanguage;
    }
  } catch (error) {
    console.warn('⚠️ Erreur lors de la détection par IP:', error);
  }
  
  return 'fr'; // Langue par défaut
};

export const detectLanguageFromBrowser = (): string => {
  console.log('🌐 Détection de la langue du navigateur...');
  
  // Obtenir toutes les langues préférées du navigateur
  const languages = navigator.languages || [navigator.language];
  console.log('🗣️ Langues du navigateur:', languages);
  
  for (const lang of languages) {
    const langCode = lang.toLowerCase();
    
    if (langCode.startsWith('fr')) {
      console.log('🇫🇷 Langue détectée: Français');
      return 'fr';
    }
    if (langCode.startsWith('en')) {
      console.log('🇺🇸 Langue détectée: Anglais');
      return 'en';
    }
    if (langCode.startsWith('es')) {
      console.log('🇪🇸 Langue détectée: Espagnol');
      return 'es';
    }
    if (langCode.startsWith('ar')) {
      console.log('🇸🇦 Langue détectée: Arabe');
      return 'ar';
    }
    if (langCode.startsWith('de')) {
      console.log('🇩🇪 Langue détectée: Allemand');
      return 'de';
    }
  }
  
  console.log('🔤 Aucune langue supportée détectée, utilisation du français par défaut');
  return 'fr';
};

export const autoDetectLanguage = async (): Promise<string> => {
  console.log('🚀 Début de la détection automatique de langue...');
  
  // D'abord essayer la géolocalisation IP
  const ipLanguage = await detectLanguageFromIP();
  if (ipLanguage !== 'fr') {
    console.log(`✅ Langue finale sélectionnée: ${ipLanguage} (basée sur IP)`);
    return ipLanguage;
  }
  
  // Si la géolocalisation IP échoue ou retourne français, utiliser la langue du navigateur
  const browserLanguage = detectLanguageFromBrowser();
  console.log(`✅ Langue finale sélectionnée: ${browserLanguage} (basée sur navigateur)`);
  return browserLanguage;
};
