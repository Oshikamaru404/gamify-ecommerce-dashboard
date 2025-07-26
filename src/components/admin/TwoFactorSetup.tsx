import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Copy, Download, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';
import * as OTPAuth from 'otpauth';
import { supabase } from '@/integrations/supabase/client';

interface TwoFactorSetupProps {
  adminUser: any;
  onSetupComplete: () => void;
  onCancel: () => void;
}

// Browser-compatible base32 encoding function
const base32Encode = (buffer: Uint8Array): string => {
  const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += base32chars[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += base32chars[(value << (5 - bits)) & 31];
  }

  return output;
};

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  adminUser,
  onSetupComplete,
  onCancel
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const { toast } = useToast();

  useEffect(() => {
    generateSecret();
  }, []);

  const generateSecret = () => {
    // Generate a random 20-byte secret
    const buffer = new Uint8Array(20);
    crypto.getRandomValues(buffer);
    const secretKey = base32Encode(buffer);
    
    setSecret(secretKey);
    generateQRCode(secretKey);
  };

  const generateQRCode = async (secretKey: string) => {
    try {
      const totp = new OTPAuth.TOTP({
        issuer: 'Admin Panel',
        label: adminUser.username,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secretKey,
      });

      const qrUrl = await QRCode.toDataURL(totp.toString());
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate QR code',
        variant: 'destructive',
      });
    }
  };

  const generateBackupCodes = (): string[] => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a 6-digit verification code',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Create TOTP instance with the secret
      const totp = new OTPAuth.TOTP({
        issuer: 'Admin Panel',
        label: adminUser.username,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret,
      });

      // Verify the token - pass the string directly
      const cleanToken = verificationCode.replace(/\D/g, '');
      const isValid = totp.validate({ token: cleanToken, window: 1 }) !== null;

      if (isValid) {
        // Generate backup codes
        const codes = generateBackupCodes();
        setBackupCodes(codes);
        setStep('backup');
        
        toast({
          title: 'Verification Successful',
          description: 'Two-factor authentication has been set up successfully',
        });
      } else {
        toast({
          title: 'Invalid Code',
          description: 'The verification code is incorrect. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: 'Verification Failed',
        description: 'An error occurred during verification',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const saveTwoFactorSettings = async () => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          two_factor_secret: secret,
          two_factor_enabled: true,
          backup_codes: backupCodes,
          created_backup_codes_at: new Date().toISOString(),
        })
        .eq('username', adminUser.username);

      if (error) {
        throw error;
      }

      toast({
        title: 'Setup Complete',
        description: 'Two-factor authentication has been enabled successfully',
      });

      onSetupComplete();
    } catch (error) {
      console.error('Error saving 2FA settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save two-factor authentication settings',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    });
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
      description: 'Backup codes have been downloaded',
    });
  };

  if (step === 'setup') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-xl">Set up Two-Factor Authentication</CardTitle>
          <p className="text-sm text-gray-600">
            Scan the QR code with your authenticator app
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {qrCodeUrl && (
            <div className="flex justify-center">
              <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Manual Entry Key:</Label>
            <div className="flex items-center space-x-2">
              <Input 
                value={secret} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(secret)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Use this key if you can't scan the QR code
            </p>
          </div>

          <div className="flex space-x-2">
            <Button onClick={() => setStep('verify')} className="flex-1">
              Continue
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'verify') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify Setup</CardTitle>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code from your authenticator app
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="000000"
              className="text-center font-mono text-lg"
              disabled={isVerifying}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={verifyCode}
              disabled={isVerifying || verificationCode.length !== 6}
              className="flex-1"
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </Button>
            <Button variant="outline" onClick={() => setStep('setup')}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'backup') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-xl">Save Backup Codes</CardTitle>
          <p className="text-sm text-gray-600">
            Store these codes in a safe place. You can use them to access your account if you lose your authenticator device.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code, index) => (
              <Badge key={index} variant="outline" className="font-mono p-2 justify-center">
                {code}
              </Badge>
            ))}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={downloadBackupCodes}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(backupCodes.join('\n'))}
              className="flex-1"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>

          <Button onClick={saveTwoFactorSettings} className="w-full">
            Complete Setup
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default TwoFactorSetup;
