// Inline SVG data URIs for real crypto network marks.
// They avoid CORS issues when drawn into the QR canvas and keep checkout logos stable.

const svg = (markup: string) => `data:image/svg+xml;utf8,${encodeURIComponent(markup)}`;

const bitcoin = (bg: string, mark = '₿') => svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="${bg}"/>
  <text x="32" y="43" font-family="Arial, Helvetica, sans-serif" font-size="35" font-weight="700" text-anchor="middle" fill="#fff" transform="rotate(-13 32 32)">${mark}</text>
</svg>`);

const ethereum = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="#627EEA"/>
  <path d="M32 8 17 33l15-7 15 7L32 8Z" fill="#fff" fill-opacity=".92"/>
  <path d="M32 26 17 33l15 9 15-9-15-7Z" fill="#C9D5FF"/>
  <path d="m17 36 15 20 15-20-15 9-15-9Z" fill="#fff" fill-opacity=".92"/>
</svg>`);

const bnb = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="#F0B90B"/>
  <path d="m22 32-6 6-6-6 6-6 6 6Zm10-10-6 6-6-6 6-6 6 6Zm22 10-6 6-6-6 6-6 6 6ZM32 42l6-6 6 6-6 6-6-6Zm0-4-6-6 6-6 6 6-6 6Z" fill="#181A20"/>
</svg>`);

const polygon = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="#8247E5"/>
  <path d="M43.8 22.6 34.7 17a5.5 5.5 0 0 0-5.4 0l-9.1 5.6a5.1 5.1 0 0 0-2.6 4.5v10a5.2 5.2 0 0 0 2.6 4.5l9.1 5.6a5.5 5.5 0 0 0 5.4 0l9.1-5.6a5.1 5.1 0 0 0 2.6-4.5v-10a5.2 5.2 0 0 0-2.6-4.5Zm-4.9 15.7-6.9 4.2-6.9-4.2v-8.4l6.9-4.2 6.9 4.2v8.4Z" fill="#fff"/>
  <path d="m18.6 25.3 13.4 8.1 13.4-8.1" fill="none" stroke="#8247E5" stroke-width="4" stroke-linecap="round"/>
</svg>`);

const arbitrum = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="#172B4D"/>
  <path d="m32 8 20 11.5v25L32 56 12 44.5v-25L32 8Z" fill="#213147" stroke="#9DCCED" stroke-width="2"/>
  <path d="M30.2 44h-6.1l12-25h6.1l-12 25Zm10 0h-6.1l8.1-16.9 3.1 5.9L40.2 44Z" fill="#28A0F0"/>
  <path d="M20.7 44h-5.9l12-25h5.9l-12 25Z" fill="#fff"/>
</svg>`);

const optimism = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="#FF0420"/>
  <text x="32" y="39" font-family="Arial Black, Arial, sans-serif" font-size="20" font-weight="900" text-anchor="middle" fill="#fff">OP</text>
</svg>`);

const linea = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="#111"/>
  <circle cx="47" cy="17" r="4" fill="#61DFFF"/>
  <path d="M18 18h8v28h20v7H18V18Z" fill="#fff"/>
</svg>`);

const base = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="#0052FF"/>
  <path d="M32 52c11 0 20-9 20-20S43 12 32 12c-9.3 0-17.1 6.4-19.4 15h26.8v10H12.6C14.9 45.6 22.7 52 32 52Z" fill="#fff"/>
</svg>`);

const solana = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="s" x1="12" x2="52" y1="48" y2="16" gradientUnits="userSpaceOnUse"><stop stop-color="#00FFA3"/><stop offset=".5" stop-color="#DC1FFF"/><stop offset="1" stop-color="#03E1FF"/></linearGradient></defs>
  <circle cx="32" cy="32" r="32" fill="#111"/>
  <path d="M18 19h29l-5 6H13l5-6Zm0 20h29l-5 6H13l5-6Zm28.5-10h-29l5-6h29l-5 6Z" fill="url(#s)"/>
</svg>`);

const tron = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="#EB0029"/>
  <path d="M16 14 51 21 31 52 16 14Zm5.8 6.4 9.1 24.2 4.9-15.7-14-8.5Zm2.8-1 13.5 8.1 7.7-4.7-21.2-3.4Zm15.5 10.9-5.5 16.2 11.9-18.7-6.4 2.5Z" fill="#fff"/>
</svg>`);

export const NETWORK_LOGOS: Record<string, string> = {
  BTC: bitcoin('#F7931A'),
  BITCOIN: bitcoin('#F7931A'),
  BCH: bitcoin('#0AC18E', 'Ƀ'),
  ERC20: ethereum,
  ETH: ethereum,
  ETHEREUM: ethereum,
  BEP20: bnb,
  BSC: bnb,
  BNB: bnb,
  POLYGON: polygon,
  POL: polygon,
  MATIC: polygon,
  ARBITRUM: arbitrum,
  OPTIMISM: optimism,
  OP: optimism,
  LINEA: linea,
  BASE: base,
  SOLANA: solana,
  SOL: solana,
  TRC20: tron,
  TRON: tron,
  TRX: tron,
};

export function getNetworkLogo(network?: string): string | undefined {
  if (!network) return undefined;
  return NETWORK_LOGOS[network.trim().toUpperCase()];
}
