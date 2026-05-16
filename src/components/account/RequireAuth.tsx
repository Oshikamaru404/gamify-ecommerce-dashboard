import React, { useEffect, useState } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Loader2 } from 'lucide-react';
import AuthDialog from '@/components/auth/AuthDialog';
import { useNavigate } from 'react-router-dom';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useUserAuth();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) setAuthOpen(true);
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold">Sign in required</h1>
          <p className="text-muted-foreground">Please log in to access your account.</p>
        </div>
        <AuthDialog
          open={authOpen}
          onOpenChange={(o) => { setAuthOpen(o); if (!o) navigate('/'); }}
          defaultTab="login"
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
