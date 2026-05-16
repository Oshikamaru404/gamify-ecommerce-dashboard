import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import SocialAuthButtons from './SocialAuthButtons';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultTab?: 'login' | 'signup';
}

export const AuthDialog: React.FC<Props> = ({ open, onOpenChange, defaultTab = 'login' }) => {
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Welcome back!');
    onOpenChange(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Account created! Check your email to confirm.');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tab === 'login' ? 'Welcome back' : 'Create your account'}</DialogTitle>
          <DialogDescription>
            {tab === 'login' ? 'Sign in to manage your subscriptions.' : 'Quick & secure — done in seconds.'}
          </DialogDescription>
        </DialogHeader>

        <SocialAuthButtons />

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-3 pt-3">
              <div>
                <Label htmlFor="li-email">Email</Label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="li-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div>
                <Label htmlFor="li-pwd">Password</Label>
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="li-pwd" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="pl-9" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-3 pt-3">
              <div>
                <Label htmlFor="su-name">Name</Label>
                <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="su-name" required value={name} onChange={e => setName(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div>
                <Label htmlFor="su-email">Email</Label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="su-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div>
                <Label htmlFor="su-pwd">Password (min 6)</Label>
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="su-pwd" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="pl-9" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
