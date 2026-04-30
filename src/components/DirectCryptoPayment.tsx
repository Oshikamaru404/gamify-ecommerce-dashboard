import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, Loader2, Bitcoin, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';

export interface CryptoWallet {
  network: string;
  coin: string;
  address: string;
  /** PayGate ticker path, e.g. "btc", "bep20/usdt", "polygon/usdc", "sol/sol", "trc20/usdt" */
  ticker?: string;
}

// Mapping network+coin -> PayGate ticker
const buildTicker = (w: CryptoWallet): string => {
  if (w.ticker) return w.ticker;
  const net = w.network.toLowerCase();
  const coin = w.coin.toLowerCase();
  if (net === 'btc' || coin === 'btc') return 'btc';
  if (net === 'eth' || net === 'erc20') return `erc20/${coin}`;
  if (net === 'bep20' || net === 'bsc') return `bep20/${coin}`;
  if (net === 'polygon' || net === 'matic') return `polygon/${coin}`;
  if (net === 'base') return `base/${coin}`;
  if (net === 'arbitrum') return `arbitrum/${coin}`;
  if (net === 'optimism') return `optimism/${coin}`;
  if (net === 'linea') return `linea/${coin}`;
  if (net === 'avax-c' || net === 'avalanche') return `avax-c/${coin}`;
  if (net === 'solana' || net === 'sol') return `sol/${coin === 'sol' ? 'sol' : coin}`;
  if (net === 'trc20' || net === 'tron') return `trc20/${coin}`;
  return `${net}/${coin}`;
};

export const DEFAULT_CRYPTO_WALLETS: CryptoWallet[] = [
  { network: 'BTC', coin: 'BTC', address: '1DHKvYQ8dAeJQdkQGwdBBeM7s4yrAxcMrz' },
  { network: 'ERC20', coin: 'ETH', address: '0x2d72c5dcfa5cea3a64181e4e3b2097a7a1bf7c7a' },
  { network: 'BEP20', coin: 'BNB', address: '0x2d72c5dcfa5cea3a64181e4e3b2097a7a1bf7c7a' },
  { network: 'BEP20', coin: 'USDC', address: '0x2d72c5dcfa5cea3a64181e4e3b2097a7a1bf7c7a' },
  { network: 'BEP20', coin: 'USDT', address: '0x2d72c5dcfa5cea3a64181e4e3b2097a7a1bf7c7a' },
  { network: 'Polygon', coin: 'POL', address: '0x2d72c5dcfa5cea3a64181e4e3b2097a7a1bf7c7a' },
  { network: 'Polygon', coin: 'USDC', address: '0x2d72c5dcfa5cea3a64181e4e3b2097a7a1bf7c7a' },
  { network: 'Polygon', coin: 'USDT', address: '0x2d72c5dcfa5cea3a64181e4e3b2097a7a1bf7c7a' },
  { network: 'Base', coin: 'USDC', address: '0x2d72c5dcfa5cea3a64181e4e3b2097a7a1bf7c7a' },
  { network: 'Base', coin: 'USDT', address: '0x2d72c5dcfa5cea3a64181e4e3b2097a7a1bf7c7a' },
  { network: 'Solana', coin: 'SOL', address: 'Du6QGDqUaC4EW2iDNFPVpyMbBgBEY52vrHvb4ztJpVWk' },
  { network: 'Solana', coin: 'USDC', address: 'Du6QGDqUaC4EW2iDNFPVpyMbBgBEY52vrHvb4ztJpVWk' },
  { network: 'Solana', coin: 'USDT', address: 'Du6QGDqUaC4EW2iDNFPVpyMbBgBEY52vrHvb4ztJpVWk' },
  { network: 'TRC20', coin: 'USDT', address: 'TSZ5dFZR7FK5mpQ8AyfeRLs5crhtS6soZW' },
  { network: 'Linea', coin: 'USDC', address: '0x2d72c5dcfa5cea3a64181e4e3b2097a7a1bf7c7a' },
  { network: 'Linea', coin: 'USDT', address: '0x2d72c5dcfa5cea3a64181e4e3b2097a7a1bf7c7a' },
  { network: 'ERC20', coin: 'USDC', address: '0x2d72c5dcfa5cea3a64181e4e3b2097a7a1bf7c7a' },
  { network: 'ERC20', coin: 'USDT', address: '0x2d72c5dcfa5cea3a64181e4e3b2097a7a1bf7c7a' },
];

interface DirectCryptoPaymentProps {
  amountUsd: number;
  /** Called BEFORE payment generation to create the order. Should return the order ID. */
  onCreateOrder: (selection: { wallet: CryptoWallet; ticker: string }) => Promise<string | null>;
  /** Called once payment intent is generated, parent can advance to success screen. */
  onPaymentReady?: () => void;
}

interface PaymentInfo {
  addressIn: string;
  cryptoAmount: string | null;
  qrUrl: string;
  orderId: string;
}

// Network meta for nicer UI
const NETWORK_META: Record<string, { label: string; emoji: string; color: string }> = {
  BTC: { label: 'Bitcoin', emoji: '₿', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  BEP20: { label: 'BNB Smart Chain', emoji: '🟡', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  POLYGON: { label: 'Polygon', emoji: '🟣', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  BASE: { label: 'Base', emoji: '🔵', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  SOLANA: { label: 'Solana', emoji: '🟢', color: 'bg-green-100 text-green-700 border-green-300' },
  TRC20: { label: 'Tron (TRC20)', emoji: '🔴', color: 'bg-red-100 text-red-700 border-red-300' },
  LINEA: { label: 'Linea', emoji: '⚫', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  ERC20: { label: 'Ethereum (ERC20)', emoji: '💎', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
};

const getNetworkMeta = (network: string) => {
  const key = network.toUpperCase();
  return NETWORK_META[key] || { label: network, emoji: '🔗', color: 'bg-slate-100 text-slate-700 border-slate-300' };
};

// EVM chain IDs (EIP-155) for EIP-681 deeplinks
const EVM_CHAIN_IDS: Record<string, number> = {
  ERC20: 1,
  BEP20: 56,
  POLYGON: 137,
  BASE: 8453,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  LINEA: 59144,
  'AVAX-C': 43114,
};

// ERC-20 token contracts per chain (key: NETWORK_COIN)
const ERC20_CONTRACTS: Record<string, string> = {
  ERC20_USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  ERC20_USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  BEP20_USDT: '0x55d398326f99059ff775485246999027b3197955',
  BEP20_USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
  POLYGON_USDT: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  POLYGON_USDC: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
  BASE_USDT: '0xfde4c96c8593536e31f229ea8f37b2ada2699bb2',
  BASE_USDC: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  LINEA_USDT: '0xa219439258ca9da29e9cc4ce5596924745e12b93',
  LINEA_USDC: '0x176211869ca2b568f2a7d4ee941e073a821ee1ff',
};

// Solana SPL token mints
const SPL_MINTS: Record<string, string> = {
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
};

const toBaseUnits = (amount: string, decimals: number): string => {
  const [whole, frac = ''] = amount.split('.');
  const fracPadded = (frac + '0'.repeat(decimals)).slice(0, decimals);
  const combined = (whole + fracPadded).replace(/^0+/, '') || '0';
  return combined;
};

/**
 * Build a wallet deeplink URI that includes the amount.
 * Scanning the QR with most modern wallets will auto-fill the amount.
 */
const buildPaymentUri = (network: string, coin: string, address: string, amount: string | null): string => {
  if (!amount) return address;
  const net = network.toUpperCase();
  const c = coin.toUpperCase();

  // BIP-21 — Bitcoin
  if (net === 'BTC') return `bitcoin:${address}?amount=${amount}`;

  // EIP-681 — EVM chains
  const chainId = EVM_CHAIN_IDS[net];
  if (chainId) {
    const nativeCoins = ['ETH', 'BNB', 'POL', 'MATIC', 'AVAX'];
    if (nativeCoins.includes(c)) {
      const wei = toBaseUnits(amount, 18);
      return `ethereum:${address}@${chainId}?value=${wei}`;
    }
    const contract = ERC20_CONTRACTS[`${net}_${c}`];
    if (contract) {
      const tokenAmount = toBaseUnits(amount, 6); // USDT/USDC = 6 decimals on these chains
      return `ethereum:${contract}@${chainId}/transfer?address=${address}&uint256=${tokenAmount}`;
    }
  }

  // Solana Pay
  if (net === 'SOLANA' || net === 'SOL') {
    if (c === 'SOL') return `solana:${address}?amount=${amount}`;
    const mint = SPL_MINTS[c];
    if (mint) return `solana:${address}?amount=${amount}&spl-token=${mint}`;
  }

  // Tron
  if (net === 'TRC20' || net === 'TRON') return `tron:${address}?amount=${amount}`;

  return address;
};

const DirectCryptoPayment: React.FC<DirectCryptoPaymentProps> = ({ amountUsd, onCreateOrder, onPaymentReady }) => {
  const { data: siteSettings } = useSiteSettings();
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [copied, setCopied] = useState(false);

  const wallets: CryptoWallet[] = useMemo(() => {
    const raw = siteSettings?.find(s => s.setting_key === 'crypto_wallets')?.setting_value;
    if (!raw) return DEFAULT_CRYPTO_WALLETS;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch {}
    return DEFAULT_CRYPTO_WALLETS;
  }, [siteSettings]);

  // Group wallets by network
  const networks = useMemo(() => {
    const map = new Map<string, CryptoWallet[]>();
    wallets.forEach(w => {
      const arr = map.get(w.network) || [];
      arr.push(w);
      map.set(w.network, arr);
    });
    return Array.from(map.entries());
  }, [wallets]);

  const coinsForNetwork = selectedNetwork
    ? wallets.filter(w => w.network === selectedNetwork)
    : [];

  const selected = wallets.find(w => w.network === selectedNetwork && w.coin === selectedCoin);

  // Reset coin & payment when network changes
  useEffect(() => {
    setSelectedCoin('');
    setPayment(null);
  }, [selectedNetwork]);

  useEffect(() => { setPayment(null); }, [selectedCoin]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    setErrorMsg(null);
    if (!selected) {
      setErrorMsg('Please select a network and coin first.');
      toast.error('Please select a coin/network');
      return;
    }
    setLoading(true);
    try {
      const ticker = buildTicker(selected);
      const orderId = await onCreateOrder({ wallet: selected, ticker });
      if (!orderId) {
        setErrorMsg('Please fill in your Name, Email and WhatsApp number above before generating the payment address.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('paygate-create-direct-payment', {
        body: {
          ticker,
          merchantAddress: selected.address,
          amountUsd,
          orderId,
        },
      });

      if (error) throw error;
      if (!data?.addressIn) throw new Error(data?.error || 'No address returned');

      setPayment({
        addressIn: data.addressIn,
        cryptoAmount: data.cryptoAmount,
        qrUrl: data.qrUrl,
        orderId,
      });
      onPaymentReady?.();
      toast.success('Payment address generated. Send the exact amount to confirm.');
    } catch (e: any) {
      console.error('Generate payment error:', e);
      const msg = e?.message || 'Failed to generate payment address. Please try again.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <Bitcoin className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Pay in Your Preferred Crypto</h4>
            <p className="text-sm text-purple-700">
              Pick a coin & network — we'll generate a unique payment address. Payment is auto-detected and your order activates automatically.
            </p>
          </div>
        </div>

        {/* Step 1: Network selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold">1</span>
            Choose Network
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {networks.map(([net, list]) => {
              const meta = getNetworkMeta(net);
              const active = selectedNetwork === net;
              return (
                <button
                  key={net}
                  type="button"
                  onClick={() => setSelectedNetwork(net)}
                  disabled={loading}
                  className={`flex flex-col items-start gap-1 p-3 rounded-lg border-2 text-left transition-all ${
                    active
                      ? 'border-purple-600 bg-purple-50 shadow-md scale-[1.02]'
                      : 'border-border hover:border-purple-300 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{meta.emoji}</span>
                    <span className="font-semibold text-sm">{meta.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {list.map(l => l.coin).join(' · ')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Coin selection */}
        {selectedNetwork && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Label className="flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold">2</span>
              Choose Coin
            </Label>
            <div className="flex flex-wrap gap-2">
              {coinsForNetwork.map(w => {
                const active = selectedCoin === w.coin;
                return (
                  <button
                    key={w.coin}
                    type="button"
                    onClick={() => setSelectedCoin(w.coin)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition-all ${
                      active
                        ? 'border-purple-600 bg-purple-600 text-white shadow-md'
                        : 'border-border bg-background hover:border-purple-400 hover:bg-purple-50'
                    }`}
                  >
                    {w.coin}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {errorMsg && !payment && (
          <div className="p-3 rounded-lg border-2 border-red-300 bg-red-50 text-sm text-red-800">
            ⚠️ {errorMsg}
          </div>
        )}

        {!payment && (
          <Button
            onClick={handleGenerate}
            disabled={loading || !selected}
            className="w-full h-12 bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Generating address...</>
            ) : (
              <><Bitcoin className="h-5 w-5 mr-2" /> Generate Payment Address</>
            )}
          </Button>
        )}

        {payment && selected && (() => {
          const paymentUri = buildPaymentUri(selected.network, selected.coin, payment.addressIn, payment.cryptoAmount);
          const hasAmountInQr = paymentUri !== payment.addressIn;
          const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(paymentUri)}`;
          return (
          <div className="space-y-3 p-4 border-2 border-purple-300 rounded-lg bg-purple-50/30">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <img
                src={qrSrc}
                alt="Payment QR"
                className="w-44 h-44 bg-white p-2 rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(payment.addressIn)}`;
                }}
              />
              <div className="flex-1 w-full space-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Send exactly</p>
                  <p className="font-bold text-lg text-primary">
                    {payment.cryptoAmount ? `${payment.cryptoAmount} ${selected.coin}` : `~$${amountUsd} in ${selected.coin}`}
                  </p>
                  <p className="text-xs text-muted-foreground">≈ ${amountUsd} USD</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Network</p>
                  <p className="font-semibold">{selected.network}</p>
                </div>
                {hasAmountInQr && (
                  <p className="text-[11px] text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">
                    📲 QR includes the amount — most wallets auto-fill it.
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label className="text-xs">Send to this address</Label>
              <div className="flex gap-2 mt-1">
                <Input value={payment.addressIn} readOnly className="font-mono text-xs" />
                <Button type="button" variant="outline" size="icon" onClick={() => handleCopy(payment.addressIn)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {payment.cryptoAmount && (
              <div>
                <Label className="text-xs">Exact amount</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={payment.cryptoAmount} readOnly className="font-mono text-xs" />
                  <Button type="button" variant="outline" size="icon" onClick={() => handleCopy(payment.cryptoAmount!)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
              ⚠️ Send only <span className="font-bold">{selected.coin} on {selected.network}</span>. Anything below the network minimum will be lost.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800 space-y-1">
              <p className="font-semibold">✅ Auto-confirmation enabled</p>
              <p>Your order will activate automatically once the blockchain confirms your payment. You can close this page.</p>
              <p className="font-mono text-[10px] mt-1">Order: {payment.orderId.slice(0, 8)}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPayment(null)}
              className="w-full"
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Change coin/network
            </Button>
          </div>
          );
        })()}
      </CardContent>
    </Card>
  );
};

export default DirectCryptoPayment;
