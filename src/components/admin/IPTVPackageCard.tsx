
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Star, Tv, GamepadIcon, Crown, Monitor, Shield } from 'lucide-react';
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
        return (
          <Badge className="bg-blue-100 text-blue-700 flex items-center gap-1">
            <Tv size={12} />
            Subscription
          </Badge>
        );
      case 'panel-iptv':
        return (
          <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
            <Monitor size={12} />
            Panel IPTV
          </Badge>
        );
      case 'player':
        return (
          <Badge className="bg-purple-100 text-purple-700 flex items-center gap-1">
            <GamepadIcon size={12} />
            Player
          </Badge>
        );
      case 'activation-player':
        return (
          <Badge className="bg-orange-100 text-orange-700 flex items-center gap-1">
            <Crown size={12} />
            Activation Player
          </Badge>
        );
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

  const renderPricing = () => {
    // Both subscription and activation-player categories use monthly pricing
    // Panel IPTV and player categories use credit-based pricing
    const isMonthlyPricingCategory = pkg.category === 'subscription' || pkg.category === 'activation-player';
    
    if (isMonthlyPricingCategory) {
      // Show month-based pricing for subscription and activation-player packages
      return (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-900">Monthly Subscription Pricing:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {pkg.price_1_month && (
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">1 Month:</span> ${pkg.price_1_month}
              </div>
            )}
            {pkg.price_3_months && (
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">3 Months:</span> ${pkg.price_3_months}
              </div>
            )}
            {pkg.price_6_months && (
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">6 Months:</span> ${pkg.price_6_months}
              </div>
            )}
            {pkg.price_12_months && (
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">12 Months:</span> ${pkg.price_12_months}
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // Show credit-based pricing for panel-iptv and player packages
      return (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-900">Credit-Based Pricing:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {pkg.price_10_credits && (
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">10 Credits:</span> ${pkg.price_10_credits}
              </div>
            )}
            {pkg.price_25_credits && (
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">25 Credits:</span> ${pkg.price_25_credits}
              </div>
            )}
            {pkg.price_50_credits && (
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">50 Credits:</span> ${pkg.price_50_credits}
              </div>
            )}
            {pkg.price_100_credits && (
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">100 Credits:</span> ${pkg.price_100_credits}
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  const renderIcon = () => {
    if (pkg.icon_url) {
      return (
        <img 
          src={pkg.icon_url} 
          alt={pkg.name}
          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
          onError={(e) => {
            // If image fails to load, hide it and show fallback
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
      );
    }
    return null;
  };

  const renderFallbackIcon = () => {
    const iconDisplay = pkg.icon_url ? 'none' : 'flex';
    
    if (pkg.icon) {
      return (
        <div 
          className="w-12 h-12 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-2xl"
          style={{ display: iconDisplay }}
        >
          {pkg.icon}
        </div>
      );
    }
    
    // Default icon based on category
    const defaultIcon = pkg.category === 'subscription' ? '📺' : 
                       pkg.category === 'panel-iptv' ? '🖥️' :
                       pkg.category === 'player' ? '🎮' :
                       pkg.category === 'activation-player' ? '👑' : '📦';
    
    return (
      <div 
        className="w-12 h-12 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-2xl"
        style={{ display: iconDisplay }}
      >
        {defaultIcon}
      </div>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 relative">
              {renderIcon()}
              {renderFallbackIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg text-gray-900 break-words leading-tight">
                {pkg.name}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {getCategoryBadge(pkg.category)}
                {getStatusBadge(pkg.status)}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-red-50 h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(pkg)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Package
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onToggleFeatured(pkg.id, pkg.status !== 'featured')}
                >
                  <Star className="mr-2 h-4 w-4" />
                  {pkg.status === 'featured' ? 'Remove Featured' : 'Mark as Featured'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(pkg.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Package
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {pkg.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{pkg.description}</p>
        )}
        
        {/* 30-Day Guarantee Badge */}
        <div className="mb-3">
          <Badge className="bg-green-100 text-green-700 flex items-center gap-1 w-fit">
            <Shield size={12} />
            30-Day Money Back Guarantee
          </Badge>
        </div>
        
        {renderPricing()}

        {pkg.features && pkg.features.length > 0 && (
          <div className="mt-3">
            <h4 className="font-medium text-sm mb-1 text-gray-900">Package Features:</h4>
            <div className="flex flex-wrap gap-1">
              {pkg.features.slice(0, 3).map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {pkg.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{pkg.features.length - 3} more features
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
