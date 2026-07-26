import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Loader2, TrendingUp, Sparkles, Package, Tv, Users, Zap, Play } from 'lucide-react';
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

const CATEGORY_META: Record<CategoryKey, { label: string; icon: React.ComponentType<any>; color: string; group: string }> = {
  'subscription':       { label: 'IPTV Subscription', icon: Tv,      color: 'bg-red-50 text-red-700 border-red-200',           group: 'IPTV' },
  'subscription-pkg':   { label: 'Subscription',      icon: Tv,      color: 'bg-red-50 text-red-700 border-red-200',           group: 'IPTV' },
  'panel-iptv':         { label: 'IPTV Panel',        icon: Users,   color: 'bg-blue-50 text-blue-700 border-blue-200',        group: 'Panels' },
  'player':             { label: 'Player Panel',      icon: Play,    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',  group: 'Panels' },
  'activation-player':  { label: 'Player Activation', icon: Zap,     color: 'bg-amber-50 text-amber-700 border-amber-200',     group: 'Activation' },
  'reseller':           { label: 'Reseller',          icon: Package, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', group: 'Reseller' },
};

const GROUP_ORDER = ['IPTV', 'Panels', 'Activation', 'Reseller'];

const buildHref = (cat: CategoryKey, name: string): string => {
  switch (cat) {
    case 'panel-iptv':        return `/iptv-panel/${generateProductSlug(name)}`;
    case 'player':            return `/player-panel/${generateProductSlug(name)}`;
    case 'subscription':      return `/subscription`;
    case 'activation-player': return `/activation`;
    case 'reseller':          return `/reseller`;
    case 'subscription-pkg':  return `/subscription`;
  }
};

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

type Hit = {
  key: string;            // unique per (product + category)
  productKey: string;     // shared across categories of same product
  displayName: string;
  iconUrl?: string | null;
  featured: boolean;
  minPrice?: number | null;
  cat: CategoryKey;
  href: string;
  siblingCats: CategoryKey[]; // other categories where same product exists
  score: number;
};

// Priority ordering: subscription first (most requested), then panels, then activations
const CAT_PRIORITY: Record<CategoryKey, number> = {
  'subscription': 0,
  'subscription-pkg': 0,
  'panel-iptv': 2,
  'player': 3,
  'activation-player': 4,
  'reseller': 5,
};

const GlobalSearch: React.FC<{ className?: string; compact?: boolean }> = ({ className, compact }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const allRows = useMemo(() => {
    type Row = { name: string; iconUrl?: string | null; cat: CategoryKey; featured: boolean; sort: number; price: number | null };
    const rows: Row[] = [];

    const minPriceIPTV = (p: any): number | null => {
      const opts = [p.price_1_month, p.price_3_months, p.price_6_months, p.price_12_months,
                    p.price_10_credits, p.price_25_credits, p.price_50_credits, p.price_100_credits]
        .filter((v) => typeof v === 'number' && v > 0) as number[];
      return opts.length ? Math.min(...opts) : null;
    };
    const minPriceSub = (p: any): number | null => {
      const opts = [p.price_3_credits, p.price_6_credits, p.price_12_credits]
        .filter((v) => typeof v === 'number' && v > 0) as number[];
      return opts.length ? Math.min(...opts) : null;
    };

    (iptvPkgs || []).forEach((p: any) => {
      if (p.status !== 'active' && p.status !== 'featured') return;
      const cat = p.category as CategoryKey;
      if (!CATEGORY_META[cat]) return;
      rows.push({
        name: p.name, iconUrl: p.icon_url || p.icon, cat,
        featured: p.status === 'featured',
        sort: p.sort_order ?? 999,
        price: minPriceIPTV(p),
      });
    });
    (subPkgs || []).forEach((p: any) => {
      if (p.status !== 'active' && p.status !== 'featured') return;
      rows.push({
        name: p.name, iconUrl: p.icon_url || p.icon, cat: 'subscription-pkg',
        featured: p.status === 'featured',
        sort: p.sort_order ?? 999,
        price: minPriceSub(p),
      });
    });

    return rows;
  }, [iptvPkgs, subPkgs]);

  const scoreMatch = (haystack: string, q: string): number => {
    if (!q) return 0;
    if (haystack === q) return 100;
    if (haystack.startsWith(q)) return 80;
    const words = haystack.split(' ');
    if (words.some((w) => w.startsWith(q))) return 60;
    if (haystack.includes(q)) return 40;
    return 0;
  };

  const hits: Hit[] = useMemo(() => {
    const q = normalize(query);

    // First pass: aggregate per product
    type Agg = {
      productKey: string;
      displayName: string;
      iconUrl?: string | null;
      featured: boolean;
      minPrice: number | null;
      score: number;
      perCat: Map<CategoryKey, { price: number | null; featured: boolean }>;
    };
    const agg = new Map<string, Agg>();

    allRows.forEach((r) => {
      const englishName = getLocalizedText(r.name, 'en', 'en').trim();
      const key = normalize(englishName);
      const display = getLocalizedText(r.name, language, 'en').trim() || englishName;

      let score = 0;
      if (q.length >= 1) {
        const allNames = Object.values(parseMultilingualText(r.name)).map((v) => normalize(String(v)));
        score = Math.max(...allNames.map((n) => scoreMatch(n, q)), 0);
        if (score === 0) return;
      }
      if (r.featured) score += 15;
      score += Math.max(0, 20 - (r.sort ?? 999));

      if (!agg.has(key)) {
        agg.set(key, {
          productKey: key,
          displayName: display,
          iconUrl: r.iconUrl,
          featured: r.featured,
          minPrice: r.price,
          score,
          perCat: new Map([[r.cat, { price: r.price, featured: r.featured }]]),
        });
      } else {
        const g = agg.get(key)!;
        if (!g.iconUrl && r.iconUrl) g.iconUrl = r.iconUrl;
        if (r.featured) g.featured = true;
        if (r.price != null && (g.minPrice == null || r.price < g.minPrice)) g.minPrice = r.price;
        g.score = Math.max(g.score, score);
        const existing = g.perCat.get(r.cat);
        if (!existing || (r.price != null && (existing.price == null || r.price < existing.price))) {
          g.perCat.set(r.cat, { price: r.price, featured: r.featured });
        }
      }
    });

    // Second pass: expand into one Hit per (product, category)
    const out: Hit[] = [];
    agg.forEach((g) => {
      const cats = Array.from(g.perCat.keys());
      cats.forEach((cat) => {
        const info = g.perCat.get(cat)!;
        out.push({
          key: `${g.productKey}::${cat}`,
          productKey: g.productKey,
          displayName: g.displayName,
          iconUrl: g.iconUrl,
          featured: info.featured || g.featured,
          minPrice: info.price ?? g.minPrice,
          cat,
          href: buildHref(cat, g.displayName),
          siblingCats: cats.filter((c) => c !== cat),
          score: g.score + (100 - (CAT_PRIORITY[cat] ?? 9)),
        });
      });
    });

    out.sort((a, b) => b.score - a.score);
    return out.slice(0, q ? 18 : 8);
  }, [query, allRows, language]);

  // Reset active index whenever hits change
  useEffect(() => { setActiveIndex(0); }, [query, open]);

  // Group hits by category group
  const grouped = useMemo(() => {
    const byGroup = new Map<string, Hit[]>();
    hits.forEach((h) => {
      const grp = CATEGORY_META[h.cat].group;
      if (!byGroup.has(grp)) byGroup.set(grp, []);
      byGroup.get(grp)!.push(h);
    });
    return GROUP_ORDER
      .filter((g) => byGroup.has(g))
      .map((g) => ({ group: g, items: byGroup.get(g)! }));
  }, [hits]);

  const flatItems: { hit: Hit; href: string }[] = useMemo(
    () => hits.map((h) => ({ hit: h, href: h.href })),
    [hits],
  );


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || flatItems.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flatItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flatItems.length) % flatItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = flatItems[activeIndex];
      if (item) {
        navigate(item.href);
        setOpen(false);
        setQuery('');
        inputRef.current?.blur();
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const renderHit = (h: Hit, index: number) => {
    const isActive = flatItems[activeIndex]?.hit.key === h.key;
    const meta = CATEGORY_META[h.cat];
    const Icon = meta.icon;
    return (
      <li key={h.key}>
        <Link
          to={h.href}
          onClick={() => { setOpen(false); setQuery(''); }}
          onMouseEnter={() => setActiveIndex(index)}
          className={cn(
            'group flex items-center gap-3 px-3 py-2.5 transition-all rounded-lg mx-1 border border-transparent',
            isActive ? 'bg-red-50 border-red-100' : 'hover:bg-gray-50 hover:border-gray-100',
          )}
        >
          {h.iconUrl ? (
            <img
              src={h.iconUrl}
              alt=""
              className="h-11 w-11 rounded-lg object-cover border border-gray-100 shrink-0"
              loading="lazy"
            />
          ) : (
            <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 shrink-0 flex items-center justify-center">
              <Package size={16} className="text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm text-gray-900 truncate">{h.displayName}</span>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border',
                  meta.color,
                )}
              >
                <Icon size={10} /> {meta.label}
              </span>
              {h.featured && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200 shrink-0">
                  <Sparkles size={10} /> Popular
                </span>
              )}
            </div>
            {h.siblingCats.length > 0 && (
              <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500">
                <span>Also available as:</span>
                {h.siblingCats.slice(0, 2).map((sc) => {
                  const sm = CATEGORY_META[sc];
                  return (
                    <span key={sc} className="inline-flex items-center gap-0.5 text-gray-600 font-medium">
                      <sm.icon size={9} /> {sm.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          {h.minPrice != null && (
            <div className="text-right shrink-0">
              <div className="text-[10px] text-gray-500 leading-none">from</div>
              <div className="text-sm font-bold text-red-600">${h.minPrice}</div>
            </div>
          )}
        </Link>
      </li>
    );
  };


  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <div className={cn(
        'flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 transition-all',
        'focus-within:border-red-500 focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-red-100',
        compact ? 'w-full' : 'w-64 lg:w-80',
      )}>
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search IPTV, panels, activations…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 max-h-[75vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
              <Loader2 size={16} className="animate-spin" /> Loading products…
            </div>
          ) : hits.length === 0 && query.length >= 1 ? (
            <div className="py-10 text-center">
              <Search size={24} className="mx-auto text-gray-300 mb-2" />
              <div className="text-sm font-medium text-gray-700">No results for "{query}"</div>
              <div className="text-xs text-gray-500 mt-1">Try a different keyword or browse categories.</div>
            </div>
          ) : hits.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">Start typing to search…</div>
          ) : (
            <div className="py-2">
              {query.length === 0 && (
                <div className="px-4 pt-1 pb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  <TrendingUp size={12} /> Trending now
                </div>
              )}
              {query.length === 0 ? (
                <ul>{hits.map((h, i) => renderHit(h, i))}</ul>
              ) : (
                <>
                  {grouped.map(({ group, items }) => (
                    <div key={group} className="mb-1">
                      <div className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        {group}
                      </div>
                      <ul>
                        {items.map((h) => renderHit(h, hits.indexOf(h)))}
                      </ul>
                    </div>
                  ))}
                </>
              )}
              <div className="mt-1 border-t px-4 py-2 flex items-center justify-between text-[10px] text-gray-400">
                <span>↑↓ navigate · ↵ open · esc close</span>
                <span>{hits.length} result{hits.length > 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
