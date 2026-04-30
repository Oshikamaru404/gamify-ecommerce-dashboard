import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, Loader2, Bitcoin } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export interface CryptoWallet {
  network: string;
  coin: string;
  address: string;
}

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
  isProcessing: boolean;
  onSubmit: (selection: { wallet: CryptoWallet; txHash: string }) => Promise<void> | void;
}

const DirectCryptoPayment: React.FC<DirectCryptoPaymentProps> = ({ amountUsd, isProcessing, onSubmit }) => {
  const { data: siteSettings } = useSiteSettings();
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [txHash, setTxHash] = useState('');
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

  const selected = wallets.find(w => `${w.network}-${w.coin}` === selectedKey);

  const handleCopy = () => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.address);
    setCopied(true);
    toast.success('Address copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!selected) {
      toast.error('Please select a coin/network');
      return;
    }
    if (!txHash || txHash.trim().length < 6) {
      toast.error('Please enter a valid transaction hash');
      return;
    }
    await onSubmit({ wallet: selected, txHash: txHash.trim() });
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <Bitcoin className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Direct Crypto Transfer</h4>
            <p className="text-sm text-purple-700">
              Choose your coin & network, send <span className="font-bold">${amountUsd}</span> worth to the address shown, then paste your transaction hash. We'll confirm manually.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Select Coin / Network *</Label>
          <Select value={selectedKey} onValueChange={setSelectedKey}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a coin and network" />
            </SelectTrigger>
            <SelectContent className="max-h-72 bg-background z-50">
              {wallets.map((w) => (
                <SelectItem key={`${w.network}-${w.coin}`} value={`${w.network}-${w.coin}`}>
                  {w.coin} on {w.network}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selected && (
          <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(selected.address)}`}
                alt="QR Code"
                className="w-40 h-40 bg-white p-2 rounded"
              />
              <div className="flex-1 w-full space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Network</p>
                  <p className="font-semibold">{selected.network}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Coin</p>
                  <p className="font-semibold">{selected.coin}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount to send</p>
                  <p className="font-bold text-primary">${amountUsd} (USD equivalent)</p>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-xs">Wallet Address</Label>
              <div className="flex gap-2 mt-1">
                <Input value={selected.address} readOnly className="font-mono text-xs" />
                <Button type="button" variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
              ⚠️ Only send {selected.coin} on the {selected.network} network. Sending the wrong coin or network will result in lost funds.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="txHash">Transaction Hash (TXID) *</Label>
          <Input
            id="txHash"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="Paste your transaction hash after sending"
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            After sending, copy the transaction hash from your wallet and paste it here.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isProcessing || !selected || !txHash}
          className="w-full h-12 bg-purple-600 hover:bg-purple-700"
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Bitcoin className="h-5 w-5 mr-2" />
          )}
          Submit Payment for Verification
        </Button>
      </CardContent>
    </Card>
  );
};

export default DirectCryptoPayment;
