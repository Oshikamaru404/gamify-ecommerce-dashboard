import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Package, Tv, Edit } from 'lucide-react';
import { useIPTVPackages, useCreateIPTVPackage, useUpdateIPTVPackage, useDeleteIPTVPackage, IPTVPackage } from '@/hooks/useIPTVPackages';
import IPTVPackageCard from '@/components/admin/IPTVPackageCard';
import PackageDialog from '@/components/admin/PackageDialog';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const ManageProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'subscription' | 'reseller' | 'player' | 'panel-iptv' | 'activation-player'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<IPTVPackage | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<IPTVPackage | null>(null);
  
  const { data: packages, isLoading } = useIPTVPackages();
  const createPackage = useCreateIPTVPackage();
  const updatePackage = useUpdateIPTVPackage();
  const deletePackage = useDeleteIPTVPackage();
  
  // Filter packages based on search term and category filter
  const filteredPackages = packages?.filter((pkg) => {
    const matchesSearch = 
      searchTerm === '' || 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pkg.features && pkg.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = categoryFilter === 'all' || pkg.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }) || [];

  // Group packages by category for better organization
  const packagesByCategory = {
    subscription: filteredPackages.filter(pkg => pkg.category === 'subscription'),
    reseller: filteredPackages.filter(pkg => pkg.category === 'reseller'),
    player: filteredPackages.filter(pkg => pkg.category === 'player'),
    'panel-iptv': filteredPackages.filter(pkg => pkg.category === 'panel-iptv'),
    'activation-player': filteredPackages.filter(pkg => pkg.category === 'activation-player'),
  };
  
  const handleDeleteClick = (id: string) => {
    const packageToDelete = packages?.find(pkg => pkg.id === id);
    if (packageToDelete) {
      setPackageToDelete(packageToDelete);
      setDeleteDialogOpen(true);
    }
  };
  
  const confirmDelete = () => {
    if (packageToDelete) {
      deletePackage.mutate(packageToDelete.id);
      setDeleteDialogOpen(false);
      setPackageToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setPackageToDelete(null);
  };

  const handleEdit = (pkg: IPTVPackage) => {
    setEditingPackage(pkg);
    setEditDialogOpen(true);
  };

  const handleToggleFeatured = (id: string, featured: boolean) => {
    updatePackage.mutate({
      id,
      status: featured ? 'featured' : 'active'
    });
  };

  const handleSavePackage = (packageData: Omit<IPTVPackage, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingPackage) {
      updatePackage.mutate({ 
        id: editingPackage.id, 
        ...packageData 
      });
    } else {
      createPackage.mutate(packageData);
    }
    setEditDialogOpen(false);
    setEditingPackage(null);
  };

  const handleNewPackage = (category?: string) => {
    setEditingPackage(null);
    if (category) {
      // Pre-set the category when creating from a specific tab
      setEditDialogOpen(true);
    } else {
      setEditDialogOpen(true);
    }
  };

  const renderPackageGrid = (packages: IPTVPackage[], emptyMessage: string) => (
    packages.length > 0 ? (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <IPTVPackageCard
            key={pkg.id}
            package={pkg}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onToggleFeatured={handleToggleFeatured}
          />
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <Tv size={28} className="text-red-600" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">{emptyMessage}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Start building your catalog by adding packages.
        </p>
        <Button onClick={() => handleNewPackage()} className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Package
        </Button>
      </div>
    )
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">
            Manage your IPTV packages and traditional products from one place.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/products/new">
              <Edit className="mr-2 h-4 w-4" />
              Add Traditional Product
            </Link>
          </Button>
          <Button onClick={() => handleNewPackage()} className="bg-red-600 hover:bg-red-700">
            <Plus className="mr-2 h-4 w-4" />
            Add IPTV Package
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="iptv-packages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="iptv-packages" className="flex items-center gap-2">
            <Tv className="h-4 w-4" />
            IPTV Packages
          </TabsTrigger>
          <TabsTrigger value="traditional-products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Traditional Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value="iptv-packages" className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
              <CardTitle className="flex items-center gap-2">
                <Tv className="h-5 w-5 text-red-600" />
                IPTV Package Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search IPTV packages, features, descriptions..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Select 
                    value={categoryFilter} 
                    onValueChange={(value) => setCategoryFilter(value as any)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="subscription">Subscriptions</SelectItem>
                      <SelectItem value="player">Player Licenses</SelectItem>
                      <SelectItem value="reseller">Reseller Packages</SelectItem>
                      <SelectItem value="panel-iptv">Panel IPTV</SelectItem>
                      <SelectItem value="activation-player">Activation Player</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading IPTV packages...</p>
                  </div>
                </div>
              ) : categoryFilter === 'all' ? (
                <Tabs defaultValue="subscription" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="subscription">
                      Subscriptions ({packagesByCategory.subscription.length})
                    </TabsTrigger>
                    <TabsTrigger value="reseller">
                      Reseller ({packagesByCategory.reseller.length})
                    </TabsTrigger>
                    <TabsTrigger value="player">
                      Player ({packagesByCategory.player.length})
                    </TabsTrigger>
                    <TabsTrigger value="panel-iptv">
                      Panel IPTV ({packagesByCategory['panel-iptv'].length})
                    </TabsTrigger>
                    <TabsTrigger value="activation-player">
                      Activation ({packagesByCategory['activation-player'].length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="subscription">
                    {renderPackageGrid(packagesByCategory.subscription, "No subscription packages found")}
                  </TabsContent>

                  <TabsContent value="reseller">
                    {renderPackageGrid(packagesByCategory.reseller, "No reseller packages found")}
                  </TabsContent>

                  <TabsContent value="player">
                    {renderPackageGrid(packagesByCategory.player, "No player packages found")}
                  </TabsContent>

                  <TabsContent value="panel-iptv">
                    {renderPackageGrid(packagesByCategory['panel-iptv'], "No panel IPTV packages found")}
                  </TabsContent>

                  <TabsContent value="activation-player">
                    {renderPackageGrid(packagesByCategory['activation-player'], "No activation player packages found")}
                  </TabsContent>
                </Tabs>
              ) : (
                renderPackageGrid(filteredPackages, `No ${categoryFilter} packages found`)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traditional-products">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Traditional Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Traditional Product Management</h3>
                <p className="text-muted-foreground mb-4">
                  Manage your traditional products (games, software, etc.) here.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/admin/products">
                    <Edit className="mr-2 h-4 w-4" />
                    Go to Products Manager
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <PackageDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        package={editingPackage}
        onSave={handleSavePackage}
        title={editingPackage ? 'Edit IPTV Package' : 'Create New IPTV Package'}
      />
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Package Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the IPTV package "{packageToDelete?.name}"? 
              This action cannot be undone and will remove the package from your catalog.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProducts;
