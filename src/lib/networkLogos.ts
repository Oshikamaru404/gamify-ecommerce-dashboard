// Inline SVG data URIs for crypto network logos.
// Inline (no network fetch) means: no CORS issues when drawing into a
// <canvas> (QR overlays), instant rendering, and works offline.
// All logos are simplified single-color marks on transparent background;
// they are wrapped on a white rounded backdrop by QrWithLogo.

const svg = (markup: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(markup)}`;

const circle = (color: string, letter: string, textColor = '#ffffff') => svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="${color}"/>
  <text x="32" y="42" font-family="Arial, sans-serif" font-size="32" font-weight="700"
        text-anchor="middle" fill="${textColor}">${letter}</text>
</svg>`);

export const NETWORK_LOGOS: Record<string, string> = {
  BTC: circle('#f7931a', '₿'),
  BCH: circle('#0ac18e', 'Ƀ'),
  ERC20: circle('#627eea', 'Ξ'),
  ETHEREUM: circle('#627eea', 'Ξ'),
  BEP20: circle('#f0b90b', 'B', '#1f1f1f'),
  BNB: circle('#f0b90b', 'B', '#1f1f1f'),
  POLYGON: circle('#8247e5', 'P'),
  MATIC: circle('#8247e5', 'P'),
  ARBITRUM: circle('#28a0f0', 'A'),
  OPTIMISM: circle('#ff0420', 'O'),
  LINEA: circle('#121212', 'L'),
  BASE: circle('#0052ff', 'B'),
  SOLANA: circle('#9945ff', 'S'),
  SOL: circle('#9945ff', 'S'),
  TRC20: circle('#eb0029', 'T'),
  TRON: circle('#eb0029', 'T'),
};

export function getNetworkLogo(network?: string): string | undefined {
  if (!network) return undefined;
  return NETWORK_LOGOS[network.toUpperCase()];
}
