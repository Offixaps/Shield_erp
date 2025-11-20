
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth, db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';


type DepartmentCardProps = {
    href: string;
    title: string;
    description: string;
};

function DepartmentCard({ href, title, description }: DepartmentCardProps) {
    return (
        <Link href={href} className="group">
            <Card className="transition-all hover:border-primary hover:shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{title}</span>
                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
            </Card>
        </Link>
    );
}

export default function DepartmentSelectionPage() {
    const { user } = useAuth();
    const [userRole, setUserRole] = React.useState<string | null>(null);
    const [userDepartment, setUserDepartment] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserRole(data.role);
                    setUserDepartment(data.department);
                } else {
                    // This could happen if a user is authenticated but has no profile document
                    router.push('/login');
                }
            };
            fetchUserData();
        }
    }, [user, router]);
    
    const renderDepartmentCards = () => {
        if (!userRole) {
            return (
                <div className="text-center text-muted-foreground">Loading departments...</div>
            );
        }
        
        const allDepartments = [
            { href: "/business-development", title: "Business Development", description: "Access the main dashboard for analytics and client management." },
            { href: "/premium-administration", title: "Premium Administration", description: "Manage premium collections, reconciliations, and reporting." },
            { href: "/underwriting", title: "Underwriting", description: "Manage underwriting processes and risk assessment." }
        ];

        if (userRole === 'Super Admin' || userRole === 'Administrator') {
            return (
                <>
                    {allDepartments.map(dept => <DepartmentCard key={dept.href} {...dept} />)}
                </>
            );
        }
        
        const userDeptCardInfo = allDepartments.find(d => d.title === userDepartment);

        return userDeptCardInfo ? <DepartmentCard {...userDeptCardInfo} /> : <p className="text-center text-muted-foreground">No department assigned or access denied.</p>;
    }


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Image src="/Shield app logo.svg" alt="SHIELD ERP Logo" width={28} height={28} className="h-7 w-7" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            SHIELD ERP
          </h1>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8">
            <div className="flex justify-center">
              <div className="relative h-16 w-48">
                <Image
                    src="/logo - light.svg"
                    alt="SHIELD ERP Logo"
                    fill
                    className="object-contain dark:hidden"
                    priority
                />
                 <Image
                    src="/logo - dark.svg"
                    alt="SHIELD ERP Logo"
                    fill
                    className="object-contain hidden dark:block"
                    priority
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderDepartmentCards()}
            </div>
        </div>
      </main>
    </div>
  );
}
