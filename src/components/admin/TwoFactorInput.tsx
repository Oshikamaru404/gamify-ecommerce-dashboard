
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TwoFactorInputProps {
  onVerify: (code: string, isBackupCode?: boolean) => Promise<boolean>;
  onBack: () => void;
  isLoading: boolean;
}

const TwoFactorInput: React.FC<TwoFactorInputProps> = ({
  onVerify,
  onBack,
  isLoading
}) => {
  const [authCode, setAuthCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [activeTab, setActiveTab] = useState('authenticator');
  const { toast } = useToast();

  const handleAuthCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authCode || authCode.length !== 6) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a 6-digit authentication code',
        variant: 'destructive',
      });
      return;
    }

    const success = await onVerify(authCode, false);
    if (!success) {
      setAuthCode('');
    }
  };

  const handleBackupCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!backupCode || backupCode.length !== 8) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a valid backup code',
        variant: 'destructive',
      });
      return;
    }

    const success = await onVerify(backupCode.toUpperCase(), true);
    if (!success) {
      setBackupCode('');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
        <p className="text-sm text-gray-600">
          Enter your authentication code to continue
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="authenticator" className="text-sm">
              <Shield className="h-4 w-4 mr-1" />
              Authenticator
            </TabsTrigger>
            <TabsTrigger value="backup" className="text-sm">
              <Key className="h-4 w-4 mr-1" />
              Backup Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="authenticator" className="space-y-4">
            <form onSubmit={handleAuthCodeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-code">6-digit code from your authenticator app</Label>
                <Input
                  id="auth-code"
                  type="text"
                  maxLength={6}
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="text-center font-mono text-lg tracking-widest"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={isLoading || authCode.length !== 6}
                  className="flex-1"
                >
                  {isLoading ? 'Verifying...' : 'Verify'}
                </Button>
                <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
                  Back
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <form onSubmit={handleBackupCodeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backup-code">8-character backup code</Label>
                <Input
                  id="backup-code"
                  type="text"
                  maxLength={8}
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                  placeholder="XXXXXXXX"
                  className="text-center font-mono text-lg tracking-widest"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Use one of the backup codes you saved during setup
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={isLoading || backupCode.length !== 8}
                  className="flex-1"
                >
                  {isLoading ? 'Verifying...' : 'Use Backup Code'}
                </Button>
                <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
                  Back
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TwoFactorInput;
