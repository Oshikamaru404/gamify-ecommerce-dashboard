
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Package } from 'lucide-react';
import { useIPTVPackages, useCreateIPTVPackage, useUpdateIPTVPackage, useDeleteIPTVPackage, IPTVPackage } from '@/hooks/useIPTVPackages';
import IPTVPackageCard from '@/components/admin/IPTVPackageCard';
import PackageDialog from '@/components/admin/PackageDialog';
import { toast } from 'sonner';

const ManageProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'subscription' | 'reseller' | 'player'>('all');
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
  
  const handleDeleteClick = (pkg: IPTVPackage) => {
    setPackageToDelete(pkg);
    setDeleteDialogOpen(true);
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

  const handleNewPackage = () => {
    setEditingPackage(null);
    setEditDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">IPTV Package Management</h1>
        <p className="text-muted-foreground">
          Manage your IPTV subscription packages, player licenses, and reseller options.
        </p>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Package Catalog
            </CardTitle>
            <Button onClick={handleNewPackage}>
              <Plus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search packages..."
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
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="player">Player</SelectItem>
                  <SelectItem value="reseller">Reseller</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading packages...</p>
              </div>
            </div>
          ) : filteredPackages.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPackages.map((pkg) => (
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
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                <Package size={28} className="text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No packages found</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                No packages match your current search criteria.
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                  }}
                >
                  Reset Filters
                </Button>
                <Button onClick={handleNewPackage}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Package
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <PackageDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        package={editingPackage}
        onSave={handleSavePackage}
        title={editingPackage ? 'Edit Package' : 'Create New Package'}
      />
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the package "{packageToDelete?.name}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProducts;
