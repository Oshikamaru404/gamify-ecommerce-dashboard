import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Check, X, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export interface CreditOptionRow {
  id: string;
  credits: number;
  months?: number;
  price: number;
  sort_order: number | null;
}

interface InlineCreditOptionsManagerProps {
  options: CreditOptionRow[] | undefined;
  isLoading: boolean;
  showMonths?: boolean;
  onSave: (option: Omit<CreditOptionRow, 'id'> & { id?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  label?: string;
}

interface EditableRow extends CreditOptionRow {
  isNew?: boolean;
  isEditing?: boolean;
}

const InlineCreditOptionsManager: React.FC<InlineCreditOptionsManagerProps> = ({
  options,
  isLoading,
  showMonths = false,
  onSave,
  onDelete,
  label = 'Credit Options',
}) => {
  const [rows, setRows] = useState<EditableRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ credits: string; months: string; price: string; sort_order: string }>({
    credits: '', months: '', price: '', sort_order: ''
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (options) {
      setRows(options.map(o => ({ ...o, isNew: false, isEditing: false })));
    }
  }, [options]);

  const startEdit = (row: EditableRow) => {
    setEditingId(row.id);
    setEditValues({
      credits: row.credits.toString(),
      months: (row.months ?? 1).toString(),
      price: row.price.toString(),
      sort_order: (row.sort_order ?? 0).toString(),
    });
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const cancelEdit = () => {
    // Remove unsaved new rows
    setRows(prev => prev.filter(r => !r.isNew));
    setEditingId(null);
    setEditValues({ credits: '', months: '', price: '', sort_order: '' });
  };

  const saveEdit = async () => {
    const credits = parseInt(editValues.credits);
    const price = parseFloat(editValues.price);
    const months = parseInt(editValues.months) || 1;
    const sort_order = parseInt(editValues.sort_order) || 0;

    if (!credits || credits <= 0) { toast.error('Credits must be > 0'); return; }
    if (!price || price <= 0) { toast.error('Price must be > 0'); return; }

    const isNew = rows.find(r => r.id === editingId)?.isNew;
    try {
      await onSave({
        ...(isNew ? {} : { id: editingId! }),
        credits,
        ...(showMonths ? { months } : {}),
        price,
        sort_order,
      });
      setEditingId(null);
      setEditValues({ credits: '', months: '', price: '', sort_order: '' });
    } catch {
      // error handled by hook
    }
  };

  const handleAdd = () => {
    const tempId = `new-${Date.now()}`;
    const nextOrder = (rows.length > 0 ? Math.max(...rows.map(r => r.sort_order ?? 0)) + 1 : 0);
    const newRow: EditableRow = {
      id: tempId,
      credits: 0,
      months: showMonths ? 1 : undefined,
      price: 0,
      sort_order: nextOrder,
      isNew: true,
      isEditing: true,
    };
    setRows(prev => [...prev, newRow]);
    setEditingId(tempId);
    setEditValues({ credits: '', months: '1', price: '', sort_order: nextOrder.toString() });
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleDelete = async (id: string) => {
    const row = rows.find(r => r.id === id);
    if (row?.isNew) {
      setRows(prev => prev.filter(r => r.id !== id));
      setEditingId(null);
      return;
    }
    if (window.confirm('Delete this credit option?')) {
      await onDelete(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  if (isLoading) {
    return <div className="text-center py-3 text-xs text-muted-foreground">Loading options...</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-1.5">
          <DollarSign className="h-4 w-4 text-primary" />
          {label}
        </h4>
        <Button
          type="button"
          onClick={handleAdd}
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          disabled={editingId !== null}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>

      {/* Table header */}
      {(rows.length > 0 || editingId) && (
        <div className={`grid gap-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-2 ${showMonths ? 'grid-cols-[1fr_1fr_1fr_60px_70px]' : 'grid-cols-[1fr_1fr_60px_70px]'}`}>
          <span>Credits</span>
          {showMonths && <span>Months</span>}
          <span>Price ($)</span>
          <span>Order</span>
          <span className="text-right">Actions</span>
        </div>
      )}

      {/* Rows */}
      <div className="space-y-1">
        {rows.map((row) => {
          const isEditing = editingId === row.id;

          if (isEditing) {
            return (
              <div
                key={row.id}
                className={`grid gap-2 items-center p-1.5 rounded-lg border-2 border-primary/30 bg-primary/5 ${showMonths ? 'grid-cols-[1fr_1fr_1fr_60px_70px]' : 'grid-cols-[1fr_1fr_60px_70px]'}`}
                onKeyDown={handleKeyDown}
              >
                <Input
                  ref={inputRef}
                  type="number"
                  value={editValues.credits}
                  onChange={e => setEditValues(p => ({ ...p, credits: e.target.value }))}
                  placeholder="Credits"
                  className="h-7 text-xs"
                  min={1}
                />
                {showMonths && (
                  <Input
                    type="number"
                    value={editValues.months}
                    onChange={e => setEditValues(p => ({ ...p, months: e.target.value }))}
                    placeholder="Months"
                    className="h-7 text-xs"
                    min={1}
                  />
                )}
                <Input
                  type="number"
                  step="0.01"
                  value={editValues.price}
                  onChange={e => setEditValues(p => ({ ...p, price: e.target.value }))}
                  placeholder="Price"
                  className="h-7 text-xs"
                  min={0.01}
                />
                <Input
                  type="number"
                  value={editValues.sort_order}
                  onChange={e => setEditValues(p => ({ ...p, sort_order: e.target.value }))}
                  placeholder="0"
                  className="h-7 text-xs"
                />
                <div className="flex gap-0.5 justify-end">
                  <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={saveEdit}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={cancelEdit}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={row.id}
              className={`grid gap-2 items-center p-1.5 rounded-lg border border-border hover:border-primary/20 hover:bg-muted/30 cursor-pointer transition-colors group ${showMonths ? 'grid-cols-[1fr_1fr_1fr_60px_70px]' : 'grid-cols-[1fr_1fr_60px_70px]'}`}
              onClick={() => startEdit(row)}
              title="Click to edit"
            >
              <Badge variant="outline" className="text-xs w-fit">{row.credits} Credits</Badge>
              {showMonths && (
                <span className="text-xs text-muted-foreground">{row.months} month{(row.months ?? 0) !== 1 ? 's' : ''}</span>
              )}
              <span className="text-xs font-semibold text-green-600">${row.price}</span>
              <span className="text-[10px] text-muted-foreground">{row.sort_order ?? 0}</span>
              <div className="flex gap-0.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {rows.length === 0 && editingId === null && (
        <p className="text-xs text-muted-foreground text-center py-3 border border-dashed rounded-lg">
          No credit options yet. Click "Add" to create pricing tiers.
        </p>
      )}
    </div>
  );
};

export default InlineCreditOptionsManager;
