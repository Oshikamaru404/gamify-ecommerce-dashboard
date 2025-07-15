
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Tv, Monitor, Crown, GamepadIcon } from 'lucide-react';
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

  // Categorize packages exactly as they appear on the website
  // Subscription packages: month-based subscription system (category 'subscription')
  // Panel IPTV packages: credit-based system (category 'panel-iptv') 
  // Panel Player packages: for streaming applications (category 'player')
  // Activation packages: month-based subscription system for device activation (category 'activation-player')
  const packagesByCategory = {
    subscription: filteredPackages.filter(pkg => 
      pkg.category === 'subscription' && pkg.status !== 'inactive'
    ),
    panelIptv: filteredPackages.filter(pkg => 
      pkg.category === 'panel-iptv' && pkg.status !== 'inactive'
    ),
    panelPlayer: filteredPackages.filter(pkg => 
      pkg.category === 'player' && pkg.status !== 'inactive'
    ),
    activationPlayer: filteredPackages.filter(pkg => 
      pkg.category === 'activation-player' && pkg.status !== 'inactive'
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'subscription': return <Tv size={16} />;
      case 'panelIptv': return <Monitor size={16} />;
      case 'panelPlayer': return <GamepadIcon size={16} />;
      case 'activationPlayer': return <Crown size={16} />;
      default: return <Tv size={16} />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'subscription': return 'Subscription Packages';
      case 'panelIptv': return 'Panel IPTV Packages';
      case 'panelPlayer': return 'Panel Player Packages';
      case 'activationPlayer': return 'Activation Player Packages';
      default: return 'All Packages';
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'subscription': return 'Month-based subscription packages displayed on home page and subscription page';
      case 'panelIptv': return 'Credit-based IPTV panel packages for resellers and advanced users';
      case 'panelPlayer': return 'Panel player packages for streaming applications (1 credit = 12 months, 2 credits = lifetime activation)';
      case 'activationPlayer': return 'Month-based subscription packages for device activation and player setup';
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
          <p className="text-gray-600 mt-2">Manage packages by category as they appear on the website</p>
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

      {/* Tabs for different categories - exactly as on website */}
      <Tabs defaultValue="subscription" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <Tv size={16} />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="panelIptv" className="flex items-center gap-2">
            <Monitor size={16} />
            Panel IPTV
          </TabsTrigger>
          <TabsTrigger value="panelPlayer" className="flex items-center gap-2">
            <GamepadIcon size={16} />
            Panel Player
          </TabsTrigger>
          <TabsTrigger value="activationPlayer" className="flex items-center gap-2">
            <Crown size={16} />
            Activation Player
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Tv size={16} />
            All Packages
          </TabsTrigger>
        </TabsList>

        {Object.entries(packagesByCategory).map(([category, categoryPackages]) => (
          <TabsContent key={category} value={category} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category)}
                  <CardTitle>{getCategoryTitle(category)}</CardTitle>
                </div>
                <p className="text-sm text-gray-600">
                  {getCategoryDescription(category)}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tv size={12} />
                    Total: {categoryPackages.length}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Crown size={12} />
                    Featured: {categoryPackages.filter(p => p.status === 'featured').length}
                  </Badge>
                  {(category === 'subscription' || category === 'activationPlayer') && (
                    <Badge className="bg-blue-100 text-blue-700">
                      Month-based System
                    </Badge>
                  )}
                  {category === 'panelIptv' && (
                    <Badge className="bg-green-100 text-green-700">
                      Credit-based System
                    </Badge>
                  )}
                  {category === 'panelPlayer' && (
                    <Badge className="bg-purple-100 text-purple-700">
                      Panel Player System (1 credit = 12 months, 2 credits = lifetime)
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {categoryPackages.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categoryPackages.map((pkg) => (
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
                      {getCategoryIcon(category)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No packages found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm 
                        ? `No packages match your search "${searchTerm}" in this category.`
                        : `No packages are configured for ${getCategoryTitle(category).toLowerCase()}.`
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
