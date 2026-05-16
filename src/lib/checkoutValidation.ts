// Lightweight checkout validation + auto-formatting helpers.

const COMMON_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
  'live.com', 'aol.com', 'proton.me', 'protonmail.com', 'gmx.com',
  'orange.fr', 'free.fr', 'laposte.net',
];

const TYPO_MAP: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahho.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotnail.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'icoud.com': 'icloud.com',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAC_RE = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;

export const isValidEmail = (v: string) => EMAIL_RE.test(v.trim());
export const isValidMac = (v: string) => MAC_RE.test(v.trim());

/** Returns a suggested correction for an obvious email typo, or null. */
export function suggestEmailFix(email: string): string | null {
  if (!email.includes('@')) return null;
  const [local, domain] = email.toLowerCase().split('@');
  if (!domain) return null;
  if (COMMON_EMAIL_DOMAINS.includes(domain)) return null;
  if (TYPO_MAP[domain]) return `${local}@${TYPO_MAP[domain]}`;
  // simple Levenshtein-ish check against common domains
  for (const good of COMMON_EMAIL_DOMAINS) {
    if (good === domain) return null;
    if (Math.abs(good.length - domain.length) > 2) continue;
    let diffs = 0;
    for (let i = 0; i < Math.max(good.length, domain.length); i++) {
      if (good[i] !== domain[i]) diffs++;
      if (diffs > 1) break;
    }
    if (diffs === 1) return `${local}@${good}`;
  }
  return null;
}

/**
 * Auto-formats MAC input: strips non-hex chars, uppercases, inserts colons
 * every 2 chars, caps at 17 chars (XX:XX:XX:XX:XX:XX).
 */
export function formatMacInput(raw: string): string {
  const clean = raw.replace(/[^0-9a-fA-F]/g, '').toUpperCase().slice(0, 12);
  return clean.match(/.{1,2}/g)?.join(':') ?? '';
}
