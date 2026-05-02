// Resolve a small icon URL for a payment method label.
// Used by order-confirmation and admin-new-order emails so the recipient
// instantly recognizes how the order was paid.

const CHAIN = (slug: string) => `https://icons.llamao.fi/icons/chains/rsz_${slug}.jpg`
const COIN = (sym: string) =>
  `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/${sym.toLowerCase()}.svg`

// Generic / non-crypto methods (hosted on a stable CDN, PNG works in all email clients)
const WHATSAPP = 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@13.0.0/icons/whatsapp.svg'
const CARD = 'https://img.icons8.com/color/48/bank-card-back-side.png'
const CRYPTO_GENERIC = 'https://img.icons8.com/color/48/cryptocurrency.png'

export function getPaymentMethodIcon(label?: string): string | null {
  if (!label) return null
  const l = label.toLowerCase()

  // Non-crypto
  if (l.includes('whatsapp')) return WHATSAPP
  if (l.includes('credit') || l.includes('card') || l.includes('paybwivox')) return CARD

  // Crypto networks (DirectCryptoPayment labels: "Crypto Direct (BTC)", etc.)
  if (l.includes('btc') || l.includes('bitcoin cash')) {
    return l.includes('cash') ? COIN('bch') : CHAIN('bitcoin')
  }
  if (l.includes('bch')) return COIN('bch')
  if (l.includes('erc20') || l.includes('ethereum')) return CHAIN('ethereum')
  if (l.includes('bep20') || l.includes('bnb') || l.includes('binance')) return CHAIN('binance')
  if (l.includes('polygon') || l.includes('matic')) return CHAIN('polygon')
  if (l.includes('arbitrum')) return CHAIN('arbitrum')
  if (l.includes('optimism')) return CHAIN('optimism')
  if (l.includes('linea')) return CHAIN('linea')
  if (l.includes('base')) return CHAIN('base')
  if (l.includes('solana') || l.includes('sol')) return CHAIN('solana')
  if (l.includes('trc20') || l.includes('tron')) return CHAIN('tron')
  if (l.includes('cryptomus') || l.includes('crypto')) return CRYPTO_GENERIC

  return null
}
