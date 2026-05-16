import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type Provider = 'google' | 'facebook' | 'apple' | 'discord' | 'twitter';

const PROVIDERS: { id: Provider; label: string; icon: string; bg: string }[] = [
  { id: 'google',   label: 'Google',   icon: 'G',  bg: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300' },
  { id: 'facebook', label: 'Facebook', icon: 'f',  bg: 'bg-[#1877F2] hover:bg-[#166FE5] text-white' },
  { id: 'apple',    label: 'Apple',    icon: '',  bg: 'bg-black hover:bg-gray-900 text-white' },
  { id: 'discord',  label: 'Discord',  icon: 'D',  bg: 'bg-[#5865F2] hover:bg-[#4752C4] text-white' },
  { id: 'twitter',  label: 'X',        icon: '𝕏',  bg: 'bg-black hover:bg-gray-900 text-white' },
];

interface Props {
  compact?: boolean;
  onStart?: () => void;
}

export const SocialAuthButtons: React.FC<Props> = ({ compact = false, onStart }) => {
  const [loading, setLoading] = React.useState<Provider | null>(null);

  const handleClick = async (provider: Provider) => {
    setLoading(provider);
    onStart?.();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      toast.error(`${provider}: ${error.message}`);
      setLoading(null);
    }
  };

  if (compact) {
    return (
      <div className="grid grid-cols-5 gap-2">
        {PROVIDERS.map(p => (
          <Button
            key={p.id}
            type="button"
            variant="outline"
            onClick={() => handleClick(p.id)}
            disabled={loading !== null}
            className={`h-11 font-bold text-lg ${p.bg}`}
            title={`Continue with ${p.label}`}
          >
            {loading === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : p.icon}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {PROVIDERS.map(p => (
        <Button
          key={p.id}
          type="button"
          onClick={() => handleClick(p.id)}
          disabled={loading !== null}
          className={`w-full h-11 justify-center gap-2 ${p.bg}`}
        >
          {loading === p.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="font-bold text-lg w-5 text-center">{p.icon}</span>
          )}
          <span>Continue with {p.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default SocialAuthButtons;
