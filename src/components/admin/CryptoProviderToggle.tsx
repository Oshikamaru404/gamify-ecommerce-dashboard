import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Zap, Shield } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSetting } from '@/hooks/useSiteSettings';

const CryptoProviderToggle: React.FC = () => {
  const { data: settings } = useSiteSettings();
  const update = useUpdateSiteSetting();
  const [provider, setProvider] = useState<'self_hosted' | 'paygate'>('self_hosted');

  useEffect(() => {
    const v = settings?.find(s => s.setting_key === 'crypto_provider')?.setting_value;
    if (v === 'self_hosted' || v === 'paygate') setProvider(v);
  }, [settings]);

  const save = async (next: 'self_hosted' | 'paygate') => {
    setProvider(next);
    await update.mutateAsync({ key: 'crypto_provider', value: next });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-600" />
          Crypto Payment Provider
        </CardTitle>
        <CardDescription>
          Choose how crypto payments are processed. Self-hosted sends funds directly to your
          wallets with zero gateway fees. PayGate uses an intermediary processor.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => save('self_hosted')}
            disabled={update.isPending}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              provider === 'self_hosted'
                ? 'border-purple-600 bg-purple-50 shadow-md'
                : 'border-border hover:border-purple-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="font-semibold">Self-hosted (recommended)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Direct to your wallets · 0% fees · Auto-detected via blockchain · ~1 min poll
            </p>
          </button>

          <button
            type="button"
            onClick={() => save('paygate')}
            disabled={update.isPending}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              provider === 'paygate'
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-border hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-semibold">PayGate (fallback)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Intermediary processor · ~1% fee · Battle-tested · Use if explorers are down
            </p>
          </button>
        </div>

        {update.isPending && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> Saving…
          </div>
        )}

        <div className="text-xs bg-muted/50 border border-border rounded p-3">
          <Label className="text-xs font-semibold">Currently active:</Label>{' '}
          <span className="font-mono">{provider}</span>
          <p className="mt-1 text-muted-foreground">
            You can switch any time. Existing pending intents continue under their original provider.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoProviderToggle;
