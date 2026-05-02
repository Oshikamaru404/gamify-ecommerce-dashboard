import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertCircle, MailX } from 'lucide-react';

const SUPABASE_URL = 'https://jtsnspszgsmkqxuoqywm.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0c25zcHN6Z3Nta3F4dW9xeXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTg0NzUsImV4cCI6MjA2NTIzNDQ3NX0.k4gAV17UWzVPCnHeXnqCfdJT12bTkK5ELKBuLvYIm_Q';

type State = 'loading' | 'valid' | 'already' | 'invalid' | 'submitting' | 'done' | 'error';

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [state, setState] = useState<State>('loading');
  const [email, setEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) { setState('invalid'); return; }
    (async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
          headers: { apikey: SUPABASE_ANON },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) { setState('invalid'); setErrorMsg(data?.error || 'Invalid link'); return; }
        if (data?.alreadyUnsubscribed) { setState('already'); setEmail(data?.email || null); return; }
        setEmail(data?.email || null);
        setState('valid');
      } catch (e: any) {
        setState('invalid');
        setErrorMsg(e?.message || 'Network error');
      }
    })();
  }, [token]);

  const confirm = async () => {
    setState('submitting');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d?.error || 'Failed'); }
      setState('done');
    } catch (e: any) {
      setState('error');
      setErrorMsg(e?.message || 'Failed to unsubscribe');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        {state === 'loading' && (<><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /><p>Validating link…</p></>)}
        {state === 'valid' && (<>
          <MailX className="h-12 w-12 mx-auto text-primary" />
          <h1 className="text-2xl font-bold">Unsubscribe</h1>
          <p className="text-muted-foreground">{email ? `Stop sending emails to ${email}?` : 'Confirm you want to unsubscribe.'}</p>
          <Button onClick={confirm} className="w-full">Confirm Unsubscribe</Button>
        </>)}
        {state === 'submitting' && (<><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /><p>Processing…</p></>)}
        {state === 'done' && (<>
          <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
          <h1 className="text-2xl font-bold">Unsubscribed</h1>
          <p className="text-muted-foreground">{email || 'You'} won't receive further emails from us.</p>
        </>)}
        {state === 'already' && (<>
          <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
          <h1 className="text-2xl font-bold">Already unsubscribed</h1>
          <p className="text-muted-foreground">{email || 'This address'} is already unsubscribed.</p>
        </>)}
        {state === 'invalid' && (<>
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h1 className="text-2xl font-bold">Invalid link</h1>
          <p className="text-muted-foreground">{errorMsg || 'This unsubscribe link is invalid or expired.'}</p>
        </>)}
        {state === 'error' && (<>
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground">{errorMsg}</p>
          <Button onClick={confirm} variant="outline">Try again</Button>
        </>)}
      </Card>
    </div>
  );
}
