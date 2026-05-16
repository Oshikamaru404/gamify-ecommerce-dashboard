import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Download, Loader2 } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useUserOrders } from '@/hooks/useUserOrders';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const DangerZone: React.FC = () => {
  const { user, profile, signOut } = useUserAuth();
  const { orders } = useUserOrders();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ profile, orders }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bwivox-data-${user?.id?.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteAccount = async () => {
    if (confirm !== 'DELETE') return toast({ title: 'Type DELETE to confirm', variant: 'destructive' });
    if (!user) return;
    setBusy(true);
    // Best-effort: delete profile row (cascade depends on schema). Auth user deletion requires admin API.
    await supabase.from('profiles').delete().eq('id', user.id);
    await signOut();
    setBusy(false);
    toast({ title: 'Account data removed', description: 'Contact support to fully delete your authentication record.' });
    navigate('/');
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Danger zone</h1>
        <p className="text-muted-foreground text-sm">Irreversible account actions.</p>
      </div>

      <Card className="p-5 sm:p-6 space-y-3">
        <h2 className="font-semibold flex items-center gap-2"><Download className="h-4 w-4" /> Export my data</h2>
        <p className="text-sm text-muted-foreground">Download a JSON file of your profile and orders (GDPR).</p>
        <Button variant="outline" onClick={exportData}>Download JSON</Button>
      </Card>

      <Card className="p-5 sm:p-6 space-y-3 border-destructive/40">
        <h2 className="font-semibold flex items-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4" /> Delete my account</h2>
        <p className="text-sm text-muted-foreground">This will remove your profile data. Type <strong>DELETE</strong> to confirm.</p>
        <Label>Confirmation</Label>
        <Input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="DELETE" />
        <Button variant="destructive" onClick={deleteAccount} disabled={busy || confirm !== 'DELETE'}>
          {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Permanently delete
        </Button>
      </Card>
    </div>
  );
};

export default DangerZone;
