import React, { useState, useEffect } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import SocialAuthButtons from './SocialAuthButtons';
import { Button } from '@/components/ui/button';
import { CheckCircle2, LogIn } from 'lucide-react';
import AuthDialog from './AuthDialog';

interface Props {
  onAuthed?: (profile: { display_name: string | null; email: string | null } | null) => void;
}

export const QuickCheckoutAuth: React.FC<Props> = ({ onAuthed }) => {
  const { user, profile } = useUserAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (user && !notified) {
      onAuthed?.({
        display_name: profile?.display_name ?? null,
        email: profile?.email ?? user.email ?? null,
      });
      setNotified(true);
    }
  }, [user, profile, notified, onAuthed]);

  if (user) {
    return (
      <div className="rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-3 flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">Signed in as {profile?.display_name || user.email}</p>
          <p className="text-xs text-muted-foreground">Your info will be pre-filled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Quick checkout</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => setAuthOpen(true)}>
          <LogIn className="h-3.5 w-3.5 mr-1" /> Email
        </Button>
      </div>
      <SocialAuthButtons compact />
      <p className="text-[11px] text-muted-foreground text-center">Optional — speeds up future orders.</p>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="login" />
    </div>
  );
};

export default QuickCheckoutAuth;
