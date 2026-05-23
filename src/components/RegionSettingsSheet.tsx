import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CURRENCIES, CurrencyCode } from '@/lib/currency';
import { Language, getLanguageName, getLanguageFlag } from '@/lib/translations';

const LANGS: Language[] = ['en', 'fr', 'es', 'de', 'it', 'ar'];

const RegionSettingsSheet: React.FC = () => {
  const { currency, setCurrency, countryCode, availableCurrencies } = useCurrency();
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [pendingCurrency, setPendingCurrency] = useState<CurrencyCode>(currency);
  const [pendingLang, setPendingLang] = useState<Language>(language);

  const onOpenChange = (v: boolean) => {
    if (v) {
      setPendingCurrency(currency);
      setPendingLang(language);
    }
    setOpen(v);
  };

  const save = () => {
    setCurrency(pendingCurrency);
    setLanguage(pendingLang);
    setOpen(false);
  };

  const current = CURRENCIES[currency];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Region & Language"
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full bg-muted/60 hover:bg-muted transition-colors border border-border/50 shadow-sm"
        >
          {countryCode ? (
            <img
              src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w80/${countryCode.toLowerCase()}.png 2x`}
              alt={countryCode}
              className="w-4 h-4 rounded-full object-cover ring-1 ring-red-500"
              loading="lazy"
            />
          ) : (
            <span className="w-4 h-4 rounded-full bg-red-500 inline-block ring-1 ring-red-500" />
          )}
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">{language}</span>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs font-semibold text-foreground">{current.code}</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] sm:max-w-sm flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {countryCode && (
              <img
                src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
                alt={countryCode}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-border"
              />
            )}
            <span>Region & Language</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          <section>
            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Currency</div>
            <div className="grid grid-cols-1 gap-1">
              {availableCurrencies.map((code) => {
                const c = CURRENCIES[code];
                const active = code === pendingCurrency;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setPendingCurrency(code)}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-md border text-left transition-colors ${
                      active ? 'border-red-500 bg-red-50 text-red-600' : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 text-center font-semibold">{c.symbol}</span>
                      <span className="font-medium">{c.code}</span>
                      <span className="text-xs text-muted-foreground">{c.name}</span>
                    </span>
                    {active && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Language</div>
            <div className="grid grid-cols-1 gap-1">
              {LANGS.map((lng) => {
                const active = lng === pendingLang;
                return (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => setPendingLang(lng)}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-md border text-left transition-colors ${
                      active ? 'border-red-500 bg-red-50 text-red-600' : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{getLanguageFlag(lng)}</span>
                      <span className="font-medium">{getLanguageName(lng)}</span>
                    </span>
                    {active && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <SheetFooter className="flex-row gap-2 sm:gap-2">
          <SheetClose asChild>
            <Button variant="outline" className="flex-1">Cancel</Button>
          </SheetClose>
          <Button onClick={save} className="flex-1 bg-red-600 hover:bg-red-700">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default RegionSettingsSheet;
