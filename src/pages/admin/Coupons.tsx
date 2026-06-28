import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, RefreshCw, Tag, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const PRODUCT_TYPES = ['iptv_subscription', 'iptv_panel', 'player_activation', 'player_panel'];

const blank = {
  code: '',
  name: '',
  description: '',
  discount_type: 'percentage' as 'percentage' | 'fixed',
  discount_value: 10,
  status: 'active',
  starts_at: '',
  expires_at: '',
  max_total_uses: '',
  max_uses_per_user: '',
  max_uses_per_device: '',
  minimum_order_amount: 0,
  applicable_product_types: [] as string[],
};

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = ''; for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...blank });

  const load = async () => {
    setLoading(true);
    const [{ data: cs }, { data: at }] = await Promise.all([
      supabase.from('coupons').select('*').order('created_at', { ascending: false }),
      supabase.from('coupon_usage_attempts').select('*').order('created_at', { ascending: false }).limit(50),
    ]);
    setCoupons(cs ?? []); setAttempts(at ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...blank, code: randomCode() }); setOpen(true); };
  const openEdit = (c: any) => {
    setEditing(c);
    setForm({
      code: c.code, name: c.name ?? '', description: c.description ?? '',
      discount_type: c.discount_type, discount_value: Number(c.discount_value),
      status: c.status,
      starts_at: c.starts_at ? c.starts_at.slice(0, 16) : '',
      expires_at: c.expires_at ? c.expires_at.slice(0, 16) : '',
      max_total_uses: c.max_total_uses ?? '',
      max_uses_per_user: c.max_uses_per_user ?? '',
      max_uses_per_device: c.max_uses_per_device ?? '',
      minimum_order_amount: Number(c.minimum_order_amount ?? 0),
      applicable_product_types: c.applicable_product_types ?? [],
    });
    setOpen(true);
  };

  const save = async () => {
    const payload: any = {
      code: form.code.trim().toUpperCase(),
      name: form.name || null,
      description: form.description || null,
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      status: form.status,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      max_total_uses: form.max_total_uses ? Number(form.max_total_uses) : null,
      max_uses_per_user: form.max_uses_per_user ? Number(form.max_uses_per_user) : null,
      max_uses_per_device: form.max_uses_per_device ? Number(form.max_uses_per_device) : null,
      minimum_order_amount: Number(form.minimum_order_amount) || 0,
      applicable_product_types: form.applicable_product_types,
    };
    const q = editing
      ? supabase.from('coupons').update(payload).eq('id', editing.id)
      : supabase.from('coupons').insert(payload);
    const { error } = await q;
    if (error) { toast.error(error.message); return; }
    toast.success('Saved'); setOpen(false); load();
  };

  const toggleStatus = async (c: any) => {
    const next = c.status === 'active' ? 'inactive' : 'active';
    await supabase.from('coupons').update({ status: next }).eq('id', c.id);
    load();
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Tag className="h-6 w-6" /> Coupons</h1>
          <p className="text-sm text-muted-foreground">Create promo codes, set rules, monitor usage.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4" /></Button>
          <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> New coupon</Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">All coupons</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr className="border-b"><th className="text-left p-2">Code</th><th className="text-left p-2">Discount</th><th className="text-left p-2">Uses</th><th className="text-left p-2">Status</th><th className="text-left p-2">Expires</th><th></th></tr>
                </thead>
                <tbody>
                  {coupons.map(c => (
                    <tr key={c.id} className="border-b">
                      <td className="p-2 font-mono font-bold">{c.code}</td>
                      <td className="p-2">{c.discount_type === 'percentage' ? `-${c.discount_value}%` : `-${c.discount_value} ${c.currency || 'EUR'}`}</td>
                      <td className="p-2">{c.total_uses}{c.max_total_uses ? ` / ${c.max_total_uses}` : ''}</td>
                      <td className="p-2"><Badge variant={c.status === 'active' ? 'default' : 'secondary'}>{c.status}</Badge></td>
                      <td className="p-2 text-xs">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '—'}</td>
                      <td className="p-2 flex gap-1 justify-end">
                        <Switch checked={c.status === 'active'} onCheckedChange={() => toggleStatus(c)} />
                        <Button size="sm" variant="ghost" onClick={() => openEdit(c)}>Edit</Button>
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No coupons yet.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Recent attempts</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto text-xs">
            <table className="w-full">
              <thead><tr className="border-b text-muted-foreground"><th className="text-left p-2">Code</th><th className="text-left p-2">Result</th><th className="text-left p-2">Reason</th><th className="text-left p-2">IP</th><th className="text-left p-2">When</th></tr></thead>
              <tbody>
                {attempts.map(a => (
                  <tr key={a.id} className="border-b">
                    <td className="p-2 font-mono">{a.code}</td>
                    <td className="p-2"><Badge variant={a.success ? 'default' : 'destructive'}>{a.success ? 'ok' : 'failed'}</Badge></td>
                    <td className="p-2">{a.failure_reason ?? '—'}</td>
                    <td className="p-2">{a.ip_address ?? '—'}</td>
                    <td className="p-2">{new Date(a.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit coupon' : 'New coupon'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Code</Label><div className="flex gap-1"><Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} /><Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, code: randomCode() })}>↻</Button></div></div>
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            </div>
            <div><Label>Description</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Type</Label>
                <Select value={form.discount_type} onValueChange={(v: any) => setForm({ ...form, discount_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Fixed</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Value</Label><Input type="number" value={form.discount_value} onChange={e => setForm({ ...form, discount_value: Number(e.target.value) })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Starts</Label><Input type="datetime-local" value={form.starts_at} onChange={e => setForm({ ...form, starts_at: e.target.value })} /></div>
              <div><Label>Expires</Label><Input type="datetime-local" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div><Label>Max total</Label><Input type="number" value={form.max_total_uses} onChange={e => setForm({ ...form, max_total_uses: e.target.value as any })} /></div>
              <div><Label>Per user</Label><Input type="number" value={form.max_uses_per_user} onChange={e => setForm({ ...form, max_uses_per_user: e.target.value as any })} /></div>
              <div><Label>Per device</Label><Input type="number" value={form.max_uses_per_device} onChange={e => setForm({ ...form, max_uses_per_device: e.target.value as any })} /></div>
            </div>
            <div><Label>Min order amount</Label><Input type="number" value={form.minimum_order_amount} onChange={e => setForm({ ...form, minimum_order_amount: Number(e.target.value) })} /></div>
            <div>
              <Label>Applicable product types (leave empty for all)</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {PRODUCT_TYPES.map(t => {
                  const on = form.applicable_product_types.includes(t);
                  return (
                    <Badge key={t} variant={on ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setForm({
                      ...form,
                      applicable_product_types: on ? form.applicable_product_types.filter(x => x !== t) : [...form.applicable_product_types, t],
                    })}>{t}</Badge>
                  );
                })}
              </div>
            </div>
            <div><Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCoupons;
