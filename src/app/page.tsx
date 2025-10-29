import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-4">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground">
          SHIELD ERP
        </h1>
        <Link href="/dashboard" className="group">
          <Card className="hover:border-primary hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Business Development</span>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardTitle>
              <CardDescription>
                Access the main dashboard for analytics and client management.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
