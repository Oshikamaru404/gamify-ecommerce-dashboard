import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { invokeAdminAuth } from '@/lib/adminAuth';
import { Shield, Copy, Download, RefreshCw, Key, User } from 'lucide-react';
import QRCode from 'qrcode';
import * as OTPAuth from 'otpauth';
import { Separator } from '@/components/ui/separator';

interface AdminAuthActionResponse extends Record<string, unknown> {
  username?: string;
  two_factor_enabled?: boolean;
  error?: string;
  backup_codes?: unknown;
}

function isBackupCodes(value: unknown): value is string[] {
  return Array.isArray(value) &&
    value.length === 10 &&
    value.every((item): item is string => typeof item === 'string' && /^[A-Z0-9]{8}$/.test(item)) &&
    new Set(value).size === value.length;
}

const TwoFactorSetup = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  
  // Password change state
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingCredentials, setIsChangingCredentials] = useState(false);
  const { toast } = useToast();
  const { logout } = useAdminAuth();

  const loadTwoFactorSetup = useCallback(async () => {
    try {
      const adminUser = await invokeAdminAuth<AdminAuthActionResponse>({
        action: 'security-settings',
      });
      if (adminUser?.error) throw new Error(adminUser.error);

      if (adminUser) {
        setIs2FAEnabled(adminUser.two_factor_enabled || false);
        setAdminUsername(adminUser.username || 'admin');
      }
    } catch (error) {
      console.error('Error loading 2FA setup:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not load security settings',
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    void loadTwoFactorSetup();
  }, [loadTwoFactorSetup]);

  const regenerateBackupCodes = async () => {
    try {
      const data = await invokeAdminAuth<AdminAuthActionResponse>({
        action: 'regenerate-backup-codes',
        otpCode: verificationCode,
      });
      if (data?.error || !isBackupCodes(data?.backup_codes)) {
        throw new Error(data?.error || 'Backup code generation failed');
      }

      setBackupCodes(data.backup_codes);
      setShowBackupCodes(true);
      setVerificationCode('');
      toast({ title: 'Success', description: 'Backup codes regenerated' });
    } catch (error) {
      console.error('Backup code regeneration failed', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to regenerate codes',
        variant: 'destructive',
      });
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
      const data = await invokeAdminAuth<AdminAuthActionResponse>({
        action: 'change-credentials',
        currentPassword,
        newUsername,
        newPassword,
        otpCode: verificationCode,
      });
      if (data?.error) throw new Error(data.error);

      toast({ title: 'Success', description: 'Credentials updated. Logging out...' });

      setTimeout(() => {
        void logout()
          .catch((error) => console.error('Could not end the updated admin session', error))
          .finally(() => { window.location.href = '/diza/login'; });
      }, 2000);
    } catch (error) {
      console.error('Admin credentials update failed', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update credentials',
        variant: 'destructive',
      });
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
          label: adminUsername,
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
          secret: otpSecret,
        });

        const qrCode = await QRCode.toDataURL(totp.toString());
        setQrCodeUrl(qrCode);
        setSecret(newSecret);
        toast({ title: 'Setup started', description: 'Scan the QR code, then verify a code to enable 2FA.' });
        return;
      }

      if (!/^\d{6}$/.test(otpCode)) {
        toast({ title: 'Error', description: 'Enter the 6-digit code from your authenticator app', variant: 'destructive' });
        return;
      }
      const data = await invokeAdminAuth<AdminAuthActionResponse>({
        action: 'save-2fa',
        secret: newSecret,
        otpCode,
      });
      if (data?.error || !isBackupCodes(data?.backup_codes)) {
        throw new Error(data?.error || 'Could not save authenticator settings');
      }

      setIs2FAEnabled(true);
      setBackupCodes(data.backup_codes);
      setShowBackupCodes(true);
      setOtpCode('');
      toast({ title: 'Success', description: '2FA enabled' });
    } catch (error) {
      console.error('Admin 2FA enable failed', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to enable 2FA',
        variant: 'destructive',
      });
    }
  };

  const handleDisable2FA = async () => {
    try {
      const data = await invokeAdminAuth<AdminAuthActionResponse>({
        action: 'disable-2fa',
        otpCode: verificationCode,
      });
      if (data?.error) throw new Error(data.error);

      setIs2FAEnabled(false);
      setQrCodeUrl('');
      setSecret('');
      setBackupCodes([]);
      setVerificationCode('');
      toast({ title: 'Success', description: '2FA disabled' });
    } catch (error) {
      console.error('Admin 2FA disable failed', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to disable 2FA',
        variant: 'destructive',
      });
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
            <div className="space-y-4">
              {qrCodeUrl ? (
                <>
                  <img src={qrCodeUrl} alt="Authenticator setup QR code" className="w-48 h-48 mx-auto" />
                  <div className="flex gap-2">
                    <Input value={secret} readOnly className="font-mono" aria-label="Authenticator setup key" />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => navigator.clipboard.writeText(secret)}
                      aria-label="Copy authenticator setup key"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otpCode">Authenticator Code</Label>
                    <Input
                      id="otpCode"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      required
                    />
                  </div>
                  <Button onClick={handleEnable2FA} className="w-full">Verify and Enable 2FA</Button>
                </>
              ) : (
                <Button onClick={handleEnable2FA} className="w-full">Set up 2FA</Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {backupCodes.length > 0 && (
                <>
                  <Separator />
                  <Button variant="outline" size="sm" onClick={() => setShowBackupCodes(!showBackupCodes)}>
                    {showBackupCodes ? 'Hide' : 'Show'} Newly Generated Backup Codes
                  </Button>
                </>
              )}
              {showBackupCodes && backupCodes.length > 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg">
                    {backupCodes.map((code) => <div key={code} className="font-mono text-sm">{code}</div>)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyBackupCodes}><Copy className="h-4 w-4 mr-2" />Copy</Button>
                    <Button variant="outline" size="sm" onClick={downloadBackupCodes}><Download className="h-4 w-4 mr-2" />Download</Button>
                  </div>
                </div>
              )}
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Authenticator or Backup Code</Label>
                <Input
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                  maxLength={8}
                  autoComplete="one-time-code"
                />
                <p className="text-xs text-muted-foreground">
                  Required when changing credentials, regenerating backup codes, or disabling 2FA.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={regenerateBackupCodes}>
                <RefreshCw className="h-4 w-4 mr-2" />Regenerate Backup Codes
              </Button>
              <Button onClick={handleDisable2FA} variant="destructive" className="w-full">Disable 2FA</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorSetup;
