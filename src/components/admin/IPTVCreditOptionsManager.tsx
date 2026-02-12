
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { useIPTVCreditOptions, useCreateIPTVCreditOption, useUpdateIPTVCreditOption, useDeleteIPTVCreditOption, IPTVCreditOption } from '@/hooks/useIPTVCreditOptions';

interface IPTVCreditOptionsManagerProps {
  packageId: string;
  packageName: string;
}

const IPTVCreditOptionsManager: React.FC<IPTVCreditOptionsManagerProps> = ({ packageId, packageName }) => {
  const { data: creditOptions, isLoading } = useIPTVCreditOptions(packageId);
  const createOption = useCreateIPTVCreditOption();
  const updateOption = useUpdateIPTVCreditOption();
  const deleteOption = useDeleteIPTVCreditOption();

  const [editingOption, setEditingOption] = useState<IPTVCreditOption | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    credits: '',
    price: '',
    sort_order: ''
  });

  const handleSave = async () => {
    const optionData = {
      package_id: packageId,
      credits: parseInt(formData.credits),
      price: parseFloat(formData.price),
      sort_order: parseInt(formData.sort_order) || 0
    };

    if (editingOption) {
      await updateOption.mutateAsync({ id: editingOption.id, ...optionData });
    } else {
      await createOption.mutateAsync(optionData);
    }

    setEditingOption(null);
    setShowAddForm(false);
    setFormData({ credits: '', price: '', sort_order: '' });
  };

  const handleEdit = (option: IPTVCreditOption) => {
    setEditingOption(option);
    setFormData({
      credits: option.credits.toString(),
      price: option.price.toString(),
      sort_order: option.sort_order?.toString() || '0'
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this credit option?')) {
      await deleteOption.mutateAsync(id);
    }
  };

  const handleCancel = () => {
    setEditingOption(null);
    setShowAddForm(false);
    setFormData({ credits: '', price: '', sort_order: '' });
  };

  if (isLoading) {
    return <div className="text-center py-4 text-sm text-gray-500">Loading credit options...</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Credit Options
        </h4>
        <Button
          type="button"
          onClick={() => setShowAddForm(true)}
          size="sm"
          variant="outline"
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>

      {/* Credit Options List */}
      <div className="grid gap-2">
        {creditOptions?.map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between p-2 border rounded-lg text-sm"
          >
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">{option.credits} Credits</Badge>
              <span className="font-medium text-green-600">${option.price}</span>
            </div>
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleEdit(option)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600" onClick={() => handleDelete(option.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingOption) && (
        <div className="border rounded-lg p-3 bg-gray-50 space-y-3">
          <h5 className="text-xs font-medium">
            {editingOption ? 'Edit Credit Option' : 'Add Credit Option'}
          </h5>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="iptv-credits" className="text-xs">Credits</Label>
              <Input
                id="iptv-credits"
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData(prev => ({ ...prev, credits: e.target.value }))}
                placeholder="e.g., 10"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="iptv-price" className="text-xs">Price ($)</Label>
              <Input
                id="iptv-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="e.g., 29.99"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="iptv-sort" className="text-xs">Order</Label>
              <Input
                id="iptv-sort"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
                placeholder="0"
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={handleSave} size="sm" className="h-7 text-xs bg-red-600 hover:bg-red-700">
              {editingOption ? 'Update' : 'Add'}
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {creditOptions?.length === 0 && !showAddForm && (
        <p className="text-xs text-gray-500 text-center py-2">No credit options yet. Add custom credit tiers.</p>
      )}
    </div>
  );
};

export default IPTVCreditOptionsManager;
