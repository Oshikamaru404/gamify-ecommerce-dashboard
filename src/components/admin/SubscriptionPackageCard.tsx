
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Star, DollarSign, CreditCard } from 'lucide-react';
import { SubscriptionPackage } from '@/hooks/useSubscriptionPackages';
import { useSubscriptionCreditOptions } from '@/hooks/useSubscriptionCreditOptions';

interface SubscriptionPackageCardProps {
  package: SubscriptionPackage;
  onEdit: (pkg: SubscriptionPackage) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
}

const SubscriptionPackageCard: React.FC<SubscriptionPackageCardProps> = ({
  package: pkg,
  onEdit,
  onDelete,
  onToggleFeatured,
}) => {
  const isFeatured = pkg.status === 'featured';
  const { data: creditOptions } = useSubscriptionCreditOptions(pkg.id);
  
  return (
    <Card className={`relative transition-all duration-200 hover:shadow-lg ${isFeatured ? 'border-2 border-yellow-400' : ''}`}>
      {isFeatured && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-yellow-500 text-white">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              {pkg.icon_url ? (
                <img 
                  src={pkg.icon_url} 
                  alt={pkg.name}
                  className="w-8 h-8 rounded-md object-cover"
                />
              ) : (
                <span className="text-xl">{pkg.icon || '📺'}</span>
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{pkg.name}</CardTitle>
              <p className="text-sm text-gray-600">{pkg.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleFeatured(pkg.id, !isFeatured)}
              className={isFeatured ? 'text-yellow-600' : ''}
            >
              <Star className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(pkg)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(pkg.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Dynamic Credit Options */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Dynamic Credit Options
          </h4>
          {creditOptions && creditOptions.length > 0 ? (
            <div className="grid gap-2">
              {creditOptions.map((option) => (
                <div key={option.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {option.credits} Credits
                    </Badge>
                    <span className="text-gray-600">{option.months} months</span>
                  </div>
                  <span className="font-medium text-green-600">${option.price}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No credit options configured</div>
          )}
        </div>

        {/* Legacy Pricing (if still present) */}
        {(pkg.price_3_credits || pkg.price_6_credits || pkg.price_12_credits) && (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-yellow-800">
              <DollarSign className="w-4 h-4" />
              Legacy Pricing (Deprecated)
            </h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {pkg.price_3_credits && (
                <div className="text-center">
                  <div className="font-medium text-gray-900">3 Credits</div>
                  <div className="text-green-600">${pkg.price_3_credits}</div>
                  <div className="text-xs text-gray-500">{pkg.credits_3_months || 3} months</div>
                </div>
              )}
              {pkg.price_6_credits && (
                <div className="text-center">
                  <div className="font-medium text-gray-900">6 Credits</div>
                  <div className="text-green-600">${pkg.price_6_credits}</div>
                  <div className="text-xs text-gray-500">{pkg.credits_6_months || 6} months</div>
                </div>
              )}
              {pkg.price_12_credits && (
                <div className="text-center">
                  <div className="font-medium text-gray-900">12 Credits</div>
                  <div className="text-green-600">${pkg.price_12_credits}</div>
                  <div className="text-xs text-gray-500">{pkg.credits_12_months || 12} months</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        {pkg.features && pkg.features.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Features</h4>
            <div className="flex flex-wrap gap-1">
              {pkg.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {pkg.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{pkg.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={pkg.status === 'active' ? 'default' : pkg.status === 'featured' ? 'secondary' : 'outline'}>
              {pkg.status}
            </Badge>
            <span className="text-sm text-gray-500">Order: {pkg.sort_order}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionPackageCard;
