
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalizedText } from '@/lib/multilingualUtils';

interface SubscriptionPackage {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  icon_url: string | null;
  features: string[] | null;
  price_3_credits: number | null;
  price_6_credits: number | null;
  price_12_credits: number | null;
  credits_3_months: number | null;
  credits_6_months: number | null;
  credits_12_months: number | null;
  status: string | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
  category: string;
}

interface MultilingualPackageCardProps {
  package: SubscriptionPackage;
  onEdit: (pkg: SubscriptionPackage) => void;
  onDelete: (id: string) => void;
}

const MultilingualPackageCard: React.FC<MultilingualPackageCardProps> = ({ 
  package: pkg, 
  onEdit, 
  onDelete 
}) => {
  // Use the multilingual utility functions
  const displayName = useLocalizedText(pkg.name);
  const displayDescription = useLocalizedText(pkg.description);

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {pkg.icon_url && (
              <img src={pkg.icon_url} alt={displayName} className="w-6 h-6 object-contain" />
            )}
            <h3 className="font-semibold text-lg">{displayName}</h3>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(pkg)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(pkg.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{displayDescription}</p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Category:</span>
            <Badge variant="outline">{pkg.category}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={pkg.status === 'active' ? 'default' : pkg.status === 'featured' ? 'secondary' : 'destructive'}>
              {pkg.status}
            </Badge>
          </div>
          
          {pkg.features && pkg.features.length > 0 && (
            <div className="pt-2">
              <span className="text-sm font-medium">Features:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {pkg.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default MultilingualPackageCard;
