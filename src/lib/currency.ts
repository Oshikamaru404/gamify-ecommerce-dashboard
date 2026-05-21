// Currency system — base prices in DB are stored in EUR.
// To add a new currency: append to CURRENCIES with a rate vs EUR.

export type CurrencyCode = 'EUR' | 'USD' | 'GBP';

export interface CurrencyDef {
  code: CurrencyCode;
  symbol: string;
  name: string;
  // Rate relative to EUR (1 EUR = rate * X). Updated 2026.
  rate: number;
  position: 'before' | 'after';
}

export const CURRENCIES: Record<CurrencyCode, CurrencyDef> = {
  EUR: { code: 'EUR', symbol: '€', name: 'Euro',         rate: 1,    position: 'after'  },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar',    rate: 1.08, position: 'before' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound',rate: 0.85, position: 'before' },
};

// Country → preferred currency
export const countryToCurrency = (cc?: string): CurrencyCode => {
  if (!cc) return 'EUR';
  const c = cc.toUpperCase();
  const usd = ['US','CA','MX','AU','NZ','SG','HK','PH','JP','KR','TW','TH','MY','ID','VN','IN','BR','AR','CL','CO','PE','ZA','AE','SA','EG','IL','TR'];
  const gbp = ['GB','UK'];
  if (gbp.includes(c)) return 'GBP';
  if (usd.includes(c)) return 'USD';
  return 'EUR';
};

// Country code → flag emoji
export const countryFlag = (cc?: string): string => {
  if (!cc || cc.length !== 2) return '🌍';
  const A = 0x1f1e6;
  const codes = cc.toUpperCase().split('').map(ch => A + (ch.charCodeAt(0) - 65));
  try { return String.fromCodePoint(...codes); } catch { return '🌍'; }
};

export const convertPrice = (amountEUR: number, target: CurrencyCode): number => {
  const def = CURRENCIES[target] ?? CURRENCIES.EUR;
  return amountEUR * def.rate;
};

export const formatPrice = (
  amountEUR: number,
  currency: CurrencyCode = 'EUR',
  opts: { decimals?: number } = {},
): string => {
  const def = CURRENCIES[currency] ?? CURRENCIES.EUR;
  const converted = convertPrice(amountEUR, currency);
  const decimals = opts.decimals ?? 2;
  const num = converted.toFixed(decimals);
  return def.position === 'before' ? `${def.symbol}${num}` : `${num}${def.symbol}`;
};
