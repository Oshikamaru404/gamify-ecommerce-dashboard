import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw, Users, Flag, Wallet } from 'lucide-react';
import { toast } from 'sonner';

const STATUSES = ['pending', 'active', 'suspended', 'rejected'] as const;

const AdminAffiliates: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [flags, setFlags] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedComms, setSelectedComms] = useState<string[]>([]);
  const [payoutMethod, setPayoutMethod] = useState('');
  const [payoutRef, setPayoutRef] = useState('');

  const load = async () => {
    setLoading(true);
    const [{ data: aff }, { data: c }, { data: f }] = await Promise.all([
      supabase.from('affiliates').select('*, profiles:profiles!affiliates_user_id_fkey(email,display_name)').order('created_at', { ascending: false }),
      supabase.from('affiliate_commissions').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('affiliate_fraud_flags').select('*').order('created_at', { ascending: false }).limit(50),
    ]);
    setAffiliates(aff ?? []); setCommissions(c ?? []); setFlags(f ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateAffiliate = async (id: string, patch: any) => {
    const { error } = await supabase.from('affiliates').update(patch).eq('id', id);
    if (error) toast.error(error.message); else { toast.success('Updated'); load(); }
  };

  const setCommissionStatus = async (id: string, status: 'approved' | 'rejected', reason?: string) => {
    const patch: any = { status, [status === 'approved' ? 'approved_at' : 'rejected_at']: new Date().toISOString() };
    if (reason) patch.rejection_reason = reason;
    await supabase.from('affiliate_commissions').update(patch).eq('id', id);
    toast.success('Commission updated');
    load();
  };

  const createPayout = async () => {
    if (!selected || selectedComms.length === 0) return;
    const { data, error } = await supabase.functions.invoke('admin-affiliate-payout', {
      body: { affiliate_id: selected, commission_ids: selectedComms, payout_method: payoutMethod, payout_reference: payoutRef, mark_paid: true },
    });
    if (error || !(data as any)?.ok) { toast.error((data as any)?.error || error?.message || 'failed'); return; }
    toast.success('Payout created'); setSelectedComms([]); setPayoutMethod(''); setPayoutRef(''); load();
  };

  const affiliateComms = selected ? commissions.filter(c => c.affiliate_id === selected) : [];
  const approvedForSelected = affiliateComms.filter(c => c.status === 'approved');

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6" /> Affiliates</h1>
          <p className="text-sm text-muted-foreground">Manage affiliates, commissions, and payouts.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4" /></Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">All affiliates</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground"><tr className="border-b"><th className="text-left p-2">User</th><th className="text-left p-2">Code</th><th className="text-left p-2">Rate</th><th className="text-left p-2">Pending</th><th className="text-left p-2">Approved</th><th className="text-left p-2">Paid</th><th className="text-left p-2">Status</th><th></th></tr></thead>
                <tbody>
                  {affiliates.map(a => (
                    <tr key={a.id} className={`border-b cursor-pointer ${selected === a.id ? 'bg-muted/50' : ''}`} onClick={() => setSelected(a.id)}>
                      <td className="p-2"><div className="text-xs">{a.profiles?.display_name ?? '—'}<br /><span className="text-muted-foreground">{a.profiles?.email}</span></div></td>
                      <td className="p-2 font-mono">{a.referral_code}</td>
                      <td className="p-2">{a.commission_type === 'percentage' ? `${a.commission_value}%` : `$${a.commission_value}`}</td>
                      <td className="p-2">${Number(a.total_pending).toFixed(2)}</td>
                      <td className="p-2">${Number(a.total_approved).toFixed(2)}</td>
                      <td className="p-2">${Number(a.total_paid).toFixed(2)}</td>
                      <td className="p-2">
                        <Select value={a.status} onValueChange={(v) => updateAffiliate(a.id, { status: v })}>
                          <SelectTrigger className="h-7 w-28"><SelectValue /></SelectTrigger>
                          <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <Input className="h-7 w-20" type="number" defaultValue={a.commission_value}
                          onBlur={(e) => { const v = Number(e.target.value); if (v !== Number(a.commission_value)) updateAffiliate(a.id, { commission_value: v }); }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardHeader><CardTitle className="text-base">Commissions for selected affiliate</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground"><tr className="border-b"><th className="p-2"></th><th className="text-left p-2">Amount</th><th className="text-left p-2">Order</th><th className="text-left p-2">Status</th><th className="text-left p-2">Validates</th><th></th></tr></thead>
                <tbody>
                  {affiliateComms.map(c => (
                    <tr key={c.id} className="border-b">
                      <td className="p-2">
                        {c.status === 'approved' && (
                          <input type="checkbox" checked={selectedComms.includes(c.id)} onChange={(e) => setSelectedComms(s => e.target.checked ? [...s, c.id] : s.filter(x => x !== c.id))} />
                        )}
                      </td>
                      <td className="p-2">${Number(c.amount).toFixed(2)}</td>
                      <td className="p-2 font-mono text-xs">#{String(c.order_id).slice(0, 8)}</td>
                      <td className="p-2"><Badge variant={c.status === 'paid' ? 'default' : c.status === 'approved' ? 'secondary' : c.status === 'rejected' ? 'destructive' : 'outline'}>{c.status}</Badge></td>
                      <td className="p-2 text-xs">{c.validation_available_at ? new Date(c.validation_available_at).toLocaleDateString() : '—'}</td>
                      <td className="p-2 flex gap-1">
                        {c.status === 'pending' && <>
                          <Button size="sm" variant="outline" onClick={() => setCommissionStatus(c.id, 'approved')}>Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => setCommissionStatus(c.id, 'rejected', 'admin_manual')}>Reject</Button>
                        </>}
                      </td>
                    </tr>
                  ))}
                  {affiliateComms.length === 0 && <tr><td colSpan={6} className="p-3 text-center text-muted-foreground">No commissions.</td></tr>}
                </tbody>
              </table>
            </div>

            {approvedForSelected.length > 0 && (
              <div className="border-t pt-3 space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2"><Wallet className="h-4 w-4" /> Create payout from selected ({selectedComms.length})</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Method (PayPal / Crypto / Bank)" value={payoutMethod} onChange={e => setPayoutMethod(e.target.value)} />
                  <Input placeholder="Reference / TX hash" value={payoutRef} onChange={e => setPayoutRef(e.target.value)} />
                </div>
                <Button size="sm" disabled={selectedComms.length === 0} onClick={createPayout}>Mark as paid</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Flag className="h-4 w-4 text-amber-600" /> Fraud flags</CardTitle></CardHeader>
        <CardContent>
          {flags.length === 0 ? <p className="text-sm text-muted-foreground">No flags raised.</p> : (
            <div className="space-y-1 text-xs">
              {flags.map(f => (
                <div key={f.id} className="border-b py-1.5">
                  <Badge variant={f.severity === 'high' ? 'destructive' : 'secondary'}>{f.severity}</Badge>
                  <span className="ml-2">{f.reason}</span>
                  <span className="text-muted-foreground ml-2">{new Date(f.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAffiliates;
