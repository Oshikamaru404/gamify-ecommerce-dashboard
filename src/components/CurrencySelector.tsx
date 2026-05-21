import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useCurrency } from '@/contexts/CurrencyContext';
import { CURRENCIES, countryFlag } from '@/lib/currency';
import { Check } from 'lucide-react';

interface Props {
  compact?: boolean;
}

const CurrencySelector: React.FC<Props> = ({ compact }) => {
  const { currency, setCurrency, countryCode, availableCurrencies } = useCurrency();
  const current = CURRENCIES[currency];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 px-2">
          <span className="text-base leading-none">{countryFlag(countryCode)}</span>
          <span className="text-sm font-semibold">{current.code}</span>
          {!compact && <span className="text-sm text-muted-foreground">{current.symbol}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuLabel className="flex items-center gap-2">
          <span>{countryFlag(countryCode)}</span>
          <span className="text-xs text-muted-foreground">{countryCode}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableCurrencies.map((code) => {
          const c = CURRENCIES[code];
          const active = code === currency;
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => setCurrency(code)}
              className={`flex items-center justify-between gap-3 cursor-pointer ${active ? 'bg-red-50 text-red-600' : ''}`}
            >
              <span className="flex items-center gap-2">
                <span className="w-6 text-center font-semibold">{c.symbol}</span>
                <span>{c.code}</span>
                <span className="text-xs text-muted-foreground">{c.name}</span>
              </span>
              {active && <Check size={14} />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;
