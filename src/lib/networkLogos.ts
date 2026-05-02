// Real crypto network icons fetched from a CORS-enabled CDN and cached as data URLs.
// Using fetch -> blob -> dataURL bypasses canvas CORS taint when drawing into the QR.

// jsDelivr serves cryptocurrency-icons with proper CORS headers.
const CDN = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color';

// Map a network/chain name to the icon slug used by the CDN.
const SLUGS: Record<string, string> = {
  BTC: 'btc',
  BITCOIN: 'btc',
  BCH: 'bch',
  ERC20: 'eth',
  ETH: 'eth',
  ETHEREUM: 'eth',
  BEP20: 'bnb',
  BSC: 'bnb',
  BNB: 'bnb',
  POLYGON: 'matic',
  POL: 'matic',
  MATIC: 'matic',
  ARBITRUM: 'arb',
  OPTIMISM: 'op',
  OP: 'op',
  LINEA: 'eth',
  BASE: 'eth',
  SOLANA: 'sol',
  SOL: 'sol',
  TRC20: 'trx',
  TRON: 'trx',
  TRX: 'trx',
  USDT: 'usdt',
  USDC: 'usdc',
  DAI: 'dai',
  LTC: 'ltc',
  DOGE: 'doge',
  XRP: 'xrp',
  ADA: 'ada',
  AVAX: 'avax',
  DOT: 'dot',
};

const cache = new Map<string, string>();

function resolveSlug(network?: string): string | undefined {
  if (!network) return undefined;
  return SLUGS[network.trim().toUpperCase()];
}

export function getNetworkLogoUrl(network?: string): string | undefined {
  const slug = resolveSlug(network);
  return slug ? `${CDN}/${slug}.svg` : undefined;
}

/**
 * Fetch the network logo and return a data URL (CORS-safe for canvas).
 * Cached per-network for the session.
 */
export async function getNetworkLogo(network?: string): Promise<string | undefined> {
  const slug = resolveSlug(network);
  if (!slug) return undefined;
  if (cache.has(slug)) return cache.get(slug);

  try {
    const res = await fetch(`${CDN}/${slug}.svg`, { mode: 'cors' });
    if (!res.ok) return undefined;
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
    cache.set(slug, dataUrl);
    return dataUrl;
  } catch {
    return undefined;
  }
}
