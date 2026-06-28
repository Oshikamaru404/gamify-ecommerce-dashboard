import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tag, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const AccountCoupons: React.FC = () => {
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(true);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [available, setAvailable] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const [{ data: reds }, { data: pub }] = await Promise.all([
        supabase.from('coupon_redemptions').select('*, coupons(code,name,description)').eq('user_id', user.id).order('redeemed_at', { ascending: false }),
        supabase.from('coupons').select('id,code,name,description,discount_type,discount_value,expires_at,starts_at').eq('status', 'active'),
      ]);
      setRedemptions(reds ?? []);
      setAvailable((pub ?? []).filter(c => !c.starts_at || new Date(c.starts_at) <= new Date()).filter(c => !c.expires_at || new Date(c.expires_at) >= new Date()));
      setLoading(false);
    })();
  }, [user]);

  const totalSaved = redemptions.reduce((s, r) => s + Number(r.discount_amount || 0), 0);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  const copy = (code: string) => { navigator.clipboard.writeText(code); toast.success(`Copied ${code}`); };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm text-muted-foreground">Lifetime savings</p>
            <p className="text-3xl font-bold text-emerald-600">${totalSaved.toFixed(2)}</p>
          </div>
          <Sparkles className="h-10 w-10 text-emerald-500/40" />
        </CardContent>
      </Card>

      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">Available ({available.length})</TabsTrigger>
          <TabsTrigger value="used">Used ({redemptions.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="available" className="space-y-3 pt-4">
          {available.length === 0 && <p className="text-sm text-muted-foreground">No public coupons right now.</p>}
          {available.map(c => (
            <Card key={c.id} className="border-dashed border-2 border-primary/30">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <button onClick={() => copy(c.code)} className="font-mono font-bold text-primary hover:underline">{c.code}</button>
                    <Badge variant="secondary">{c.discount_type === 'percentage' ? `-${c.discount_value}%` : `-$${c.discount_value}`}</Badge>
                  </div>
                  {c.description && <p className="text-xs text-muted-foreground mt-1">{c.description}</p>}
                </div>
                {c.expires_at && <p className="text-[11px] text-muted-foreground">Expires {new Date(c.expires_at).toLocaleDateString()}</p>}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="used" className="space-y-3 pt-4">
          {redemptions.length === 0 && <p className="text-sm text-muted-foreground">No coupons used yet.</p>}
          {redemptions.map(r => (
            <Card key={r.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-mono font-bold">{r.coupons?.code ?? '—'}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.redeemed_at).toLocaleString()}</p>
                </div>
                <p className="text-emerald-700 font-semibold">-${Number(r.discount_amount).toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountCoupons;
