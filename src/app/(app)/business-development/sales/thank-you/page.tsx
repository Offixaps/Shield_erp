
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function ThankYouPage() {
  const router = useRouter();
  const [countdown, setCountdown] = React.useState(5);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      router.push('/business-development/sales');
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Application Submitted Successfully!</CardTitle>
          <CardDescription>
            Thank you. Your new business application has been submitted and is now pending review by the underwriting team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center text-sm text-muted-foreground">
             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecting to the Sales page in {countdown} seconds...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
