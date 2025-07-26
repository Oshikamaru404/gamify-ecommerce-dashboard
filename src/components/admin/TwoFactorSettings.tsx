
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, AlertTriangle, Key, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TwoFactorSetup from './TwoFactorSetup';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { getAdminUser2FA, disable2FA } from '@/lib/twoFactorAuth';
import { supabase } from '@/integrations/supabase/client';

const TwoFactorSettings: React.FC = () => {
  const [showSetup, setShowSetup] = useState(false);
  const [adminUser2FA, setAdminUser2FA] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabling, setIsDisabling] = useState(false);
  const { adminUser } = useAdminAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (adminUser) {
      loadTwoFactorStatus();
    }
  }, [adminUser]);

  const loadTwoFactorStatus = async () => {
    if (!adminUser) return;
    
    setIsLoading(true);
    try {
      const user2FA = await getAdminUser2FA(adminUser.username);
      setAdminUser2FA(user2FA);
    } catch (error) {
      console.error('Error loading 2FA status:', error);
      toast({
        title: 'Error',
        description: 'Failed to load two-factor authentication status',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupComplete = () => {
    setShowSetup(false);
    loadTwoFactorStatus();
    toast({
      title: 'Setup Complete',
      description: 'Two-factor authentication has been enabled successfully!',
    });
  };

  const handleDisable2FA = async () => {
    if (!adminUser) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to disable two-factor authentication? This will make your account less secure.'
    );
    
    if (!confirmed) return;

    setIsDisabling(true);
    try {
      const success = await disable2FA(adminUser.username);
      
      if (success) {
        setAdminUser2FA(null);
        toast({
          title: 'Disabled',
          description: 'Two-factor authentication has been disabled',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to disable two-factor authentication',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while disabling two-factor authentication',
        variant: 'destructive',
      });
    } finally {
      setIsDisabling(false);
    }
  };

  const regenerateBackupCodes = async () => {
    if (!adminUser) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to regenerate backup codes? This will invalidate all existing backup codes.'
    );
    
    if (!confirmed) return;

    try {
      // Generate new backup codes
      const newCodes = [];
      for (let i = 0; i < 10; i++) {
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        newCodes.push(code);
      }

      const { error } = await supabase
        .from('admin_users')
        .update({
          backup_codes: newCodes,
          created_backup_codes_at: new Date().toISOString(),
        })
        .eq('username', adminUser.username);

      if (error) {
        throw error;
      }

      // Download the new codes
      const content = newCodes.join('\n');
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'new-backup-codes.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      await loadTwoFactorStatus();
      
      toast({
        title: 'Backup Codes Regenerated',
        description: 'New backup codes have been generated and downloaded',
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
    if (!adminUser2FA?.backup_codes) return;
    
    const content = adminUser2FA.backup_codes.join('\n');
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showSetup && adminUser) {
    return (
      <div className="flex justify-center">
        <TwoFactorSetup
          adminUser={adminUser}
          onSetupComplete={handleSetupComplete}
          onCancel={() => setShowSetup(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {adminUser2FA?.two_factor_enabled ? (
                <ShieldCheck className="h-6 w-6 text-green-600" />
              ) : (
                <Shield className="h-6 w-6 text-gray-400" />
              )}
              <div>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Add an extra layer of security to your admin account
                </p>
              </div>
            </div>
            <Badge 
              variant={adminUser2FA?.two_factor_enabled ? "default" : "secondary"}
              className={adminUser2FA?.two_factor_enabled ? "bg-green-100 text-green-800" : ""}
            >
              {adminUser2FA?.two_factor_enabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {adminUser2FA?.two_factor_enabled ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <ShieldCheck className="h-4 w-4" />
                <span>Two-factor authentication is active</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleDisable2FA}
                  variant="outline"
                  disabled={isDisabling}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  {isDisabling ? 'Disabling...' : 'Disable 2FA'}
                </Button>
                <Button
                  onClick={regenerateBackupCodes}
                  variant="outline"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Regenerate Backup Codes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start space-x-2 text-sm text-amber-600">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Your account is not protected by two-factor authentication</p>
                  <p className="text-amber-600/80 mt-1">
                    Enable 2FA to add an extra layer of security to your admin account
                  </p>
                </div>
              </div>
              
              <Button onClick={() => setShowSetup(true)} className="bg-blue-600 hover:bg-blue-700">
                <Shield className="h-4 w-4 mr-2" />
                Enable Two-Factor Authentication
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {adminUser2FA?.two_factor_enabled && adminUser2FA?.backup_codes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Backup Codes</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              You have {adminUser2FA.backup_codes.length} backup codes remaining
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-2 text-sm text-blue-600">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Keep your backup codes safe. You can use them to access your account if you lose your authenticator device.</p>
                </div>
              </div>
              
              <Button
                onClick={downloadBackupCodes}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Backup Codes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TwoFactorSettings;
