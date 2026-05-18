import React, { useState, useEffect } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import SocialAuthButtons from './SocialAuthButtons';
import { CheckCircle2, Mail, Loader2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthedPayload {
  display_name: string | null;
  email: string | null;
  phone?: string | null;
}

interface Props {
  onAuthed?: (profile: AuthedPayload | null) => void;
}

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export const QuickCheckoutAuth: React.FC<Props> = ({ onAuthed }) => {
  const { user, profile } = useUserAuth();
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    if (name.length < 2) { toast.error('Please enter your full name'); return; }
    if (!isValidEmail(email)) { toast.error('Please enter a valid email'); return; }
    if (phone.replace(/\D/g, '').length < 7) { toast.error('Please enter a valid phone'); return; }

    setSubmitting(true);
    // Fire-and-forget passwordless: creates account if not exists, sends magic link.
    // Checkout proceeds immediately with the collected data.
    try {
      await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin,
          data: { full_name: name, phone },
        },
      });
      toast.success('Magic link sent', {
        description: 'Check your inbox to access your account later. You can continue checkout now.',
      });
    } catch (err) {
      // Non-blocking — we still want checkout to proceed.
      console.warn('signInWithOtp failed:', err);
    }
    onAuthed?.({ display_name: name, email, phone });
    setSubmitting(false);
  };

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <div className="text-center">
        <p className="text-sm font-semibold">Quick login or sign up</p>
        <p className="text-[11px] text-muted-foreground">
          {expanded ? 'We’ll find your account or create one automatically.' : 'Tap a provider — or continue with email.'}
        </p>
      </div>

      <div className="grid grid-cols-6 gap-2">
        <div className="col-span-5">
          <SocialAuthButtons compact />
        </div>
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          title="Continue with email"
          aria-label="Continue with email"
          aria-expanded={expanded}
          className={`h-11 rounded-md flex items-center justify-center transition-all hover:scale-[1.03] active:scale-95 border shadow-sm ${
            expanded
              ? 'bg-background text-primary border-primary'
              : 'bg-primary text-primary-foreground border-transparent'
          }`}
        >
          <Mail className="h-5 w-5" />
        </button>
      </div>

      {expanded && (
        <form
          onSubmit={handleSubmit}
          className="space-y-2.5 pt-2 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="space-y-1.5">
            <Label htmlFor="qa-name" className="text-xs">Full name *</Label>
            <Input
              id="qa-name"
              value={form.name}
              onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="John Doe"
              autoComplete="name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="qa-email" className="text-xs">Email *</Label>
            <Input
              id="qa-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="john@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="qa-phone" className="text-xs">WhatsApp / Phone *</Label>
            <Input
              id="qa-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
              placeholder="+1234567890"
              autoComplete="tel"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="h-4 w-4" /></>}
          </button>
          <p className="text-[10px] text-muted-foreground text-center">
            By continuing you agree to receive a login link by email.
          </p>
        </form>
      )}
    </div>
  );
};

export default QuickCheckoutAuth;
