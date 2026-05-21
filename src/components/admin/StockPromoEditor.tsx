import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Package, Tag } from 'lucide-react';
import type { QuantityPromoMode, QuantityPromoTier } from '@/lib/quantityPromo';

export interface StockPromoValue {
  stock_enabled: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  stock_by_plan: Record<string, number>;
  quantity_promo_mode: QuantityPromoMode;
  quantity_promos: QuantityPromoTier[];
}

const PLAN_DURATIONS: Array<{ key: string; label: string }> = [
  { key: '1', label: '1 month' },
  { key: '3', label: '3 months' },
  { key: '6', label: '6 months' },
  { key: '12', label: '12 months' },
];

interface Props {
  value: StockPromoValue;
  onChange: (next: StockPromoValue) => void;
}

const StockPromoEditor: React.FC<Props> = ({ value, onChange }) => {
  const update = (patch: Partial<StockPromoValue>) => onChange({ ...value, ...patch });

  const setTier = (idx: number, patch: Partial<QuantityPromoTier>) => {
    const next = value.quantity_promos.map((t, i) => (i === idx ? { ...t, ...patch } : t));
    update({ quantity_promos: next });
  };
  const addTier = () => {
    const lastQty = value.quantity_promos.length
      ? value.quantity_promos[value.quantity_promos.length - 1].qty + 1
      : 2;
    update({ quantity_promos: [...value.quantity_promos, { qty: lastQty, value: 0 }] });
  };
  const removeTier = (idx: number) => {
    update({ quantity_promos: value.quantity_promos.filter((_, i) => i !== idx) });
  };

  const valueLabel = value.quantity_promo_mode === 'percentage' ? '% Discount' : 'Fixed total ($)';
  const valueSuffix = value.quantity_promo_mode === 'percentage' ? '%' : '$';

  return (
    <div className="space-y-6">
      {/* Stock */}
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <h4 className="font-semibold text-sm">Stock management</h4>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="stock_enabled" className="text-xs cursor-pointer">Enabled</Label>
            <Switch
              id="stock_enabled"
              checked={value.stock_enabled}
              onCheckedChange={(checked) => update({ stock_enabled: checked })}
            />
          </div>
        </div>
        {value.stock_enabled && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="stock_quantity" className="text-xs">Stock quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                min={0}
                value={value.stock_quantity}
                onChange={(e) => update({ stock_quantity: Math.max(0, parseInt(e.target.value) || 0) })}
              />
            </div>
            <div>
              <Label htmlFor="low_stock_threshold" className="text-xs">Low-stock alert at</Label>
              <Input
                id="low_stock_threshold"
                type="number"
                min={0}
                value={value.low_stock_threshold}
                onChange={(e) => update({ low_stock_threshold: Math.max(0, parseInt(e.target.value) || 0) })}
              />
            </div>
            <p className="col-span-2 text-[11px] text-muted-foreground">
              Stock auto-decrements when an order's payment is marked as <b>paid</b>.
            </p>
          </div>
        )}
      </div>

      {/* Quantity promos */}
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <h4 className="font-semibold text-sm">Quantity-based promo tiers</h4>
          </div>
          <Select
            value={value.quantity_promo_mode}
            onValueChange={(v) => update({ quantity_promo_mode: v as QuantityPromoMode })}
          >
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage discount (%)</SelectItem>
              <SelectItem value="fixed">Fixed bundle price ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-[11px] text-muted-foreground">
          {value.quantity_promo_mode === 'percentage'
            ? 'Discount applied to the line total when ordered qty ≥ tier qty. Highest matching tier wins.'
            : 'Replaces the line total with a fixed price when ordered qty ≥ tier qty. Highest matching tier wins.'}
        </p>

        <div className="space-y-2">
          {value.quantity_promos.length === 0 && (
            <p className="text-xs italic text-muted-foreground">No tier configured.</p>
          )}
          {value.quantity_promos.map((tier, idx) => (
            <div key={idx} className="grid grid-cols-[1fr,1fr,auto] gap-2 items-end">
              <div>
                <Label className="text-[11px]">Qty ≥</Label>
                <Input
                  type="number"
                  min={1}
                  value={tier.qty}
                  onChange={(e) => setTier(idx, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                />
              </div>
              <div>
                <Label className="text-[11px]">{valueLabel}</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={tier.value}
                    onChange={(e) => setTier(idx, { value: Math.max(0, parseFloat(e.target.value) || 0) })}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {valueSuffix}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeTier(idx)} type="button">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={addTier} type="button" className="w-full">
          <Plus className="h-4 w-4 mr-1" /> Add tier
        </Button>
      </div>
    </div>
  );
};

export default StockPromoEditor;
