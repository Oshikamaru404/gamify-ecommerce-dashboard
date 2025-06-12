
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { IPTVPackage, useCreateIPTVPackage, useUpdateIPTVPackage } from '@/hooks/useIPTVPackages';

type PackageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package?: IPTVPackage | null;
};

const PackageDialog: React.FC<PackageDialogProps> = ({
  open,
  onOpenChange,
  package: pkg,
}) => {
  const createPackage = useCreateIPTVPackage();
  const updatePackage = useUpdateIPTVPackage();

  const [formData, setFormData] = useState({
    name: '',
    category: 'subscription' as 'subscription' | 'reseller' | 'player' | 'panel-iptv' | 'activation-player',
    description: '',
    icon: '',
    features: [] as string[],
    // Credit-based pricing
    price_10_credits: '',
    price_25_credits: '',
    price_50_credits: '',
    price_100_credits: '',
    // Month-based pricing
    price_1_month: '',
    price_3_months: '',
    price_6_months: '',
    price_12_months: '',
    status: 'active' as 'active' | 'inactive' | 'featured',
    sort_order: '0',
  });
  
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name || '',
        category: pkg.category || 'subscription',
        description: pkg.description || '',
        icon: pkg.icon || '',
        features: pkg.features || [],
        price_10_credits: pkg.price_10_credits?.toString() || '',
        price_25_credits: pkg.price_25_credits?.toString() || '',
        price_50_credits: pkg.price_50_credits?.toString() || '',
        price_100_credits: pkg.price_100_credits?.toString() || '',
        price_1_month: pkg.price_1_month?.toString() || '',
        price_3_months: pkg.price_3_months?.toString() || '',
        price_6_months: pkg.price_6_months?.toString() || '',
        price_12_months: pkg.price_12_months?.toString() || '',
        status: pkg.status || 'active',
        sort_order: pkg.sort_order?.toString() || '0',
      });
    } else {
      setFormData({
        name: '',
        category: 'subscription',
        description: '',
        icon: '',
        features: [],
        price_10_credits: '',
        price_25_credits: '',
        price_50_credits: '',
        price_100_credits: '',
        price_1_month: '',
        price_3_months: '',
        price_6_months: '',
        price_12_months: '',
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
      category: formData.category,
      description: formData.description || null,
      icon: formData.icon || null,
      features: formData.features.length > 0 ? formData.features : null,
      // Credit-based pricing
      price_10_credits: formData.price_10_credits ? parseFloat(formData.price_10_credits) : null,
      price_25_credits: formData.price_25_credits ? parseFloat(formData.price_25_credits) : null,
      price_50_credits: formData.price_50_credits ? parseFloat(formData.price_50_credits) : null,
      price_100_credits: formData.price_100_credits ? parseFloat(formData.price_100_credits) : null,
      // Month-based pricing
      price_1_month: formData.price_1_month ? parseFloat(formData.price_1_month) : null,
      price_3_months: formData.price_3_months ? parseFloat(formData.price_3_months) : null,
      price_6_months: formData.price_6_months ? parseFloat(formData.price_6_months) : null,
      price_12_months: formData.price_12_months ? parseFloat(formData.price_12_months) : null,
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

  // Both subscription and activation-player categories use monthly pricing
  // Panel IPTV and player categories use credit-based pricing
  const isMonthlyPricingCategory = formData.category === 'subscription' || formData.category === 'activation-player';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pkg ? 'Edit Package' : 'Create New Package'}</DialogTitle>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="activation-player">Activation Player</SelectItem>
                  <SelectItem value="panel-iptv">Panel IPTV</SelectItem>
                  <SelectItem value="player">Player</SelectItem>
                  <SelectItem value="reseller">Reseller</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <Label>
              {isMonthlyPricingCategory ? 'Monthly Subscription Pricing (USD)' : 'Credit-Based Pricing (USD)'}
            </Label>
            <p className="text-sm text-gray-600 mb-2">
              {isMonthlyPricingCategory 
                ? 'Set pricing for monthly subscription plans (used by Subscription and Activation Player packages)'
                : 'Set pricing for credit-based system (used by Panel IPTV and Player packages)'
              }
            </p>
            {isMonthlyPricingCategory ? (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="price_1_month" className="text-sm">1 Month</Label>
                  <Input
                    id="price_1_month"
                    type="number"
                    step="0.01"
                    value={formData.price_1_month}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_1_month: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="price_3_months" className="text-sm">3 Months</Label>
                  <Input
                    id="price_3_months"
                    type="number"
                    step="0.01"
                    value={formData.price_3_months}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_3_months: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="price_6_months" className="text-sm">6 Months</Label>
                  <Input
                    id="price_6_months"
                    type="number"
                    step="0.01"
                    value={formData.price_6_months}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_6_months: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="price_12_months" className="text-sm">12 Months</Label>
                  <Input
                    id="price_12_months"
                    type="number"
                    step="0.01"
                    value={formData.price_12_months}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_12_months: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="price_10" className="text-sm">10 Credits</Label>
                  <Input
                    id="price_10"
                    type="number"
                    step="0.01"
                    value={formData.price_10_credits}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_10_credits: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="price_25" className="text-sm">25 Credits</Label>
                  <Input
                    id="price_25"
                    type="number"
                    step="0.01"
                    value={formData.price_25_credits}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_25_credits: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="price_50" className="text-sm">50 Credits</Label>
                  <Input
                    id="price_50"
                    type="number"
                    step="0.01"
                    value={formData.price_50_credits}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_50_credits: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="price_100" className="text-sm">100 Credits</Label>
                  <Input
                    id="price_100"
                    type="number"
                    step="0.01"
                    value={formData.price_100_credits}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_100_credits: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}
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

export default PackageDialog;
