import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Check, Pencil } from 'lucide-react';

interface EditableFeatureListProps {
  features: string[];
  onChange: (features: string[]) => void;
  label?: string;
}

const EditableFeatureList: React.FC<EditableFeatureListProps> = ({
  features,
  onChange,
  label = 'Features',
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const editRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingIndex !== null) {
      editRef.current?.focus();
      editRef.current?.select();
    }
  }, [editingIndex]);

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(features[index]);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    if (editValue.trim()) {
      const updated = [...features];
      updated[editingIndex] = editValue.trim();
      onChange(updated);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      onChange([...features, newFeature.trim()]);
      setNewFeature('');
      newRef.current?.focus();
    }
  };

  const removeFeature = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
    if (editingIndex === index) cancelEdit();
  };

  const moveFeature = (from: number, to: number) => {
    if (to < 0 || to >= features.length) return;
    const updated = [...features];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    onChange(updated);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); saveEdit(); }
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      
      {/* Add new */}
      <div className="flex gap-2">
        <Input
          ref={newRef}
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="e.g. 12 Credits = 12 Months"
          className="h-8 text-sm"
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
        />
        <Button type="button" onClick={addFeature} size="sm" variant="outline" className="h-8 px-3">
          <Plus className="h-3.5 w-3.5 mr-1" /> Add
        </Button>
      </div>

      {/* Feature list */}
      <div className="space-y-1">
        {features.map((feature, index) => {
          const isEditing = editingIndex === index;

          if (isEditing) {
            return (
              <div key={index} className="flex items-center gap-1.5 p-1 rounded-md border-2 border-primary/30 bg-primary/5">
                <Input
                  ref={editRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  className="h-7 text-sm flex-1"
                />
                <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-green-600" onClick={saveEdit}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground" onClick={cancelEdit}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="flex items-center gap-1.5 group p-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground text-xs px-0.5"
                  onClick={() => moveFeature(index, index - 1)}
                  disabled={index === 0}
                >▲</button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground text-xs px-0.5"
                  onClick={() => moveFeature(index, index + 1)}
                  disabled={index === features.length - 1}
                >▼</button>
              </div>
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 flex-1 justify-start text-xs py-1"
                onClick={() => startEdit(index)}
              >
                {feature}
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                onClick={() => startEdit(index)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                onClick={() => removeFeature(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>

      {features.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded-md">
          No features yet. Add tags like "12 Credits = 12 Months".
        </p>
      )}
    </div>
  );
};

export default EditableFeatureList;
