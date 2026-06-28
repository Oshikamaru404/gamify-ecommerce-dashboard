import React, { useState } from 'react';
import { useAffiliate } from '@/hooks/useAffiliate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Copy, Link2, Users, MousePointerClick, TrendingUp, Wallet, Sparkles, Tag } from 'lucide-react';
import { buildReferralUrl } from '@/lib/affiliate';
import { toast } from 'sonner';

const StatCard = ({ icon: Icon, label, value, hint }: any) => (
  <Card>
    <CardContent className="p-4 space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-primary/60" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </CardContent>
  </Card>
);

const AccountAffiliate: React.FC = () => {
  const { affiliate, loading, stats, commissions, payouts, join } = useAffiliate();
  const [joining, setJoining] = useState(false);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  if (!affiliate) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Affiliate Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Share BWIVOX and earn a commission on every referred sale.</p>
          <ul className="text-sm space-y-1.5">
            <li>✓ 10% commission per paid order (default)</li>
            <li>✓ 30-day attribution window</li>
            <li>✓ Personalized referral link & coupon code</li>
            <li>✓ Payouts via crypto, PayPal, or bank transfer</li>
          </ul>
          <Button disabled={joining} onClick={async () => {
            setJoining(true);
            try { await join(); toast.success('Welcome aboard!'); }
            catch (e) { toast.error((e as Error).message); }
            finally { setJoining(false); }
          }}>
            {joining ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Join affiliate program
          </Button>
        </CardContent>
      </Card>
    );
  }

  const link = buildReferralUrl(typeof window !== 'undefined' ? window.location.origin : 'https://bwivox.com', affiliate.referral_code);
  const copy = (t: string, label = 'Copied') => { navigator.clipboard.writeText(t); toast.success(label); };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2"><Link2 className="h-5 w-5 text-primary" /> Your referral link</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Status: <Badge variant={affiliate.status === 'active' ? 'default' : 'secondary'}>{affiliate.status}</Badge></p>
          </div>
          <Badge className="bg-emerald-600">{affiliate.commission_type === 'percentage' ? `${affiliate.commission_value}% commission` : `$${affiliate.commission_value} per sale`}</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <code className="flex-1 px-3 py-2 rounded-md bg-muted text-xs sm:text-sm break-all">{link}</code>
            <Button size="sm" variant="outline" onClick={() => copy(link, 'Link copied')}><Copy className="h-4 w-4" /></Button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Code:</span>
            <code className="font-mono font-bold">{affiliate.referral_code}</code>
            <Button size="sm" variant="ghost" onClick={() => copy(affiliate.referral_code, 'Code copied')}><Copy className="h-3.5 w-3.5" /></Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={MousePointerClick} label="Clicks" value={stats.clicks} />
        <StatCard icon={Users} label="Signups" value={stats.referrals} />
        <StatCard icon={TrendingUp} label="Conversions" value={stats.converted} />
        <StatCard icon={Wallet} label="Earnings" value={`$${Number(affiliate.total_approved + affiliate.total_paid).toFixed(2)}`} hint={`$${Number(affiliate.total_pending).toFixed(2)} pending`} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Commission history</CardTitle></CardHeader>
        <CardContent>
          {commissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No commissions yet — share your link!</p>
          ) : (
            <div className="space-y-2">
              {commissions.map(c => (
                <div key={c.id} className="flex items-center justify-between border-b py-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium">${Number(c.amount).toFixed(2)} {c.currency}</p>
                    <p className="text-[11px] text-muted-foreground">{new Date(c.created_at).toLocaleDateString()} · Order #{String(c.order_id).slice(0, 8)}</p>
                  </div>
                  <Badge variant={c.status === 'paid' ? 'default' : c.status === 'approved' ? 'secondary' : c.status === 'rejected' ? 'destructive' : 'outline'}>{c.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Payouts</CardTitle></CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payouts yet.</p>
          ) : (
            <div className="space-y-2">
              {payouts.map(p => (
                <div key={p.id} className="flex items-center justify-between border-b py-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium">${Number(p.amount).toFixed(2)} {p.currency}</p>
                    <p className="text-[11px] text-muted-foreground">{new Date(p.created_at).toLocaleDateString()} · {p.payout_method || '—'}</p>
                  </div>
                  <Badge variant={p.status === 'paid' ? 'default' : 'secondary'}>{p.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountAffiliate;
