import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  const handleGenerate = async () => {
    if (!selected) {
      toast.error('Please select a coin/network');
      return;
    }
    setLoading(true);
    try {
      const ticker = buildTicker(selected);
      const orderId = await onCreateOrder({ wallet: selected, ticker });
      if (!orderId) {
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
      if (!data?.addressIn) throw new Error('No address returned');

      setPayment({
        addressIn: data.addressIn,
        cryptoAmount: data.cryptoAmount,
        qrUrl: data.qrUrl,
        orderId,
      });
      onPaymentReady?.();
      toast.success('Payment address generated. Send the exact amount to confirm.');
    } catch (e) {
      console.error('Generate payment error:', e);
      toast.error('Failed to generate payment address. Please try again.');
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

        {payment && selected && (
          <div className="space-y-3 p-4 border-2 border-purple-300 rounded-lg bg-purple-50/30">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <img
                src={payment.qrUrl}
                alt="Payment QR"
                className="w-44 h-44 bg-white p-2 rounded border"
                onError={(e) => {
                  // Fallback QR if PayGate's QR fails
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
        )}
      </CardContent>
    </Card>
  );
};

export default DirectCryptoPayment;
