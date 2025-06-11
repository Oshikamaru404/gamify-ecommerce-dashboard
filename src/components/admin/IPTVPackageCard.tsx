
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Star } from 'lucide-react';
import { IPTVPackage } from '@/hooks/useIPTVPackages';

type IPTVPackageCardProps = {
  package: IPTVPackage;
  onEdit: (pkg: IPTVPackage) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
};

const IPTVPackageCard: React.FC<IPTVPackageCardProps> = ({
  package: pkg,
  onEdit,
  onDelete,
  onToggleFeatured,
}) => {
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'subscription':
        return <Badge className="bg-blue-100 text-blue-700">Subscription</Badge>;
      case 'reseller':
        return <Badge className="bg-green-100 text-green-700">Reseller</Badge>;
      case 'player':
        return <Badge className="bg-purple-100 text-purple-700">Player</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>;
      case 'featured':
        return <Badge className="bg-yellow-100 text-yellow-700 flex items-center gap-1">
          <Star size={12} />
          Featured
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {pkg.icon && <span className="text-2xl">{pkg.icon}</span>}
            <div>
              <CardTitle className="text-lg">{pkg.name}</CardTitle>
              <div className="flex gap-2 mt-1">
                {getCategoryBadge(pkg.category)}
                {getStatusBadge(pkg.status)}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(pkg)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onToggleFeatured(pkg.id, pkg.status !== 'featured')}
              >
                <Star className="mr-2 h-4 w-4" />
                {pkg.status === 'featured' ? 'Remove Featured' : 'Mark Featured'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(pkg.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {pkg.description && (
          <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
        )}
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Pricing (Credits):</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {pkg.price_10_credits && (
              <div>10: ${pkg.price_10_credits}</div>
            )}
            {pkg.price_25_credits && (
              <div>25: ${pkg.price_25_credits}</div>
            )}
            {pkg.price_50_credits && (
              <div>50: ${pkg.price_50_credits}</div>
            )}
            {pkg.price_100_credits && (
              <div>100: ${pkg.price_100_credits}</div>
            )}
          </div>
        </div>

        {pkg.features && pkg.features.length > 0 && (
          <div className="mt-3">
            <h4 className="font-medium text-sm mb-1">Features:</h4>
            <div className="flex flex-wrap gap-1">
              {pkg.features.slice(0, 3).map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
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
      </CardContent>
    </Card>
  );
};

export default IPTVPackageCard;
