
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { SubscriptionPackage, useCreateSubscriptionPackage, useUpdateSubscriptionPackage } from '@/hooks/useSubscriptionPackages';
import ImageUploader from './ImageUploader';
import CreditOptionsManager from './CreditOptionsManager';

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
      status: formData.status,
      sort_order: parseInt(formData.sort_order) || 0,
      // Legacy fields for backward compatibility - these are no longer used in the new dynamic credit system
      price_3_credits: null,
      price_6_credits: null,
      price_12_credits: null,
      credits_3_months: null,
      credits_6_months: null,
      credits_12_months: null,
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pkg ? 'Edit Subscription Package' : 'Create New Subscription Package'}</DialogTitle>
          <DialogDescription>
            {pkg ? 'Update the subscription package details below.' : 'Fill in the details to create a new subscription package.'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="credits" disabled={!pkg}>
              Credit Options {!pkg && '(Save package first)'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="credits" className="space-y-4">
            {pkg && (
              <CreditOptionsManager
                packageId={pkg.id}
                packageName={pkg.name}
              />
            )}
          </TabsContent>
        </Tabs>

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
