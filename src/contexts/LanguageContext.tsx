
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslation, Translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'preferred_language';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Récupérer la langue depuis le localStorage ou utiliser français par défaut
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['fr', 'en', 'es', 'ar', 'de'].includes(stored)) {
      return stored as Language;
    }
    
    // Détecter la langue du navigateur
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) return 'en';
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('ar')) return 'ar';
    if (browserLang.startsWith('de')) return 'de';
    
    return 'fr'; // Français par défaut
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem(STORAGE_KEY, newLanguage);
  };

  const t = getTranslation(language);
  const isRTL = language === 'ar';

  // Appliquer la direction RTL pour l'arabe
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
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
