import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ProfileSettings: React.FC = () => {
  const { user, profile, refreshProfile } = useUserAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [language, setLanguage] = useState((profile as any)?.preferred_language || 'en');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setPhone(profile.phone || '');
      setLanguage((profile as any)?.preferred_language || 'en');
    }
  }, [profile]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      display_name: displayName,
      phone,
      preferred_language: language,
    } as any).eq('id', user.id);
    setSaving(false);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Profile updated' }); refreshProfile(); }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) { toast({ title: 'File too large', description: 'Max 2MB', variant: 'destructive' }); return; }
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (upErr) { toast({ title: 'Upload error', description: upErr.message, variant: 'destructive' }); setUploading(false); return; }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const url = `${data.publicUrl}?t=${Date.now()}`;
    await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id);
    await refreshProfile();
    setUploading(false);
    toast({ title: 'Avatar updated' });
  };

  const initial = (profile?.display_name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm">Update your personal information.</p>
      </div>

      <Card className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
            <AvatarFallback className="text-2xl">{initial}</AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="avatar" className="cursor-pointer">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-background hover:bg-muted text-sm">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload avatar
              </div>
              <input id="avatar" type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
            </Label>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Display name</Label>
            <Input value={displayName} onChange={e => setDisplayName(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <div className="flex gap-2 items-center">
              <Input value={user?.email || ''} disabled />
              <Badge variant="secondary">{(profile as any)?.provider || 'email'}</Badge>
            </div>
          </div>
          <div>
            <Label>WhatsApp / Phone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1234567890" />
          </div>
          <div>
            <Label>Preferred language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Save changes
        </Button>
      </Card>
    </div>
  );
};

export default ProfileSettings;
