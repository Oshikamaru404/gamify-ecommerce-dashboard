
import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language, getLanguageName, getLanguageFlag } from '@/lib/translations';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: Language[] = ['fr', 'en', 'es', 'ar', 'de'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe size={16} />
          <span className="hidden sm:inline">{getLanguageFlag(language)} {getLanguageName(language)}</span>
          <span className="sm:hidden">{getLanguageFlag(language)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`flex items-center gap-3 cursor-pointer ${
              language === lang ? 'bg-red-50 text-red-600' : ''
            }`}
          >
            <span className="text-lg">{getLanguageFlag(lang)}</span>
            <span>{getLanguageName(lang)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
