import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, SidebarHeader, SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, Package, Calendar, Key, Receipt, Ticket, Gift,
  User, Shield, Bell, Link2, Bookmark, AlertTriangle, LogOut, Home,
} from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';

const groups = [
  {
    label: 'Account',
    items: [
      { title: 'Dashboard', url: '/account', icon: LayoutDashboard, exact: true },
      { title: 'My Orders', url: '/account/orders', icon: Package },
      { title: 'My Subscriptions', url: '/account/subscriptions', icon: Calendar },
      { title: 'Activations', url: '/account/activations', icon: Key },
    ],
  },
  {
    label: 'Wallet',
    items: [
      { title: 'Payment History', url: '/account/payments', icon: Receipt },
      { title: 'Coupons', url: '/account/coupons', icon: Ticket, soon: true },
    ],
  },
  {
    label: 'Growth',
    items: [
      { title: 'Affiliate Program', url: '/account/affiliate', icon: Gift, soon: true },
    ],
  },
  {
    label: 'Settings',
    items: [
      { title: 'Profile', url: '/account/settings/profile', icon: User },
      { title: 'Security', url: '/account/settings/security', icon: Shield },
      { title: 'Notifications', url: '/account/settings/notifications', icon: Bell, soon: true },
      { title: 'Linked Accounts', url: '/account/settings/linked', icon: Link2 },
      { title: 'Saved Profiles', url: '/account/settings/saved-profiles', icon: Bookmark },
      { title: 'Danger Zone', url: '/account/settings/danger', icon: AlertTriangle },
    ],
  },
];

export const AccountSidebar: React.FC = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useUserAuth();

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + '/');

  const initial = (profile?.display_name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-9 w-9">
            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{profile?.display_name || 'My Account'}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url, (item as any).exact)}>
                      <NavLink to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <span className="flex-1 flex items-center justify-between">
                            <span>{item.title}</span>
                            {(item as any).soon && (
                              <span className="text-[10px] uppercase bg-muted text-muted-foreground px-1.5 py-0.5 rounded">soon</span>
                            )}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-2 space-y-1">
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/')}>
          <Home className="h-4 w-4 mr-2" /> {!collapsed && 'Back to store'}
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => { signOut(); navigate('/'); }}>
          <LogOut className="h-4 w-4 mr-2" /> {!collapsed && 'Logout'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AccountSidebar;
