
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { IPTVPackage } from '@/hooks/useIPTVPackages';
import { useLocalizedText } from '@/lib/multilingualUtils';

interface MultilingualPackageCardProps {
  package: IPTVPackage;
  onEdit: (pkg: IPTVPackage) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

const MultilingualPackageCard: React.FC<MultilingualPackageCardProps> = ({
  package: pkg,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  console.log('🎯 MultilingualPackageCard rendering package:', pkg.name);
  console.log('🎯 Package description:', pkg.description);
  
  const localizedName = useLocalizedText(pkg.name);
  const localizedDescription = useLocalizedText(pkg.description);
  
  console.log('🎯 Localized name result:', localizedName);
  console.log('🎯 Localized description result:', localizedDescription);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'featured':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case 'subscription':
        return 'Subscription';
      case 'panel-iptv':
        return 'Panel IPTV';
      case 'player':
        return 'Player';
      case 'activation-player':
        return 'Activation Player';
      case 'reseller':
        return 'Reseller';
      default:
        return category;
    }
  };

  const getPriceDisplay = () => {
    const prices = [];
    
    if (pkg.price_1_month) prices.push(`1M: $${pkg.price_1_month}`);
    if (pkg.price_3_months) prices.push(`3M: $${pkg.price_3_months}`);
    if (pkg.price_6_months) prices.push(`6M: $${pkg.price_6_months}`);
    if (pkg.price_12_months) prices.push(`12M: $${pkg.price_12_months}`);
    
    if (pkg.price_10_credits) prices.push(`10C: $${pkg.price_10_credits}`);
    if (pkg.price_25_credits) prices.push(`25C: $${pkg.price_25_credits}`);
    if (pkg.price_50_credits) prices.push(`50C: $${pkg.price_50_credits}`);
    if (pkg.price_100_credits) prices.push(`100C: $${pkg.price_100_credits}`);
    
    return prices.length > 0 ? prices.join(', ') : 'No pricing set';
  };

  // Add safety check to prevent JSON from being displayed
  const safeLocalizedName = localizedName && !localizedName.startsWith('{') ? localizedName : 'Package Name';
  const safeLocalizedDescription = localizedDescription && !localizedDescription.startsWith('{') ? localizedDescription : '';

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{safeLocalizedName}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{getCategoryDisplay(pkg.category)}</Badge>
              <Badge className={getStatusColor(pkg.status || 'active')}>
                {pkg.status || 'active'}
              </Badge>
            </div>
          </div>
          {pkg.icon_url && (
            <img 
              src={pkg.icon_url} 
              alt={safeLocalizedName} 
              className="h-12 w-12 object-contain rounded"
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {safeLocalizedDescription && (
          <p className="text-sm text-gray-600 mb-3">{safeLocalizedDescription}</p>
        )}
        
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Pricing: </span>
            <span className="text-gray-600">{getPriceDisplay()}</span>
          </div>
          
          {pkg.features && pkg.features.length > 0 && (
            <div className="text-sm">
              <span className="font-medium">Features: </span>
              <span className="text-gray-600">{pkg.features.length} features</span>
            </div>
          )}
          
          {pkg.sort_order !== undefined && (
            <div className="text-sm">
              <span className="font-medium">Sort Order: </span>
              <span className="text-gray-600">{pkg.sort_order}</span>
            </div>
          )}
          
          {/* Debug info (remove in production) */}
          <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-50 rounded">
            <div>Raw name: {JSON.stringify(pkg.name)}</div>
            <div>Raw description: {JSON.stringify(pkg.description)}</div>
            <div>Localized name: {localizedName}</div>
            <div>Localized description: {localizedDescription}</div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(pkg.id, pkg.status || 'active')}
          >
            {pkg.status === 'active' ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Deactivate
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Activate
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(pkg)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(pkg.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultilingualPackageCard;
