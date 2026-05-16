import React from 'react';
import { Wifi, Tv, Server, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SavedProfile } from '@/hooks/useCheckoutAutofill';

interface Props {
  profiles: SavedProfile[];
  selectedId: string | null;
  onSelect: (profile: SavedProfile | null) => void;
}

const KIND_META: Record<SavedProfile['kind'], { icon: React.ElementType; label: string; tint: string }> = {
  iptv_m3u:    { icon: Wifi,   label: 'M3U / Xtream',    tint: 'text-blue-600 bg-blue-50 border-blue-200' },
  iptv_mag:    { icon: Tv,     label: 'MAG / STB',       tint: 'text-purple-600 bg-purple-50 border-purple-200' },
  iptv_panel:  { icon: Server, label: 'Reseller Panel',  tint: 'text-amber-600 bg-amber-50 border-amber-200' },
  player_panel:{ icon: Server, label: 'Player Panel',    tint: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  unknown:     { icon: Sparkles, label: 'Saved',         tint: 'text-muted-foreground bg-muted border-border' },
};

export const SavedProfilesPicker: React.FC<Props> = ({ profiles, selectedId, onSelect }) => {
  if (!profiles.length) return null;
  return (
    <div className="space-y-2 p-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/[0.03] animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
        <Sparkles className="h-3.5 w-3.5" /> Smart Autofill — use a saved profile
      </div>
      <div className="grid gap-1.5">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            'flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left text-xs transition-all',
            !selectedId ? 'border-primary bg-primary/10 font-semibold' : 'border-border hover:border-primary/40 bg-card',
          )}
        >
          <span className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" /> Enter new credentials</span>
          {!selectedId && <span className="text-[10px] text-primary">Selected</span>}
        </button>
        {profiles.map((p) => {
          const meta = KIND_META[p.kind];
          const Icon = meta.icon;
          const selected = selectedId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p)}
              className={cn(
                'group flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-xs transition-all',
                selected
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border hover:border-primary/40 hover:bg-card bg-card/60',
              )}
            >
              <span className={cn('h-7 w-7 rounded-md border flex items-center justify-center shrink-0', meta.tint)}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-mono font-semibold truncate">{p.label}</span>
                <span className="block text-[10px] text-muted-foreground truncate">{meta.label} · {p.package_name}</span>
              </span>
              <ChevronRight className={cn('h-3.5 w-3.5 shrink-0 transition-transform', selected ? 'text-primary translate-x-0.5' : 'text-muted-foreground/40')} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SavedProfilesPicker;
