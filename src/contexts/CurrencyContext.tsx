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

// Multiple providers — ipapi.co frequently fails due to CORS/rate-limit.
const GEO_PROVIDERS: { url: string; pick: (d: any) => string | undefined }[] = [
  { url: 'https://ipwho.is/',                pick: (d) => d?.country_code },
  { url: 'https://get.geojs.io/v1/ip/country.json', pick: (d) => d?.country },
  { url: 'https://ipapi.co/json/',           pick: (d) => d?.country_code },
  { url: 'https://api.country.is/',          pick: (d) => d?.country },
];

const detectCountry = async (): Promise<string | null> => {
  for (const p of GEO_PROVIDERS) {
    try {
      const res = await fetch(p.url, { headers: { Accept: 'application/json' } });
      if (!res.ok) continue;
      const data = await res.json();
      const cc = p.pick(data);
      if (cc && typeof cc === 'string' && cc.length === 2) return cc.toUpperCase();
    } catch { /* try next */ }
  }
  return null;
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('EUR');
  const [countryCode, setCountryCode] = useState<string>(() => {
    return localStorage.getItem(COUNTRY_KEY) || '';
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (stored && CURRENCIES[stored]) setCurrencyState(stored);

    (async () => {
      const cc = await detectCountry();
      if (cc) {
        setCountryCode(cc);
        localStorage.setItem(COUNTRY_KEY, cc);
        if (!stored) {
          const detected = countryToCurrency(cc);
          setCurrencyState(detected);
          localStorage.setItem(STORAGE_KEY, detected);
        }
      }
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
