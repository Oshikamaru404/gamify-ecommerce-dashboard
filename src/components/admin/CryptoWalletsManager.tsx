import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Save, Wallet } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSetting } from '@/hooks/useSiteSettings';
import { DEFAULT_CRYPTO_WALLETS, CryptoWallet } from '@/components/DirectCryptoPayment';
import { toast } from 'sonner';

const CryptoWalletsManager: React.FC = () => {
  const { data: siteSettings } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);

  useEffect(() => {
    const raw = siteSettings?.find(s => s.setting_key === 'crypto_wallets')?.setting_value;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setWallets(parsed);
          return;
        }
      } catch {}
    }
    setWallets(DEFAULT_CRYPTO_WALLETS);
  }, [siteSettings]);

  const update = (i: number, field: keyof CryptoWallet, value: string) => {
    setWallets(prev => prev.map((w, idx) => idx === i ? { ...w, [field]: value } : w));
  };

  const remove = (i: number) => setWallets(prev => prev.filter((_, idx) => idx !== i));
  const add = () => setWallets(prev => [...prev, { network: '', coin: '', address: '' }]);

  const save = async () => {
    const cleaned = wallets.filter(w => w.network.trim() && w.coin.trim() && w.address.trim());
    if (!cleaned.length) {
      toast.error('Add at least one wallet');
      return;
    }
    await updateSetting.mutateAsync({ key: 'crypto_wallets', value: JSON.stringify(cleaned) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Direct Crypto Wallets
        </CardTitle>
        <CardDescription>
          Manage the wallet addresses shown on the checkout "Wallet" tab. Customers pick a coin/network, send funds, and submit a TX hash for manual verification.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground px-1">
          <div className="col-span-3">Network</div>
          <div className="col-span-2">Coin</div>
          <div className="col-span-6">Address</div>
          <div className="col-span-1"></div>
        </div>
        {wallets.map((w, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center border rounded-lg p-2 sm:p-1 sm:border-0">
            <div className="sm:col-span-3">
              <Label className="sm:hidden text-xs">Network</Label>
              <Input
                value={w.network}
                onChange={(e) => update(i, 'network', e.target.value)}
                placeholder="e.g. BEP20"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="sm:hidden text-xs">Coin</Label>
              <Input
                value={w.coin}
                onChange={(e) => update(i, 'coin', e.target.value)}
                placeholder="USDT"
              />
            </div>
            <div className="sm:col-span-6">
              <Label className="sm:hidden text-xs">Address</Label>
              <Input
                value={w.address}
                onChange={(e) => update(i, 'address', e.target.value)}
                placeholder="0x..."
                className="font-mono text-xs"
              />
            </div>
            <div className="sm:col-span-1 flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => remove(i)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" onClick={add}>
            <Plus className="h-4 w-4 mr-1" /> Add Wallet
          </Button>
          <Button onClick={save} disabled={updateSetting.isPending}>
            <Save className="h-4 w-4 mr-1" />
            {updateSetting.isPending ? 'Saving...' : 'Save Wallets'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoWalletsManager;
