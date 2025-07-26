
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useToast } from '@/hooks/use-toast';
import TwoFactorInput from '@/components/admin/TwoFactorInput';
import { getAdminUser2FA, verifyTOTP, verifyBackupCode } from '@/lib/twoFactorAuth';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [adminUser2FA, setAdminUser2FA] = useState<any>(null);
  const { login, adminUser, isLoading: authLoading } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (adminUser && !authLoading) {
      console.log('AdminLogin - Already logged in, redirecting to admin dashboard');
      navigate('/admin', { replace: true });
    }
  }, [adminUser, authLoading, navigate]);

  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both username and password',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    console.log('AdminLogin - Attempting initial login...');

    try {
      // First verify basic credentials
      if (username !== 'admin' || password !== 'admin123') {
        toast({
          title: 'Login Failed',
          description: 'Invalid username or password. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Check if 2FA is enabled
      const user2FA = await getAdminUser2FA(username);
      
      if (user2FA?.two_factor_enabled && user2FA.two_factor_secret) {
        console.log('AdminLogin - 2FA is enabled, showing 2FA input');
        setAdminUser2FA(user2FA);
        setShowTwoFactor(true);
      } else {
        console.log('AdminLogin - 2FA not enabled, proceeding with regular login');
        const success = await login(username, password);
        
        if (success) {
          toast({
            title: 'Login Successful',
            description: 'Welcome to the admin dashboard!',
          });
          navigate('/admin', { replace: true });
        } else {
          toast({
            title: 'Login Failed',
            description: 'An error occurred during login. Please try again.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('AdminLogin - Login error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during login. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorVerify = async (code: string, isBackupCode = false): Promise<boolean> => {
    setTwoFactorLoading(true);
    
    try {
      let isValid = false;

      if (isBackupCode) {
        console.log('AdminLogin - Verifying backup code');
        isValid = await verifyBackupCode(username, code);
      } else {
        console.log('AdminLogin - Verifying TOTP code');
        if (adminUser2FA?.two_factor_secret) {
          isValid = verifyTOTP(adminUser2FA.two_factor_secret, code);
        }
      }

      if (isValid) {
        console.log('AdminLogin - 2FA verification successful');
        
        // Complete the login process
        const success = await login(username, password);
        
        if (success) {
          toast({
            title: 'Login Successful',
            description: 'Two-factor authentication verified successfully!',
          });
          navigate('/admin', { replace: true });
          return true;
        } else {
          toast({
            title: 'Login Failed',
            description: 'Failed to complete login after 2FA verification',
            variant: 'destructive',
          });
          return false;
        }
      } else {
        console.log('AdminLogin - 2FA verification failed');
        toast({
          title: 'Verification Failed',
          description: isBackupCode 
            ? 'Invalid backup code. Please try again.' 
            : 'Invalid authentication code. Please try again.',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('AdminLogin - 2FA verification error:', error);
      toast({
        title: 'Verification Error',
        description: 'An error occurred during verification. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleBackTo2FA = () => {
    setShowTwoFactor(false);
    setAdminUser2FA(null);
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
      {showTwoFactor ? (
        <TwoFactorInput
          onVerify={handleTwoFactorVerify}
          onBack={handleBackTo2FA}
          isLoading={twoFactorLoading}
        />
      ) : (
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
            <form onSubmit={handleInitialLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center font-medium mb-2">
                Default Admin Credentials:
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminLogin;
