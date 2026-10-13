
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useToast } from '@/hooks/use-toast';
import { invokeAdminAuth } from '@/lib/adminAuth';

interface RecoveryResponse extends Record<string, unknown> {
  error?: string;
}

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, verifyOtp, adminUser, isLoading: authLoading } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (adminUser && !authLoading) {
      console.log('AdminLogin - Already logged in, redirecting to admin dashboard');
      navigate('/diza', { replace: true });
    }
  }, [adminUser, authLoading, navigate]);

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'Error',
        description: 'The new passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsRecovering(true);
    try {
      const result = await invokeAdminAuth<RecoveryResponse>(
        { action: 'recover-shika-password', newPassword },
        { 'x-admin-recovery-token': recoveryToken },
      );
      if (result.error) throw new Error(result.error);

      setRecoveryToken('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowRecovery(false);
      toast({
        title: 'Password reset',
        description: 'You can now sign in as shika. The temporary recovery can only be used once.',
      });
    } catch (error) {
      console.error('Admin recovery failed', error);
      toast({
        title: 'Recovery failed',
        description: error instanceof Error ? error.message : 'Could not recover admin access',
        variant: 'destructive',
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showOtpInput) {
      // First step: validate username and password
      if (!username || !password) {
        toast({
          title: 'Error',
          description: 'Please enter both username and password',
          variant: 'destructive',
        });
        return;
      }

      setIsLoading(true);
      console.log('AdminLogin - Attempting login...');

      try {
        const result = await login(username, password);
        
        if (result.success) {
          if (result.requires2FA) {
            console.log('AdminLogin - 2FA required');
            setShowOtpInput(true);
            toast({
              title: 'Authentication Required',
              description: 'Please enter your 6-digit authentication code',
            });
          } else {
            console.log('AdminLogin - Login successful');
            toast({
              title: 'Login Successful',
              description: 'Welcome to the admin dashboard!',
            });
            navigate('/diza', { replace: true });
          }
        } else {
          console.log('AdminLogin - Login failed');
          toast({
            title: 'Login Failed',
            description: result.error || 'Invalid username or password. Please try again.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('AdminLogin - Login error:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'An error occurred during login. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Second step: verify OTP or backup code
      if (!otpCode || (otpCode.length !== 6 && otpCode.length !== 8)) {
        toast({
          title: 'Error',
          description: 'Please enter a valid 6-digit code or 8-character backup code',
          variant: 'destructive',
        });
        return;
      }

      setIsLoading(true);

      try {
        const result = await verifyOtp(otpCode);
        
        if (result.success) {
          console.log('AdminLogin - OTP verified, login successful');
          toast({
            title: 'Login Successful',
            description: 'Welcome to the admin dashboard!',
          });
          navigate('/diza', { replace: true });
        } else {
          toast({
            title: 'Invalid Code',
            description: result.error || 'The authentication code is incorrect. You can also use a backup code if you\'ve lost access to your authenticator.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('AdminLogin - OTP verification error:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'An error occurred during verification. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if already logged in
  if (adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-muted-foreground">
            Enter your credentials to access the admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          {showRecovery ? (
            <form onSubmit={handleRecovery} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                One-time recovery for the shika administrator account. Enter the temporary secret
                configured in Supabase and choose a new password. Do not share either value.
              </p>
              <div className="space-y-2">
                <Label htmlFor="recoveryToken">Temporary recovery secret</Label>
                <Input
                  id="recoveryToken"
                  type="password"
                  value={recoveryToken}
                  onChange={(e) => setRecoveryToken(e.target.value)}
                  minLength={32}
                  maxLength={256}
                  autoComplete="off"
                  disabled={isRecovering}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newAdminPassword">New password</Label>
                <Input
                  id="newAdminPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={12}
                  maxLength={72}
                  autoComplete="new-password"
                  disabled={isRecovering}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use at least 12 characters; passwords over 72 UTF-8 bytes are not accepted.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmAdminPassword">Confirm new password</Label>
                <Input
                  id="confirmAdminPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  minLength={12}
                  maxLength={72}
                  autoComplete="new-password"
                  disabled={isRecovering}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isRecovering}>
                {isRecovering ? 'Recovering...' : 'Reset password once'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isRecovering}
                onClick={() => setShowRecovery(false)}
              >
                Back to sign in
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!showOtpInput ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your 6-digit code from Google Authenticator or an 8-character backup code
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="otp">Authentication Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                    placeholder="Enter code"
                    disabled={isLoading}
                    maxLength={8}
                    required
                    className="text-center text-xl tracking-widest font-mono"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Enter the code from your authenticator app
                  </p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              {!showOtpInput && (
                <Button
                  type="button"
                  variant="link"
                  className="w-full"
                  onClick={() => setShowRecovery(true)}
                >
                  Recover shika admin access
                </Button>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
