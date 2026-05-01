import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PriceData {
  coin: string;
  usdPerCoin: number;
  amountUsd: number;
  cryptoAmount: number;
  source: string;
  updatedAt: string;
}

interface Options {
  refreshIntervalMs?: number;
  enabled?: boolean;
}

export function useCryptoPrice(
  coin: string | undefined,
  amountUsd: number,
  network?: string,
  opts: Options = {}
) {
  const { refreshIntervalMs = 30_000, enabled = true } = opts;
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const fetchPrice = useCallback(async () => {
    if (!coin || !enabled) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        coin,
        amount: String(amountUsd || 1),
      });
      if (network) params.set('network', network);
      const { data: result, error: fnError } = await supabase.functions.invoke(
        `crypto-price?${params.toString()}`,
        { method: 'GET' }
      );
      if (fnError) throw fnError;
      setData(result as PriceData);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [coin, amountUsd, network, enabled]);

  useEffect(() => {
    fetchPrice();
    if (timer.current) window.clearInterval(timer.current);
    if (enabled) {
      timer.current = window.setInterval(fetchPrice, refreshIntervalMs);
    }
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [fetchPrice, refreshIntervalMs, enabled]);

  return { data, loading, error, refresh: fetchPrice };
}
