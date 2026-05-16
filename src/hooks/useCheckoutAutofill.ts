import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserAuth } from '@/contexts/UserAuthContext';

export interface SavedProfile {
  id: string;
  label: string;
  kind: 'iptv_m3u' | 'iptv_mag' | 'iptv_panel' | 'player_panel' | 'unknown';
  iptv_username?: string | null;
  mac_address?: string | null;
  connection_type?: 'm3u_xtream' | 'mag_stb' | null;
  account_email?: string | null;
  package_name?: string | null;
  created_at?: string;
}

interface AutofillData {
  loading: boolean;
  displayName: string | null;
  email: string | null;
  phone: string | null;
  savedProfiles: SavedProfile[];
}

const MAX_PROFILES = 5;

/**
 * Loads the user profile + last N orders to extract previously used
 * MAC addresses / usernames / connection types so the checkout can offer
 * one-click autofill of past credentials.
 */
export function useCheckoutAutofill(currentCategory?: string): AutofillData {
  const { user, profile, loading: authLoading } = useUserAuth();
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setSavedProfiles([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadingOrders(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, package_name, package_category, credentials_notes, created_at, xtream_username')
          .eq('customer_email', user.email!)
          .order('created_at', { ascending: false })
          .limit(20);
        if (error) throw error;
        if (cancelled) return;

        const seen = new Set<string>();
        const profiles: SavedProfile[] = [];

        for (const row of data ?? []) {
          let notes: any = null;
          try { notes = row.credentials_notes ? JSON.parse(row.credentials_notes as string) : null; } catch { /* ignore */ }
          const offerKind: string | undefined = notes?.offer_kind;
          const conn: string | undefined = notes?.connection_type;
          const mac: string | undefined = notes?.mac_address;
          const username: string | undefined = notes?.iptv_username || row.xtream_username || undefined;

          let kind: SavedProfile['kind'] = 'unknown';
          if (offerKind === 'iptv_subscription' && conn === 'mag_stb') kind = 'iptv_mag';
          else if (offerKind === 'iptv_subscription' && conn === 'm3u_xtream') kind = 'iptv_m3u';
          else if (offerKind === 'iptv_panel') kind = 'iptv_panel';
          else if (offerKind === 'player_panel') kind = 'player_panel';
          else if (mac) kind = 'iptv_mag';
          else if (username) kind = 'iptv_m3u';

          const dedupKey = `${kind}|${mac || ''}|${username || ''}`;
          if (seen.has(dedupKey) || dedupKey === 'unknown||') continue;
          if (!mac && !username) continue;
          seen.add(dedupKey);

          const label =
            mac ? `MAC ${mac}` :
            username ? `${username}` :
            row.package_name as string;

          profiles.push({
            id: row.id as string,
            label,
            kind,
            iptv_username: username || null,
            mac_address: mac || null,
            connection_type: conn === 'm3u_xtream' || conn === 'mag_stb' ? conn : null,
            account_email: notes?.renewal?.email || null,
            package_name: row.package_name as string,
            created_at: row.created_at as string,
          });
          if (profiles.length >= MAX_PROFILES) break;
        }
        setSavedProfiles(profiles);
      } catch (e) {
        console.error('autofill load error', e);
      } finally {
        if (!cancelled) setLoadingOrders(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.email]);

  return {
    loading: authLoading || loadingOrders,
    displayName: profile?.display_name ?? null,
    email: profile?.email ?? user?.email ?? null,
    phone: profile?.phone ?? null,
    savedProfiles,
  };
}
