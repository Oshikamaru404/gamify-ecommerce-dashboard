import { useEffect, useRef } from 'react';

const KEY_PREFIX = 'checkout_draft_v1:';
const TTL_MS = 1000 * 60 * 60 * 24 * 3; // 3 days

interface DraftEnvelope<T> {
  ts: number;
  data: T;
}

export function loadCheckoutDraft<T>(packageId: string): T | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + packageId);
    if (!raw) return null;
    const env = JSON.parse(raw) as DraftEnvelope<T>;
    if (Date.now() - env.ts > TTL_MS) {
      localStorage.removeItem(KEY_PREFIX + packageId);
      return null;
    }
    return env.data;
  } catch {
    return null;
  }
}

export function clearCheckoutDraft(packageId: string) {
  try { localStorage.removeItem(KEY_PREFIX + packageId); } catch { /* ignore */ }
}

/**
 * Debounced autosave of an arbitrary serialisable object to localStorage,
 * scoped per package id. Pass `enabled=false` to pause (e.g. after success).
 */
export function useCheckoutDraftAutosave<T>(packageId: string, data: T, enabled = true) {
  const timeoutRef = useRef<number | null>(null);
  useEffect(() => {
    if (!enabled || !packageId) return;
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(
          KEY_PREFIX + packageId,
          JSON.stringify({ ts: Date.now(), data } as DraftEnvelope<T>),
        );
      } catch { /* quota or disabled storage – ignore */ }
    }, 600);
    return () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); };
  }, [packageId, data, enabled]);
}
