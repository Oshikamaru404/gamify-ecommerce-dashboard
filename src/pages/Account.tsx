import React from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Link, Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package, LogOut } from 'lucide-react';
import StoreLayout from '@/components/store/StoreLayout';

const Account: React.FC = () => {
  const { user, profile, loading, signOut } = useUserAuth();

  if (loading) return <StoreLayout><div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div></StoreLayout>;
  if (!user) return <Navigate to="/" replace />;

  return (
    <StoreLayout>
      <div className="container py-10 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-muted-foreground">Welcome, {profile?.display_name || user.email}</p>
          </div>
          <Button variant="outline" onClick={signOut}><LogOut className="h-4 w-4 mr-2" /> Logout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <Package className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold">My Orders</h3>
            <p className="text-sm text-muted-foreground mb-3">View order history</p>
            <Button asChild variant="link" className="p-0"><Link to="/account/orders">View →</Link></Button>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold">My Subscriptions</h3>
            <p className="text-sm text-muted-foreground">Coming soon</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold">Settings</h3>
            <p className="text-sm text-muted-foreground">Coming soon</p>
          </Card>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Account;
