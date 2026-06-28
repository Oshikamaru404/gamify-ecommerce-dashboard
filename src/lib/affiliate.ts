// Lightweight referral & device-fingerprint helpers (no external deps).
const REF_COOKIE = 'bwivox_ref';
const REF_ID = 'bwivox_ref_id';
const FP_KEY = 'bwivox_fp';
const TTL_DAYS = 30;

function setCookie(name: string, value: string, days: number) {
  const d = new Date(); d.setTime(d.getTime() + days * 86400_000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}
function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[2]) : null;
}

export function persistReferral(code: string) {
  if (!code) return;
  const existing = getCookie(REF_COOKIE);
  if (existing) return; // do not overwrite
  setCookie(REF_COOKIE, code, TTL_DAYS);
  try { localStorage.setItem(REF_COOKIE, code); } catch { /* noop */ }
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  setCookie(REF_ID, id, TTL_DAYS);
  try { localStorage.setItem(REF_ID, id); } catch { /* noop */ }
}

export function getReferralCode(): string | null {
  return getCookie(REF_COOKIE) || (typeof localStorage !== 'undefined' ? localStorage.getItem(REF_COOKIE) : null);
}
export function getReferralCookieId(): string | null {
  return getCookie(REF_ID) || (typeof localStorage !== 'undefined' ? localStorage.getItem(REF_ID) : null);
}

export function getDeviceFingerprint(): string {
  try {
    const cached = localStorage.getItem(FP_KEY);
    if (cached) return cached;
    const parts = [
      navigator.userAgent,
      navigator.language,
      String(screen.width), String(screen.height), String(screen.colorDepth),
      String(new Date().getTimezoneOffset()),
      String(navigator.hardwareConcurrency ?? ''),
    ].join('|');
    let h = 0;
    for (let i = 0; i < parts.length; i++) { h = ((h << 5) - h) + parts.charCodeAt(i); h |= 0; }
    const fp = `fp_${Math.abs(h).toString(36)}`;
    localStorage.setItem(FP_KEY, fp);
    return fp;
  } catch {
    return 'fp_unknown';
  }
}

export function buildReferralUrl(origin: string, code: string): string {
  return `${origin.replace(/\/$/, '')}/?ref=${encodeURIComponent(code)}`;
}
