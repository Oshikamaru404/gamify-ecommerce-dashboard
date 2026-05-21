import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { CurrencyCode, CURRENCIES, countryToCurrency, formatPrice as fmt } from '@/lib/currency';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  countryCode: string;        // ISO-2 of detected country (for flag)
  formatPrice: (amountEUR: number, decimals?: number) => string;
  availableCurrencies: CurrencyCode[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'preferred_currency';
const COUNTRY_KEY = 'detected_country';

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('EUR');
  const [countryCode, setCountryCode] = useState<string>('FR');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    const storedCountry = localStorage.getItem(COUNTRY_KEY);
    if (storedCountry) setCountryCode(storedCountry);

    // Always try to refresh country for flag, but only override currency if no preference
    (async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('geo failed');
        const data = await res.json();
        if (data?.country_code) {
          setCountryCode(data.country_code);
          localStorage.setItem(COUNTRY_KEY, data.country_code);
          if (!stored) {
            const detected = countryToCurrency(data.country_code);
            setCurrencyState(detected);
            localStorage.setItem(STORAGE_KEY, detected);
            return;
          }
        }
      } catch {/* ignore */}
      if (stored && CURRENCIES[stored]) setCurrencyState(stored);
    })();
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY, c);
  }, []);

  const formatPrice = useCallback(
    (amountEUR: number, decimals?: number) => fmt(amountEUR, currency, { decimals }),
    [currency],
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        countryCode,
        formatPrice,
        availableCurrencies: Object.keys(CURRENCIES) as CurrencyCode[],
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};
