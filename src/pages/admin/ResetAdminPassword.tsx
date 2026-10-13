import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { invokeAdminAuth } from '@/lib/adminAuth';

interface AdminAuthActionResponse extends Record<string, unknown> {
  error?: string;
}

const ResetAdminPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { adminUser, isLoading: isAuthLoading } = useAdminAuth();

  if (isAuthLoading) return null;
  if (!adminUser) return <Navigate to="/diza/login" replace />;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast({ title: 'Error', description: 'Password must contain at least 8 characters', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      const data = await invokeAdminAuth<AdminAuthActionResponse>({
        action: 'change-credentials',
        currentPassword,
        newPassword,
        otpCode,
      });
      if (data?.error) throw new Error(data.error);

      toast({ title: 'Success', description: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtpCode('');
    } catch (error) {
      console.error('Admin password update failed', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update password',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Change Admin Password</CardTitle>
          <p className="text-sm text-muted-foreground">Your current password is required to continue.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otpCode">Authenticator or Backup Code (if 2FA is enabled)</Label>
              <Input
                id="otpCode"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                maxLength={8}
                autoComplete="one-time-code"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? 'Updating...' : 'Update Password'}
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/diza">Back to Admin</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetAdminPassword;
