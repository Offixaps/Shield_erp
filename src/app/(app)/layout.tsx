
'use client';

import * as React from 'react';
import { SidebarProvider, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import AppHeader from '@/components/app-header';
import { useAuth, db } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';


const departmentAccess: Record<string, string[]> = {
    '/business-development': ['Business Development', 'Administrator', 'Super Admin'],
    '/premium-administration': ['Premium Administration', 'Administrator', 'Super Admin'],
    '/underwriting': ['Underwriting', 'Administrator', 'Super Admin'],
    '/staff': ['Administrator', 'Super Admin'],
    '/roles': ['Administrator', 'Super Admin'],
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    } else if (user) {
        const checkPermissions = async () => {
            const userDocRef = doc(db, 'users', user.uid);
            try {
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const userDepartment = userData.department;
                    const userRole = userData.role;

                    // Super Admins should bypass department checks
                    if (userRole === 'Super Admin') {
                        return; 
                    }

                    const requiredDepartments = Object.entries(departmentAccess).find(
                        ([path]) => pathname.startsWith(path)
                    )?.[1];
                    
                    if (requiredDepartments && !requiredDepartments.includes(userDepartment) && !requiredDepartments.includes(userRole)) {
                         router.replace('/select-department'); 
                    }

                } else {
                     router.replace('/login');
                }
            } catch (error) {
                console.error("Error fetching user document:", error);
                // Optionally handle error, e.g., redirect to login
                router.replace('/login');
            }
        };
        checkPermissions();
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarRail />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
