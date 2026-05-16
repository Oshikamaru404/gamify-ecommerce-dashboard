import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserAuth } from '@/contexts/UserAuthContext';

const SecuritySettings: React.FC = () => {
  const { toast } = useToast();
  const { signOut } = useUserAuth();
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const change = async () => {
    if (pwd.length < 8) return toast({ title: 'Password too short', description: 'Min 8 characters', variant: 'destructive' });
    if (pwd !== confirm) return toast({ title: 'Mismatch', description: 'Passwords do not match', variant: 'destructive' });
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setBusy(false);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Password updated' }); setPwd(''); setConfirm(''); }
  };

  const logoutAll = async () => {
    await supabase.auth.signOut({ scope: 'global' as any });
    toast({ title: 'Signed out from all devices' });
    signOut();
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Security</h1>
        <p className="text-muted-foreground text-sm">Manage your password and sessions.</p>
      </div>

      <Card className="p-5 sm:p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Shield className="h-4 w-4" /> Change password</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>New password</Label>
            <Input type="password" value={pwd} onChange={e => setPwd(e.target.value)} />
          </div>
          <div>
            <Label>Confirm password</Label>
            <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
        </div>
        <Button onClick={change} disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Update password
        </Button>
      </Card>

      <Card className="p-5 sm:p-6 space-y-3">
        <h2 className="font-semibold">Active sessions</h2>
        <p className="text-sm text-muted-foreground">Sign out everywhere if you suspect unauthorized access.</p>
        <Button variant="outline" onClick={logoutAll}>Logout from all devices</Button>
      </Card>

      <Card className="p-5 sm:p-6 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Two-factor authentication</h2>
          <Badge variant="secondary">Coming soon</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
      </Card>
    </div>
  );
};

export default SecuritySettings;
