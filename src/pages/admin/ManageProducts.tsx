
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Tv, Monitor, Crown, GamepadIcon, Home, CreditCard } from 'lucide-react';
import { useIPTVPackages, useDeleteIPTVPackage, useUpdateIPTVPackage } from '@/hooks/useIPTVPackages';
import IPTVPackageCard from '@/components/admin/IPTVPackageCard';
import PackageDialog from '@/components/admin/PackageDialog';
import { IPTVPackage } from '@/hooks/useIPTVPackages';

const ManageProducts = () => {
  const { data: packages, isLoading } = useIPTVPackages();
  const deletePackage = useDeleteIPTVPackage();
  const updatePackage = useUpdateIPTVPackage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<IPTVPackage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter packages by search term
  const filteredPackages = packages?.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Categorize packages by their display location
  const packagesByLocation = {
    homepage: filteredPackages.filter(pkg => 
      ['subscription', 'player', 'activation-player'].includes(pkg.category) && pkg.status !== 'inactive'
    ),
    subscription: filteredPackages.filter(pkg => 
      pkg.category === 'subscription' && pkg.status !== 'inactive'
    ),
    activation: filteredPackages.filter(pkg => 
      pkg.category === 'activation-player' && pkg.status !== 'inactive'
    ),
    panelReseller: filteredPackages.filter(pkg => 
      ['panel-iptv', 'player'].includes(pkg.category) && pkg.status !== 'inactive'
    ),
    all: filteredPackages
  };

  const handleEdit = (pkg: IPTVPackage) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      deletePackage.mutate(id);
    }
  };

  const handleToggleFeatured = (id: string, featured: boolean) => {
    updatePackage.mutate({
      id,
      status: featured ? 'featured' : 'active'
    });
  };

  const handleCreateNew = () => {
    setSelectedPackage(null);
    setIsDialogOpen(true);
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'homepage': return <Home size={16} />;
      case 'subscription': return <CreditCard size={16} />;
      case 'activation': return <Crown size={16} />;
      case 'panelReseller': return <Monitor size={16} />;
      default: return <Tv size={16} />;
    }
  };

  const getLocationTitle = (location: string) => {
    switch (location) {
      case 'homepage': return 'Home Page Packages';
      case 'subscription': return 'Subscription Page Packages';
      case 'activation': return 'Activation Player Page Packages';
      case 'panelReseller': return 'Panel Reseller Packages';
      default: return 'All Packages';
    }
  };

  const getLocationDescription = (location: string) => {
    switch (location) {
      case 'homepage': return 'Packages displayed on the main homepage (subscription, player, activation)';
      case 'subscription': return 'Packages shown specifically on the subscription page';
      case 'activation': return 'Packages displayed on the activation player page';
      case 'panelReseller': return 'Panel packages for resellers (IPTV panels and player panels)';
      default: return 'All packages in the system';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Manage IPTV Packages</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage IPTV Packages</h1>
          <p className="text-gray-600 mt-2">Organize packages by their display locations</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Package
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search packages by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different locations */}
      <Tabs defaultValue="homepage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="homepage" className="flex items-center gap-2">
            <Home size={16} />
            Home Page
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard size={16} />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="activation" className="flex items-center gap-2">
            <Crown size={16} />
            Activation
          </TabsTrigger>
          <TabsTrigger value="panelReseller" className="flex items-center gap-2">
            <Monitor size={16} />
            Panel Reseller
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Tv size={16} />
            All Packages
          </TabsTrigger>
        </TabsList>

        {Object.entries(packagesByLocation).map(([location, locationPackages]) => (
          <TabsContent key={location} value={location} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {getLocationIcon(location)}
                  <CardTitle>{getLocationTitle(location)}</CardTitle>
                </div>
                <p className="text-sm text-gray-600">
                  {getLocationDescription(location)}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tv size={12} />
                    Total: {locationPackages.length}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Crown size={12} />
                    Featured: {locationPackages.filter(p => p.status === 'featured').length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {locationPackages.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {locationPackages.map((pkg) => (
                      <IPTVPackageCard
                        key={pkg.id}
                        package={pkg}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleFeatured={handleToggleFeatured}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {getLocationIcon(location)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No packages found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm 
                        ? `No packages match your search "${searchTerm}" in this location.`
                        : `No packages are configured for ${getLocationTitle(location).toLowerCase()}.`
                      }
                    </p>
                    <Button onClick={handleCreateNew} variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Package
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Package Dialog */}
      <PackageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        package={selectedPackage}
      />
    </div>
  );
};

export default ManageProducts;
