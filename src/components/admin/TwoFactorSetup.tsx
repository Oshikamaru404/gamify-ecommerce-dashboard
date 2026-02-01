import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Copy, Download, RefreshCw, Key, User } from 'lucide-react';
import QRCode from 'qrcode';
import * as OTPAuth from 'otpauth';
import bcrypt from 'bcryptjs';
import { Separator } from '@/components/ui/separator';

const TwoFactorSetup = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  
  // Password change state
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingCredentials, setIsChangingCredentials] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTwoFactorSetup();
  }, []);

  const loadTwoFactorSetup = async () => {
    try {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('username, two_factor_secret, backup_codes, two_factor_enabled')
        .eq('username', 'admin')
        .single();

      if (adminUser) {
        setIs2FAEnabled(adminUser.two_factor_enabled || false);
        setBackupCodes(adminUser.backup_codes || []);
        
        if (adminUser.two_factor_secret) {
          const totp = new OTPAuth.TOTP({
            issuer: 'Admin Panel',
            label: 'admin',
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(adminUser.two_factor_secret),
          });

          const otpauthUrl = totp.toString();
          const qrCode = await QRCode.toDataURL(otpauthUrl);
          
          setQrCodeUrl(qrCode);
          setSecret(adminUser.two_factor_secret);
        }
      }
    } catch (error) {
      console.error('Error loading 2FA setup:', error);
    }
  };

  const generateBackupCodes = () => {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  };

  const regenerateBackupCodes = async () => {
    try {
      const newCodes = generateBackupCodes();
      
      const { error } = await supabase
        .from('admin_users')
        .update({ backup_codes: newCodes })
        .eq('username', 'admin');

      if (error) throw error;

      setBackupCodes(newCodes);
      setShowBackupCodes(true);
      toast({ title: 'Success', description: 'Backup codes regenerated' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to regenerate codes', variant: 'destructive' });
    }
  };

  const downloadBackupCodes = () => {
    const content = `Admin Backup Codes\n\n${backupCodes.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    toast({ title: 'Copied', description: 'Backup codes copied' });
  };

  const handleChangeCredentials = async () => {
    if (!newUsername && !newPassword) {
      toast({ title: 'Error', description: 'Enter new username or password', variant: 'destructive' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    if (newPassword && newPassword.length < 8) {
      toast({ title: 'Error', description: 'Password must be 8+ characters', variant: 'destructive' });
      return;
    }

    if (!currentPassword) {
      toast({ title: 'Error', description: 'Enter current password', variant: 'destructive' });
      return;
    }

    setIsChangingCredentials(true);

    try {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('password_hash, username')
        .eq('username', 'admin')
        .single() as any;

      if (!adminUser) throw new Error('Admin not found');

      const isPasswordValid = await bcrypt.compare(currentPassword, adminUser.password_hash || '');
      
      if (!isPasswordValid) {
        toast({ title: 'Error', description: 'Current password incorrect', variant: 'destructive' });
        return;
      }

      const updateData: any = {};
      if (newUsername) updateData.username = newUsername;
      if (newPassword) updateData.password_hash = await bcrypt.hash(newPassword, 10);

      const { error } = await supabase
        .from('admin_users')
        .update(updateData)
        .eq('username', adminUser.username);

      if (error) throw error;

      toast({ title: 'Success', description: 'Credentials updated. Logging out...' });

      setTimeout(() => {
        localStorage.removeItem('admin_user');
        window.location.href = '/blacknode/login';
      }, 2000);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    } finally {
      setIsChangingCredentials(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      let newSecret = secret;
      if (!newSecret) {
        const otpSecret = new OTPAuth.Secret({ size: 20 });
        newSecret = otpSecret.base32;
        
        const totp = new OTPAuth.TOTP({
          issuer: 'Admin Panel',
          label: 'admin',
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
          secret: otpSecret,
        });

        const qrCode = await QRCode.toDataURL(totp.toString());
        setQrCodeUrl(qrCode);
        setSecret(newSecret);
      }

      const newBackupCodes = generateBackupCodes();
      await supabase.from('admin_users').update({ 
        two_factor_enabled: true,
        two_factor_secret: newSecret,
        backup_codes: newBackupCodes
      }).eq('username', 'admin');

      setIs2FAEnabled(true);
      setBackupCodes(newBackupCodes);
      setShowBackupCodes(true);
      toast({ title: 'Success', description: '2FA enabled' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to enable 2FA', variant: 'destructive' });
    }
  };

  const handleDisable2FA = async () => {
    try {
      await supabase.from('admin_users').update({ 
        two_factor_enabled: false,
        two_factor_secret: null,
        backup_codes: null
      }).eq('username', 'admin');

      setIs2FAEnabled(false);
      setQrCodeUrl('');
      setSecret('');
      setBackupCodes([]);
      toast({ title: 'Success', description: '2FA disabled' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to disable 2FA', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Change Username & Password</CardTitle>
          </div>
          <CardDescription>Update credentials (requires re-login)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newUsername">New Username (optional)</Label>
            <Input id="newUsername" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password (optional)</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          {newPassword && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          )}
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password *</Label>
            <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <Button onClick={handleChangeCredentials} disabled={isChangingCredentials} className="w-full">
            <Key className="h-4 w-4 mr-2" />
            {isChangingCredentials ? 'Updating...' : 'Update Credentials'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!is2FAEnabled ? (
            <Button onClick={handleEnable2FA} className="w-full">Enable 2FA</Button>
          ) : (
            <div className="space-y-4">
              {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto" />}
              {secret && (
                <div className="flex gap-2">
                  <Input value={secret} readOnly className="font-mono" />
                  <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(secret)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Separator />
              <div>
                <Button variant="outline" size="sm" onClick={() => setShowBackupCodes(!showBackupCodes)}>
                  {showBackupCodes ? 'Hide' : 'Show'} Backup Codes
                </Button>
              </div>
              {showBackupCodes && backupCodes.length > 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg">
                    {backupCodes.map((code, i) => <div key={i} className="font-mono text-sm">{code}</div>)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyBackupCodes}><Copy className="h-4 w-4 mr-2" />Copy</Button>
                    <Button variant="outline" size="sm" onClick={downloadBackupCodes}><Download className="h-4 w-4 mr-2" />Download</Button>
                    <Button variant="outline" size="sm" onClick={regenerateBackupCodes}><RefreshCw className="h-4 w-4 mr-2" />Regenerate</Button>
                  </div>
                </div>
              )}
              <Separator />
              <Button onClick={handleDisable2FA} variant="destructive" className="w-full">Disable 2FA</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorSetup;
