
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Trash2, RotateCcw, Database, Plus } from 'lucide-react';
import { deleteAllPublishedFeedback, resetProductSales } from '@/lib/adminUtils';
import { seedOrders } from '@/lib/seedOrders';
import { useToast } from '@/hooks/use-toast';

const AdminUtilities = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const handleDeleteFeedback = async () => {
    if (!confirm('Are you sure you want to delete ALL published feedback? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const deletedCount = await deleteAllPublishedFeedback();
      toast({
        title: 'Success',
        description: `Deleted ${deletedCount} published feedback entries`,
      });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete published feedback',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetSales = async () => {
    if (!confirm('Are you sure you want to reset all product sales to zero? This action cannot be undone.')) {
      return;
    }

    setIsResetting(true);
    try {
      const resetCount = await resetProductSales();
      toast({
        title: 'Success',
        description: `Reset ${resetCount} sales metrics to zero`,
      });
    } catch (error) {
      console.error('Error resetting sales:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset product sales',
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleSeedOrders = async () => {
    if (!confirm('Do you want to add sample orders to the database? This will only add orders if none exist.')) {
      return;
    }

    setIsSeeding(true);
    try {
      const seedCount = await seedOrders();
      if (seedCount > 0) {
        toast({
          title: 'Success',
          description: `Added ${seedCount} sample orders to the database`,
        });
      } else {
        toast({
          title: 'Info',
          description: 'Orders already exist in the database',
        });
      }
    } catch (error) {
      console.error('Error seeding orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to seed sample orders',
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card className="border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Database className="h-5 w-5" />
          Admin Utilities
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              These actions are irreversible. Use with caution.
            </span>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Delete Published Feedback</h4>
              <p className="text-sm text-gray-600">
                Remove all approved feedback from the database.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteFeedback}
                disabled={isDeleting}
                className="w-full"
              >
                {isDeleting ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete All Feedback
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Reset Product Sales</h4>
              <p className="text-sm text-gray-600">
                Reset all sales metrics to zero.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleResetSales}
                disabled={isResetting}
                className="w-full"
              >
                {isResetting ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Sales
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Seed Sample Orders</h4>
              <p className="text-sm text-gray-600">
                Add sample orders if database is empty.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSeedOrders}
                disabled={isSeeding}
                className="w-full border-green-200 text-green-700 hover:bg-green-50"
              >
                {isSeeding ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Sample Orders
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUtilities;
