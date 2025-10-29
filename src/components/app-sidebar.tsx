'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
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
  Settings,
  LogOut,
  Home,
  Building,
  Briefcase,
  Wallet,
  CheckCircle2,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const navItems = {
  'Business Development': [
    { href: '/business-development', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/business-development/clients', label: 'Clients', icon: Users },
    { href: '/business-development/policies', label: 'Policies', icon: FileText },
    { href: '/business-development/claims', label: 'Claims', icon: ShieldAlert },
    { href: '/business-development/reports', label: 'Reports', icon: BarChart3 },
    { href: '/business-development/collections', label: 'Premium Collection', icon: HandCoins },
  ],
  'Premium Administration': [
    { href: '/premium-administration', label: 'Dashboard', icon: Wallet, exact: true },
    { href: '/premium-administration/reconciliation', label: 'Reconciliation', icon: CheckCircle2 },
  ]
};

const departmentIcons = {
    'Business Development': Briefcase,
    'Premium Administration': Building,
}

export default function AppSidebar() {
  const pathname = usePathname();

  const getActiveDepartment = () => {
    if (pathname.startsWith('/business-development')) {
      return 'Business Development';
    }
    if (pathname.startsWith('/premium-administration')) {
      return 'Premium Administration';
    }
    return '';
  }

  const activeDepartment = getActiveDepartment();

  return (
    <Sidebar>
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
        </SidebarMenu>
        <Accordion type="single" collapsible defaultValue={activeDepartment} className="w-full">
            {Object.entries(navItems).map(([department, items]) => {
                const DepartmentIcon = departmentIcons[department as keyof typeof departmentIcons];
                return (
                    <AccordionItem value={department} key={department} className="border-none">
                        <AccordionTrigger className="hover:no-underline text-sidebar-foreground/70 hover:text-sidebar-foreground text-sm font-medium px-2 rounded-md hover:bg-sidebar-accent [&[data-state=open]]:text-sidebar-accent-foreground">
                           <div className="flex items-center gap-2">
                             <DepartmentIcon className="h-4 w-4" />
                             <span>{department}</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-0 pl-4 pt-1">
                             <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        size="sm"
                                        isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
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
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
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
