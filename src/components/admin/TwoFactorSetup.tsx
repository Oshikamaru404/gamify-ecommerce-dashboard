import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Copy, Check, RefreshCw, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode';
import * as OTPAuth from 'otpauth';

const TwoFactorSetup = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTwoFactorSetup();
  }, []);

  const loadTwoFactorSetup = async () => {
    try {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('two_factor_secret, backup_codes')
        .eq('username', 'admin')
        .single();

      if (adminUser?.two_factor_secret) {
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
        setBackupCodes(adminUser.backup_codes || []);
      }
    } catch (error) {
      console.error('Error loading 2FA setup:', error);
      toast({
        title: 'Error',
        description: 'Failed to load 2FA setup',
        variant: 'destructive',
      });
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
        .update({ 
          backup_codes: newCodes,
          created_backup_codes_at: new Date().toISOString()
        })
        .eq('username', 'admin');

      if (error) throw error;

      setBackupCodes(newCodes);
      setShowBackupCodes(true);
      
      toast({
        title: 'Success',
        description: 'Backup codes regenerated successfully',
      });
    } catch (error) {
      console.error('Error regenerating backup codes:', error);
      toast({
        title: 'Error',
        description: 'Failed to regenerate backup codes',
        variant: 'destructive',
      });
    }
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Downloaded',
      description: 'Backup codes downloaded successfully',
    });
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    toast({
      title: 'Copied',
      description: 'Backup codes copied to clipboard',
    });
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied',
      description: 'Secret key copied to clipboard',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Two-Factor Authentication</CardTitle>
        </div>
        <CardDescription>
          Secure your admin account with Google Authenticator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Setup Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Download Google Authenticator on your mobile device</li>
              <li>Scan the QR code below or enter the secret key manually</li>
              <li>Enter the 6-digit code from the app when logging in</li>
            </ol>
          </div>

          {qrCodeUrl && (
            <div className="flex flex-col items-center gap-4 p-6 bg-background border rounded-lg">
              <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
              
              <div className="w-full space-y-2">
                <p className="text-sm font-medium text-center">Manual Entry Key:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-muted rounded text-sm text-center font-mono break-all">
                    {secret}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copySecret}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> Save your secret key in a secure location. If you lose access to your authenticator app, you'll need this key to regain access.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Backup Codes</h3>
              <p className="text-sm text-muted-foreground">
                Use these codes to access your account if you lose your device
              </p>
            </div>
            <Button 
              onClick={regenerateBackupCodes}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {backupCodes.length > 0 ? 'Regenerate' : 'Generate'} Codes
            </Button>
          </div>

          {backupCodes.length > 0 && (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="p-2 bg-background rounded border">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={downloadBackupCodes}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button 
                  onClick={copyBackupCodes}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy All
                </Button>
              </div>

              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive">
                  <strong>Warning:</strong> Each backup code can only be used once. Store them securely and regenerate new codes after using them.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TwoFactorSetup;
