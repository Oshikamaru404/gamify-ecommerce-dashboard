import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tag, Loader2, X, Check } from 'lucide-react';
import { useCoupon, type AppliedCoupon } from '@/hooks/useCoupon';

interface Props {
  amount: number;
  productType?: string;
  productId?: string;
  applied: AppliedCoupon | null;
  onApply: (c: AppliedCoupon | null) => void;
}

const CouponField: React.FC<Props> = ({ amount, productType, productId, applied, onApply }) => {
  const [code, setCode] = useState('');
  const { loading, error, apply, clear } = useCoupon();

  const submit = async () => {
    if (!code.trim()) return;
    const c = await apply(code.trim(), amount, productType, productId);
    if (c) onApply(c);
  };

  const remove = () => { clear(); setCode(''); onApply(null); };

  if (applied) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">Coupon {applied.code} applied</p>
            <p className="text-[11px] text-emerald-700">You saved ${applied.discount_amount.toFixed(2)}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={remove} className="h-8 px-2 text-emerald-700 hover:text-emerald-800">
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Promo code"
            className="pl-8 uppercase"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }}
          />
        </div>
        <Button type="button" onClick={submit} disabled={loading || !code.trim()} variant="outline" className="h-10">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
        </Button>
      </div>
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
};

export default CouponField;
