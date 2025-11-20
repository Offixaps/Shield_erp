
'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuSkeleton,
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
  Contact,
  PenSquare,
  HeartPulse,
  Stethoscope,
  Landmark,
  ShieldCheck,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth, db } from '@/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';

const navItemsConfig = {
  'Super Admin': {
    'Business Development': [
      { href: '/business-development', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/business-development/sales', label: 'Sales', icon: Briefcase },
      { href: '/business-development/clients', label: 'Clients', icon: Users },
      { href: '/business-development/advisors', label: 'Advisors', icon: Contact },
      { href: '/business-development/policies', label: 'Policies', icon: FileText },
      { href: '/business-development/claims', label: 'Claims', icon: ShieldAlert },
      { href: '/business-development/reports', label: 'Reports', icon: BarChart3 },
    ],
    'Premium Administration': [
      { href: '/premium-administration', label: 'Dashboard', icon: Wallet, exact: true },
      { href: '/premium-administration/new-business', label: 'New Business', icon: Briefcase },
      { href: '/premium-administration/collections', label: 'Premium Collection', icon: HandCoins },
      { href: '/premium-administration/reconciliation', label: 'Reconciliation', icon: CheckCircle2 },
    ],
    'Underwriting': [
      { href: '/underwriting', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/underwriting/new-business', label: 'New Business', icon: Briefcase },
      { href: '/underwriting/all-policies', label: 'All Policies', icon: FileText },
      { href: '/underwriting/mandates', label: 'Mandates', icon: FileText },
      { href: '/underwriting/occupational', label: 'Occupational', icon: Briefcase },
      { href: '/underwriting/lifestyle', label: 'Lifestyle', icon: HeartPulse },
      { href: '/underwriting/medicals', label: 'Medicals', icon: Stethoscope },
      { href: '/underwriting/financial', label: 'Financial', icon: Landmark },
      { href: '/underwriting/claims', label: 'Claims', icon: ShieldAlert },
    ],
    'General': [
      { href: '/staff', label: 'Staff Members', icon: Users },
      { href: '/roles', label: 'Roles & Permissions', icon: ShieldCheck },
    ]
  },
  'Administrator': {
    'Business Development': [
      { href: '/business-development', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/business-development/sales', label: 'Sales', icon: Briefcase },
      { href: '/business-development/clients', label: 'Clients', icon: Users },
      { href: '/business-development/policies', label: 'Policies', icon: FileText },
    ],
    'Premium Administration': [
      { href: '/premium-administration', label: 'Dashboard', icon: Wallet, exact: true },
      { href: '/premium-administration/new-business', label: 'New Business', icon: Briefcase },
      { href: '/premium-administration/collections', label: 'Premium Collection', icon: HandCoins },
    ],
     'Underwriting': [
      { href: '/underwriting', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/underwriting/new-business', label: 'New Business', icon: Briefcase },
      { href: '/underwriting/all-policies', label: 'All Policies', icon: FileText },
      { href: '/underwriting/mandates', label: 'Mandates', icon: FileText },
    ],
     'General': [
      { href: '/staff', label: 'Staff Members', icon: Users },
      { href: '/roles', label: 'Roles & Permissions', icon: ShieldCheck },
    ]
  },
  'Business Development': {
    'Business Development': [
      { href: '/business-development', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/business-development/sales', label: 'Sales', icon: Briefcase },
      { href: '/business-development/clients', label: 'Clients', icon: Users },
      { href: '/business-development/policies', label: 'Policies', icon: FileText },
    ]
  },
  'Premium Administration': {
    'Premium Administration': [
      { href: '/premium-administration', label: 'Dashboard', icon: Wallet, exact: true },
      { href: '/premium-administration/new-business', label: 'New Business', icon: Briefcase },
      { href: '/premium-administration/collections', label: 'Premium Collection', icon: HandCoins },
    ]
  },
  'Underwriting': {
    'Underwriting': [
      { href: '/underwriting', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/underwriting/new-business', label: 'New Business', icon: Briefcase },
      { href: '/underwriting/all-policies', label: 'All Policies', icon: FileText },
      { href: '/underwriting/mandates', label: 'Mandates', icon: FileText },
    ]
  }
};

const departmentIcons = {
    'Business Development': Briefcase,
    'Premium Administration': Building,
    'Underwriting': PenSquare,
    'General': Settings
}

function AppSidebarHeader() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuSkeleton showIcon />
            </SidebarMenu>
        </SidebarHeader>
    )
  }

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === '/select-department'} tooltip="Home">
            <Link href="/select-department">
              <Home />
              <span>Home</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOutUser } = useAuth();
  const [navItems, setNavItems] = React.useState<any>(null);
  const [isSuperAdmin, setIsSuperAdmin] = React.useState(false);
  
  React.useEffect(() => {
      const fetchUserData = async () => {
          if (user) {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              if (userDoc.exists()) {
                  const userData = userDoc.data();
                  const role = userData.role;
                  const department = userData.department;

                  setIsSuperAdmin(role === 'Super Admin');
                  
                  if (role === 'Super Admin') {
                      setNavItems(navItemsConfig['Super Admin']);
                  } else if (role === 'Administrator') {
                      setNavItems(navItemsConfig['Administrator']);
                  } else if (department && navItemsConfig[department as keyof typeof navItemsConfig]) {
                      setNavItems(navItemsConfig[department as keyof typeof navItemsConfig]);
                  }
              }
          }
      };
      fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    await signOutUser();
    router.push('/login');
  };

  const getActiveDepartment = () => {
    if (pathname.startsWith('/business-development')) return 'Business Development';
    if (pathname.startsWith('/premium-administration')) return 'Premium Administration';
    if (pathname.startsWith('/underwriting')) return 'Underwriting';
    if (pathname.startsWith('/staff') || pathname.startsWith('/roles')) return 'General';
    if (navItems && Object.keys(navItems).length > 0) {
      return Object.keys(navItems)[0];
    }
    return null;
  }

  const activeDepartment = getActiveDepartment();
  
  const renderContent = () => {
    if (!navItems) {
        return (
             <div className="p-2 space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        )
    }

    return (
        <Accordion type="single" collapsible defaultValue={activeDepartment || Object.keys(navItems)[0]} className="w-full">
            {Object.entries(navItems).map(([department, items]) => {
                const DepartmentIcon = departmentIcons[department as keyof typeof departmentIcons];
                if (!items) return null;
                return (
                    <AccordionItem value={department} key={department} className="border-none">
                        <AccordionTrigger className="hover:no-underline text-sidebar-foreground/70 hover:text-sidebar-foreground text-sm font-medium px-2 rounded-md hover:bg-sidebar-accent [&[data-state=open]]:text-sidebar-accent-foreground">
                           <div className="flex items-center gap-2">
                             {DepartmentIcon && <DepartmentIcon className="h-4 w-4" />}
                             <span>{department}</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-0 pl-4 pt-1">
                             <SidebarMenu>
                                {(items as any[]).map((item) => (
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
    )
  }

  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        {renderContent()}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {isSuperAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
