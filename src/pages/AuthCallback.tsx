import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase auto-handles the hash; just wait briefly then redirect
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate('/account', { replace: true });
      else navigate('/', { replace: true });
    }, 600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Signing you in…</p>
    </div>
  );
};

export default AuthCallback;
