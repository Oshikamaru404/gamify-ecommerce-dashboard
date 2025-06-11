
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { IPTVPackage } from '@/hooks/useIPTVPackages';

type PackageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package?: IPTVPackage | null;
  onSave: (packageData: Omit<IPTVPackage, 'id' | 'created_at' | 'updated_at'>) => void;
  title: string;
};

const PackageDialog: React.FC<PackageDialogProps> = ({
  open,
  onOpenChange,
  package: pkg,
  onSave,
  title,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'subscription' as 'subscription' | 'reseller' | 'player' | 'panel-iptv' | 'activation-player',
    description: '',
    icon: '',
    features: [] as string[],
    price_10_credits: '',
    price_25_credits: '',
    price_50_credits: '',
    price_100_credits: '',
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
      price_10_credits: formData.price_10_credits ? parseFloat(formData.price_10_credits) : null,
      price_25_credits: formData.price_25_credits ? parseFloat(formData.price_25_credits) : null,
      price_50_credits: formData.price_50_credits ? parseFloat(formData.price_50_credits) : null,
      price_100_credits: formData.price_100_credits ? parseFloat(formData.price_100_credits) : null,
      status: formData.status,
      sort_order: parseInt(formData.sort_order) || 0,
    };
    
    onSave(packageData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
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
                  <SelectItem value="reseller">Reseller</SelectItem>
                  <SelectItem value="player">Player</SelectItem>
                  <SelectItem value="panel-iptv">Panel IPTV</SelectItem>
                  <SelectItem value="activation-player">Activation Player</SelectItem>
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
            <Label>Pricing (USD)</Label>
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
