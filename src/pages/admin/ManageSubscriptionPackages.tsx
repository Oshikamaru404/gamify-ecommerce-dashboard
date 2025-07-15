
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, CreditCard, Crown, Settings } from 'lucide-react';
import { useSubscriptionPackages, useDeleteSubscriptionPackage, useUpdateSubscriptionPackage, SubscriptionPackage } from '@/hooks/useSubscriptionPackages';
import SubscriptionPackageCard from '@/components/admin/SubscriptionPackageCard';
import SubscriptionPackageDialog from '@/components/admin/SubscriptionPackageDialog';

const ManageSubscriptionPackages = () => {
  const { data: packages, isLoading } = useSubscriptionPackages();
  const deletePackage = useDeleteSubscriptionPackage();
  const updatePackage = useUpdateSubscriptionPackage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter packages by search term
  const filteredPackages = packages?.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (pkg: SubscriptionPackage) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription package?')) {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Manage Subscription Packages</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Subscription Packages</h1>
          <p className="text-gray-600 mt-2">Manage subscription packages with dynamic credit options</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Subscription Package
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search subscription packages by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscription Packages Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-red-500" />
            <CardTitle>Subscription Packages</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Credit-based subscription packages with flexible, configurable pricing options
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline" className="flex items-center gap-1">
              <CreditCard size={12} />
              Total: {filteredPackages.length}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Crown size={12} />
              Featured: {filteredPackages.filter(p => p.status === 'featured').length}
            </Badge>
            <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
              <Settings size={12} />
              Dynamic Credit System
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPackages.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPackages.map((pkg) => (
                <SubscriptionPackageCard
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
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No subscription packages found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? `No packages match your search "${searchTerm}".`
                  : 'No subscription packages are configured yet.'
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

      {/* Package Dialog */}
      <SubscriptionPackageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        package={selectedPackage}
      />
    </div>
  );
};

export default ManageSubscriptionPackages;
