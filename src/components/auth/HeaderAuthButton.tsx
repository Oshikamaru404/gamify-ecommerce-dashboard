import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogIn, LogOut, LayoutDashboard, Package, Settings } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import AuthDialog from './AuthDialog';

export const HeaderAuthButton: React.FC = () => {
  const { user, profile, signOut, loading } = useUserAuth();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  if (loading) return null;

  if (!user) {
    return (
      <>
        <div className="hidden sm:flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => { setTab('login'); setOpen(true); }}>
            <LogIn className="h-4 w-4 mr-1" /> Login
          </Button>
          <Button size="sm" onClick={() => { setTab('signup'); setOpen(true); }}>
            Sign Up
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => { setTab('login'); setOpen(true); }}>
          <User className="h-5 w-5" />
        </Button>
        <AuthDialog open={open} onOpenChange={setOpen} defaultTab={tab} />
      </>
    );
  }

  const initial = (profile?.display_name || user.email || '?').charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background z-[100]">
        <DropdownMenuLabel>
          <div className="text-sm font-medium truncate">{profile?.display_name || user.email}</div>
          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/account')}>
          <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/account/orders')}>
          <Package className="h-4 w-4 mr-2" /> My Orders
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/account/settings')}>
          <Settings className="h-4 w-4 mr-2" /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { signOut(); navigate('/'); }}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderAuthButton;
