'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldAlert,
  BarChart3,
  HandCoins,
  Shield,
  Settings,
  LogOut,
  Home,
} from 'lucide-react';

const navItems = [
  { href: '/business-development', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/policies', label: 'Policies', icon: FileText },
  { href: '/claims', label: 'Claims', icon: ShieldAlert },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/collections', label: 'Premium Collection', icon: HandCoins },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="hidden md:flex md:items-center md:gap-2">
        {/* Header content for larger screens if needed */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
           <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Home">
                <Link href="/">
                  <Home />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
