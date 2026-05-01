import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CryptoIntent {
  intentId: string;
  address: string;
  expectedAmount: number;
  coin: string;
  network: string;
  amountUsd: number;
  usdPerCoin: number;
  priceSource: string;
  qrUrl: string;
  expiresAt: string;
  minConfirmations: number;
}

export interface IntentStatus {
  id: string;
  status: 'pending' | 'detected' | 'confirmed' | 'expired' | 'underpaid';
  tx_hash: string | null;
  confirmations: number;
  min_confirmations: number;
  detected_amount: number | null;
  expected_amount: number;
  expires_at: string;
  confirmed_at: string | null;
}

export function useCryptoPaymentIntent() {
  const [intent, setIntent] = useState<CryptoIntent | null>(null);
  const [status, setStatus] = useState<IntentStatus | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollTimer = useRef<number | null>(null);

  const create = useCallback(async (params: {
    orderId: string;
    network: string;
    coin: string;
    address: string;
    amountUsd: number;
  }) => {
    setCreating(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        'crypto-create-payment',
        { body: params }
      );
      if (fnError) throw fnError;
      if (!data?.success) throw new Error(data?.error || 'Failed');
      setIntent(data as CryptoIntent);
      return data as CryptoIntent;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setCreating(false);
    }
  }, []);

  // Poll status every 8s when we have an intent
  useEffect(() => {
    if (!intent?.intentId) return;
    let stopped = false;
    const poll = async () => {
      try {
        const { data } = await supabase.functions.invoke(
          `crypto-payment-status?intentId=${intent.intentId}`,
          { method: 'GET' }
        );
        if (stopped) return;
        if (data) setStatus(data as IntentStatus);
      } catch (e) {
        console.warn('status poll failed', e);
      }
    };
    poll();
    pollTimer.current = window.setInterval(poll, 8000);
    return () => {
      stopped = true;
      if (pollTimer.current) window.clearInterval(pollTimer.current);
    };
  }, [intent?.intentId]);

  const reset = useCallback(() => {
    setIntent(null);
    setStatus(null);
    setError(null);
  }, []);

  return { intent, status, creating, error, create, reset };
}
