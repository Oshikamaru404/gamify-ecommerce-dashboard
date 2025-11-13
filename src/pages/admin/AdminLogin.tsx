
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, verifyOtp, adminUser, isLoading: authLoading } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (adminUser && !authLoading) {
      console.log('AdminLogin - Already logged in, redirecting to admin dashboard');
      navigate('/admin', { replace: true });
    }
  }, [adminUser, authLoading, navigate]);

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
            navigate('/admin', { replace: true });
          }
        } else {
          console.log('AdminLogin - Login failed');
          toast({
            title: 'Login Failed',
            description: 'Invalid username or password. Please try again.',
            variant: 'destructive',
          });
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
    } else {
      // Second step: verify OTP
      if (!otpCode || otpCode.length !== 6) {
        toast({
          title: 'Error',
          description: 'Please enter a valid 6-digit code',
          variant: 'destructive',
        });
        return;
      }

      setIsLoading(true);

      try {
        const success = await verifyOtp(otpCode);
        
        if (success) {
          console.log('AdminLogin - OTP verified, login successful');
          toast({
            title: 'Login Successful',
            description: 'Welcome to the admin dashboard!',
          });
          navigate('/admin', { replace: true });
        } else {
          toast({
            title: 'Invalid Code',
            description: 'The authentication code is incorrect. Please try again.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('AdminLogin - OTP verification error:', error);
        toast({
          title: 'Error',
          description: 'An error occurred during verification. Please try again.',
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
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="otp">Authentication Code</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  disabled={isLoading}
                  maxLength={6}
                  required
                  className="text-center text-2xl tracking-widest"
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
    </div>
  );
};

export default AdminLogin;
