import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PROVIDERS = [
  { id: 'google', label: 'Google' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'apple', label: 'Apple' },
  { id: 'discord', label: 'Discord' },
  { id: 'twitter', label: 'X (Twitter)' },
] as const;

const LinkedSettings: React.FC = () => {
  const { toast } = useToast();
  const [identities, setIdentities] = useState<any[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = async () => {
    const { data } = await supabase.auth.getUser();
    setIdentities(data.user?.identities || []);
  };

  useEffect(() => { refresh(); }, []);

  const isLinked = (id: string) => identities.some(i => i.provider === id);

  const link = async (provider: any) => {
    setBusy(provider);
    const { error } = await supabase.auth.linkIdentity({ provider, options: { redirectTo: `${window.location.origin}/auth/callback` } } as any);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    setBusy(null);
  };

  const unlink = async (identity: any) => {
    setBusy(identity.provider);
    const { error } = await supabase.auth.unlinkIdentity(identity);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: `${identity.provider} unlinked` }); refresh(); }
    setBusy(null);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Linked accounts</h1>
        <p className="text-muted-foreground text-sm">Connect social accounts for quick login.</p>
      </div>

      <Card className="divide-y">
        {PROVIDERS.map(p => {
          const linked = isLinked(p.id);
          const identity = identities.find(i => i.provider === p.id);
          return (
            <div key={p.id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{p.label}</div>
                {linked && <div className="text-xs text-muted-foreground">{identity?.identity_data?.email}</div>}
              </div>
              <div className="flex items-center gap-2">
                {linked ? (
                  <>
                    <Badge variant="default">Connected</Badge>
                    <Button size="sm" variant="outline" onClick={() => unlink(identity)} disabled={busy === p.id || identities.length <= 1}>
                      {busy === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Disconnect'}
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => link(p.id)} disabled={busy === p.id}>
                    {busy === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Connect'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default LinkedSettings;
