import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, SidebarHeader, SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Package, Calendar, Key, Receipt, Ticket, Gift,
  User, Shield, Bell, Link2, Bookmark, AlertTriangle, LogOut, Home,
} from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';

const groups = [
  {
    label: 'Account',
    items: [
      { title: 'Dashboard', url: '/account', icon: LayoutDashboard, exact: true, color: 'text-red-600' },
      { title: 'My Orders', url: '/account/orders', icon: Package, color: 'text-orange-600' },
      { title: 'My Subscriptions', url: '/account/subscriptions', icon: Calendar, color: 'text-emerald-600' },
      { title: 'Activations', url: '/account/activations', icon: Key, color: 'text-blue-600' },
    ],
  },
  {
    label: 'Wallet',
    items: [
      { title: 'Payment History', url: '/account/payments', icon: Receipt, color: 'text-purple-600' },
      { title: 'Coupons', url: '/account/coupons', icon: Ticket, soon: true, color: 'text-pink-600' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { title: 'Affiliate Program', url: '/account/affiliate', icon: Gift, soon: true, color: 'text-amber-600' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { title: 'Profile', url: '/account/settings/profile', icon: User, color: 'text-slate-600' },
      { title: 'Security', url: '/account/settings/security', icon: Shield, color: 'text-slate-600' },
      { title: 'Notifications', url: '/account/settings/notifications', icon: Bell, soon: true, color: 'text-slate-600' },
      { title: 'Linked Accounts', url: '/account/settings/linked', icon: Link2, color: 'text-slate-600' },
      { title: 'Saved Profiles', url: '/account/settings/saved-profiles', icon: Bookmark, color: 'text-slate-600' },
      { title: 'Danger Zone', url: '/account/settings/danger', icon: AlertTriangle, color: 'text-red-600' },
    ],
  },
];

export const AccountSidebar: React.FC = () => {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === 'collapsed';
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useUserAuth();

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + '/');

  const initial = (profile?.display_name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-red-100 bg-gradient-to-br from-red-600 via-red-500 to-red-600 text-white">
        <div className="flex items-center gap-3 p-3">
          <Avatar className="h-10 w-10 ring-2 ring-white/40 shadow-lg">
            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
            <AvatarFallback className="bg-white text-red-600 font-bold">{initial}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold truncate">{profile?.display_name || 'My Account'}</div>
              <div className="text-[11px] text-white/80 truncate">{user?.email}</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-background to-red-50/30">
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && <SidebarGroupLabel className="text-red-600 font-bold uppercase tracking-wider text-[10px]">{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(item.url, (item as any).exact);
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className={cn(
                          'transition-all',
                          active && 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:text-white shadow-md font-semibold'
                        )}
                      >
                        <NavLink to={item.url} onClick={() => setOpenMobile(false)} className="flex items-center gap-2">
                          <item.icon className={cn('h-4 w-4 shrink-0', active ? 'text-white' : item.color)} />
                          {!collapsed && (
                            <span className="flex-1 flex items-center justify-between">
                              <span>{item.title}</span>
                              {(item as any).soon && (
                                <span className={cn('text-[9px] uppercase font-bold px-1.5 py-0.5 rounded',
                                  active ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700')}>soon</span>
                              )}
                            </span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-red-100 p-2 space-y-1 bg-background">
        <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-red-50 hover:text-red-600" onClick={() => navigate('/')}>
          <Home className="h-4 w-4 mr-2" /> {!collapsed && 'Back to store'}
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => { signOut(); navigate('/'); }}>
          <LogOut className="h-4 w-4 mr-2" /> {!collapsed && 'Logout'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AccountSidebar;
