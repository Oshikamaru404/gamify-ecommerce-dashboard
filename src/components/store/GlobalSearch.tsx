import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { useIPTVPackages } from '@/hooks/useIPTVPackages';
import { useSubscriptionPackages } from '@/hooks/useSubscriptionPackages';
import { getLocalizedText, generateProductSlug, parseMultilingualText } from '@/lib/multilingualUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

type CategoryKey =
  | 'subscription'
  | 'panel-iptv'
  | 'player'
  | 'activation-player'
  | 'reseller'
  | 'subscription-pkg';

const CATEGORY_LABEL: Record<CategoryKey, string> = {
  'subscription': 'Subscription IPTV',
  'panel-iptv': 'IPTV Panel',
  'player': 'Player Panel',
  'activation-player': 'Player Activation',
  'reseller': 'Reseller',
  'subscription-pkg': 'Subscription',
};

const buildHref = (cat: CategoryKey, name: string): string => {
  switch (cat) {
    case 'panel-iptv':
      return `/iptv-panel/${generateProductSlug(name)}`;
    case 'player':
      return `/player-panel/${generateProductSlug(name)}`;
    case 'subscription':
      return `/subscription`;
    case 'activation-player':
      return `/activation`;
    case 'reseller':
      return `/reseller`;
    case 'subscription-pkg':
      return `/subscription`;
  }
};

const normalize = (s: string) =>
  s.toLowerCase().replace(/\s+/g, ' ').trim();

type Hit = {
  key: string;
  displayName: string;
  iconUrl?: string | null;
  categories: { cat: CategoryKey; href: string }[];
};

const GlobalSearch: React.FC<{ className?: string; compact?: boolean }> = ({ className, compact }) => {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: iptvPkgs, isLoading: l1 } = useIPTVPackages();
  const { data: subPkgs, isLoading: l2 } = useSubscriptionPackages();
  const isLoading = l1 || l2;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const hits: Hit[] = useMemo(() => {
    const q = normalize(query);
    if (q.length < 2) return [];

    type Row = { name: string; iconUrl?: string | null; cat: CategoryKey };
    const rows: Row[] = [];

    (iptvPkgs || []).forEach((p: any) => {
      if (p.status !== 'active' && p.status !== 'featured') return;
      const cat = p.category as CategoryKey;
      if (!CATEGORY_LABEL[cat]) return;
      rows.push({ name: p.name, iconUrl: p.icon_url || p.icon, cat });
    });
    (subPkgs || []).forEach((p: any) => {
      if (p.status !== 'active' && p.status !== 'featured') return;
      rows.push({ name: p.name, iconUrl: p.icon_url || p.icon, cat: 'subscription-pkg' });
    });

    // Filter rows whose any translation contains query
    const matched = rows.filter((r) => {
      const all = Object.values(parseMultilingualText(r.name));
      return all.some((v) => normalize(String(v)).includes(q));
    });

    // Group by normalized english name
    const groups = new Map<string, Hit>();
    matched.forEach((r) => {
      const englishName = getLocalizedText(r.name, 'en', 'en').trim();
      const key = normalize(englishName);
      const display = getLocalizedText(r.name, language, 'en').trim() || englishName;
      const href = buildHref(r.cat, r.name);
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          displayName: display,
          iconUrl: r.iconUrl,
          categories: [{ cat: r.cat, href }],
        });
      } else {
        const g = groups.get(key)!;
        if (!g.iconUrl && r.iconUrl) g.iconUrl = r.iconUrl;
        if (!g.categories.some((c) => c.cat === r.cat)) {
          g.categories.push({ cat: r.cat, href });
        }
      }
    });

    return Array.from(groups.values()).slice(0, 8);
  }, [query, iptvPkgs, subPkgs, language]);

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <div className={cn(
        'flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 transition-all',
        'focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm',
        compact ? 'w-full' : 'w-64 lg:w-80'
      )}>
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search packages..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setOpen(false); }}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && query.length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl z-50">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-500">
              <Loader2 size={16} className="animate-spin" /> Loading...
            </div>
          ) : hits.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">No results for "{query}"</div>
          ) : (
            <ul className="py-2">
              {hits.map((h) => (
                <li key={h.key} className="px-3 py-2 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {h.iconUrl ? (
                      <img
                        src={h.iconUrl}
                        alt=""
                        className="h-9 w-9 rounded-md object-cover border border-gray-100 shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-md bg-gray-100 shrink-0" />
                    )}
                    <div className="font-semibold text-sm text-gray-900 truncate">{h.displayName}</div>
                  </div>
                  <div className="mt-2 ml-12 flex flex-wrap gap-1.5">
                    {h.categories.map((c) => (
                      <Link
                        key={c.cat}
                        to={c.href}
                        onClick={() => { setOpen(false); setQuery(''); }}
                        className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                      >
                        {CATEGORY_LABEL[c.cat]}
                        <span className="text-red-500/70">(1)</span>
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
