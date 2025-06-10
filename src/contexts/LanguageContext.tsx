
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslation, Translations } from '@/lib/translations';
import { autoDetectLanguage } from '@/lib/geolocation';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
  isRTL: boolean;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'preferred_language';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fr');
  const [isLoading, setIsLoading] = useState(true);

  // Initialiser la langue au chargement
  useEffect(() => {
    const initializeLanguage = async () => {
      console.log('🔄 Initialisation de la langue...');
      
      // Vérifier si l'utilisateur a déjà une préférence sauvegardée
      const storedLanguage = localStorage.getItem(STORAGE_KEY);
      if (storedLanguage && ['fr', 'en', 'es', 'ar', 'de'].includes(storedLanguage)) {
        console.log(`💾 Langue sauvegardée trouvée: ${storedLanguage}`);
        setLanguageState(storedLanguage as Language);
        setIsLoading(false);
        return;
      }
      
      try {
        // Détecter automatiquement la langue
        const detectedLanguage = await autoDetectLanguage();
        console.log(`🎯 Langue détectée automatiquement: ${detectedLanguage}`);
        setLanguageState(detectedLanguage as Language);
        
        // Sauvegarder la langue détectée pour les prochaines visites
        localStorage.setItem(STORAGE_KEY, detectedLanguage);
      } catch (error) {
        console.error('❌ Erreur lors de la détection de langue:', error);
        setLanguageState('fr'); // Fallback vers français
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, []);

  const setLanguage = (newLanguage: Language) => {
    console.log(`🔄 Changement de langue: ${language} → ${newLanguage}`);
    setLanguageState(newLanguage);
    localStorage.setItem(STORAGE_KEY, newLanguage);
  };

  const t = getTranslation(language);
  const isRTL = language === 'ar';

  // Appliquer la direction RTL pour l'arabe
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    console.log(`📝 Mise à jour DOM: langue=${language}, direction=${isRTL ? 'rtl' : 'ltr'}`);
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
