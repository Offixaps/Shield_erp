import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            SHIELD ERP
          </h1>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/business-development" className="group">
                    <Card className="transition-all hover:border-primary hover:shadow-lg h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                        <span>Business Development</span>
                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </CardTitle>
                        <CardDescription>
                        Access the main dashboard for analytics and client
                        management.
                        </CardDescription>
                    </CardHeader>
                    </Card>
                </Link>
                <Link href="/premium-administration" className="group">
                    <Card className="transition-all hover:border-primary hover:shadow-lg h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                        <span>Premium Administration</span>
                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </CardTitle>
                        <CardDescription>
                        Manage premium collections, reconciliations, and reporting.
                        </CardDescription>
                    </CardHeader>
                    </Card>
                </Link>
                <Link href="/underwriting" className="group">
                    <Card className="transition-all hover:border-primary hover:shadow-lg h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                        <span>Underwriting</span>
                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </CardTitle>
                        <CardDescription>
                        Manage underwriting processes and risk assessment.
                        </CardDescription>
                    </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
      </main>
    </div>
  );
}
