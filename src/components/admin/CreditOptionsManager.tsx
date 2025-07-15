
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { useSubscriptionCreditOptions, useCreateSubscriptionCreditOption, useUpdateSubscriptionCreditOption, useDeleteSubscriptionCreditOption, SubscriptionCreditOption } from '@/hooks/useSubscriptionCreditOptions';

interface CreditOptionsManagerProps {
  packageId: string;
  packageName: string;
}

const CreditOptionsManager: React.FC<CreditOptionsManagerProps> = ({ packageId, packageName }) => {
  const { data: creditOptions, isLoading } = useSubscriptionCreditOptions(packageId);
  const createOption = useCreateSubscriptionCreditOption();
  const updateOption = useUpdateSubscriptionCreditOption();
  const deleteOption = useDeleteSubscriptionCreditOption();

  const [editingOption, setEditingOption] = useState<SubscriptionCreditOption | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    credits: '',
    months: '',
    price: '',
    sort_order: ''
  });

  const handleSave = async () => {
    const optionData = {
      package_id: packageId,
      credits: parseInt(formData.credits),
      months: parseInt(formData.months),
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
    setFormData({ credits: '', months: '', price: '', sort_order: '' });
  };

  const handleEdit = (option: SubscriptionCreditOption) => {
    setEditingOption(option);
    setFormData({
      credits: option.credits.toString(),
      months: option.months.toString(),
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
    setFormData({ credits: '', months: '', price: '', sort_order: '' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit Options for {packageName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading credit options...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Credit Options for {packageName}
          </CardTitle>
          <Button
            onClick={() => setShowAddForm(true)}
            size="sm"
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Credit Options List */}
        <div className="grid gap-3">
          {creditOptions?.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Badge variant="outline">{option.credits} Credits</Badge>
                <span className="text-sm text-gray-600">
                  {option.months} months
                </span>
                <span className="font-medium text-green-600">
                  ${option.price}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(option)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(option.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingOption) && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-4">
              {editingOption ? 'Edit Credit Option' : 'Add New Credit Option'}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData(prev => ({ ...prev, credits: e.target.value }))}
                  placeholder="e.g., 3"
                />
              </div>
              <div>
                <Label htmlFor="months">Months</Label>
                <Input
                  id="months"
                  type="number"
                  value={formData.months}
                  onChange={(e) => setFormData(prev => ({ ...prev, months: e.target.value }))}
                  placeholder="e.g., 3"
                />
              </div>
              <div>
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., 9.99"
                />
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                {editingOption ? 'Update' : 'Add'} Option
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {creditOptions?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No credit options configured for this package.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditOptionsManager;
