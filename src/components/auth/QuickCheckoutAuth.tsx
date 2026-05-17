import React, { useState, useEffect } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import SocialAuthButtons from './SocialAuthButtons';
import { CheckCircle2, Mail } from 'lucide-react';
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
      <div className="text-center">
        <p className="text-sm font-semibold">Quick login</p>
        <p className="text-[11px] text-muted-foreground">Tap a provider — or use email.</p>
      </div>
      <div className="grid grid-cols-6 gap-2">
        <div className="col-span-5">
          <SocialAuthButtons compact />
        </div>
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          title="Continue with email"
          aria-label="Continue with email"
          className="h-11 rounded-md flex items-center justify-center transition-all hover:scale-[1.03] active:scale-95 bg-primary text-primary-foreground border border-transparent shadow-sm"
        >
          <Mail className="h-5 w-5" />
        </button>
      </div>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="login" />
    </div>
  );
};

export default QuickCheckoutAuth;
