import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Fetches icon_url for given package ids from both iptv_packages and subscription_packages.
export function usePackageIcons(packageIds: (string | null | undefined)[]) {
  const [icons, setIcons] = useState<Record<string, string>>({});
  const key = Array.from(new Set(packageIds.filter(Boolean) as string[])).sort().join(',');

  useEffect(() => {
    const ids = key ? key.split(',') : [];
    if (ids.length === 0) { setIcons({}); return; }
    let cancelled = false;
    (async () => {
      const [iptv, subs] = await Promise.all([
        supabase.from('iptv_packages').select('id, icon_url, icon').in('id', ids),
        supabase.from('subscription_packages').select('id, icon_url, icon').in('id', ids),
      ]);
      if (cancelled) return;
      const map: Record<string, string> = {};
      [...(iptv.data || []), ...(subs.data || [])].forEach((p: any) => {
        const url = p.icon_url || p.icon;
        if (url) map[p.id] = url;
      });
      setIcons(map);
    })();
    return () => { cancelled = true; };
  }, [key]);

  return icons;
}
