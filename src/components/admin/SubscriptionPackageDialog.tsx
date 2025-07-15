
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { SubscriptionPackage, useCreateSubscriptionPackage, useUpdateSubscriptionPackage } from '@/hooks/useSubscriptionPackages';
import ImageUploader from './ImageUploader';

type SubscriptionPackageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package?: SubscriptionPackage | null;
};

const SubscriptionPackageDialog: React.FC<SubscriptionPackageDialogProps> = ({
  open,
  onOpenChange,
  package: pkg,
}) => {
  const createPackage = useCreateSubscriptionPackage();
  const updatePackage = useUpdateSubscriptionPackage();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    icon_url: '',
    features: [] as string[],
    price_3_credits: '',
    price_6_credits: '',
    price_12_credits: '',
    credits_3_months: '3',
    credits_6_months: '6',
    credits_12_months: '12',
    status: 'active' as 'active' | 'inactive' | 'featured',
    sort_order: '0',
  });
  
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name || '',
        description: pkg.description || '',
        icon: pkg.icon || '',
        icon_url: pkg.icon_url || '',
        features: pkg.features || [],
        price_3_credits: pkg.price_3_credits?.toString() || '',
        price_6_credits: pkg.price_6_credits?.toString() || '',
        price_12_credits: pkg.price_12_credits?.toString() || '',
        credits_3_months: pkg.credits_3_months?.toString() || '3',
        credits_6_months: pkg.credits_6_months?.toString() || '6',
        credits_12_months: pkg.credits_12_months?.toString() || '12',
        status: (pkg.status as 'active' | 'inactive' | 'featured') || 'active',
        sort_order: pkg.sort_order?.toString() || '0',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '',
        icon_url: '',
        features: [],
        price_3_credits: '',
        price_6_credits: '',
        price_12_credits: '',
        credits_3_months: '3',
        credits_6_months: '6',
        credits_12_months: '12',
        status: 'active',
        sort_order: '0',
      });
    }
  }, [pkg, open]);

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    const packageData = {
      name: formData.name,
      description: formData.description || null,
      icon: formData.icon || null,
      icon_url: formData.icon_url || null,
      features: formData.features.length > 0 ? formData.features : null,
      price_3_credits: formData.price_3_credits ? parseFloat(formData.price_3_credits) : null,
      price_6_credits: formData.price_6_credits ? parseFloat(formData.price_6_credits) : null,
      price_12_credits: formData.price_12_credits ? parseFloat(formData.price_12_credits) : null,
      credits_3_months: parseInt(formData.credits_3_months) || 3,
      credits_6_months: parseInt(formData.credits_6_months) || 6,
      credits_12_months: parseInt(formData.credits_12_months) || 12,
      status: formData.status,
      sort_order: parseInt(formData.sort_order) || 0,
    };
    
    if (pkg) {
      updatePackage.mutate({ id: pkg.id, ...packageData });
    } else {
      createPackage.mutate(packageData);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pkg ? 'Edit Subscription Package' : 'Create New Subscription Package'}</DialogTitle>
          <DialogDescription>
            {pkg ? 'Update the subscription package details below.' : 'Fill in the details to create a new subscription package.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Package Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter package name"
              />
            </div>
            <div>
              <Label htmlFor="icon">Icon/Emoji</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="🚀"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <ImageUploader
            currentImageUrl={formData.icon_url}
            onImageUrlChange={(url) => setFormData(prev => ({ ...prev, icon_url: url }))}
            label="Package Image"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
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

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Package description"
              rows={3}
            />
          </div>

          <div>
            <Label>Credit-Based Pricing (USD)</Label>
            <p className="text-sm text-gray-600 mb-2">
              Set pricing for credit-based subscription system
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price_3" className="text-sm">3 Credits</Label>
                <Input
                  id="price_3"
                  type="number"
                  step="0.01"
                  value={formData.price_3_credits}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_3_credits: e.target.value }))}
                  placeholder="0.00"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.credits_3_months} months
                </div>
              </div>
              <div>
                <Label htmlFor="price_6" className="text-sm">6 Credits</Label>
                <Input
                  id="price_6"
                  type="number"
                  step="0.01"
                  value={formData.price_6_credits}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_6_credits: e.target.value }))}
                  placeholder="0.00"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.credits_6_months} months
                </div>
              </div>
              <div>
                <Label htmlFor="price_12" className="text-sm">12 Credits</Label>
                <Input
                  id="price_12"
                  type="number"
                  step="0.01"
                  value={formData.price_12_credits}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_12_credits: e.target.value }))}
                  placeholder="0.00"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.credits_12_months} months
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label>Credit to Month Mapping</Label>
            <p className="text-sm text-gray-600 mb-2">
              Configure how many months each credit package provides
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="credits_3" className="text-sm">3 Credits = ? Months</Label>
                <Input
                  id="credits_3"
                  type="number"
                  value={formData.credits_3_months}
                  onChange={(e) => setFormData(prev => ({ ...prev, credits_3_months: e.target.value }))}
                  placeholder="3"
                />
              </div>
              <div>
                <Label htmlFor="credits_6" className="text-sm">6 Credits = ? Months</Label>
                <Input
                  id="credits_6"
                  type="number"
                  value={formData.credits_6_months}
                  onChange={(e) => setFormData(prev => ({ ...prev, credits_6_months: e.target.value }))}
                  placeholder="6"
                />
              </div>
              <div>
                <Label htmlFor="credits_12" className="text-sm">12 Credits = ? Months</Label>
                <Input
                  id="credits_12"
                  type="number"
                  value={formData.credits_12_months}
                  onChange={(e) => setFormData(prev => ({ ...prev, credits_12_months: e.target.value }))}
                  placeholder="12"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Features</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
              />
              <Button type="button" onClick={addFeature}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <X
                    size={12}
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => removeFeature(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Package
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionPackageDialog;
