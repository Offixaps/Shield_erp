
'use client';

import * as React from 'react';
import { getPolicyById } from '@/lib/policy-service';
import { notFound, useParams } from 'next/navigation';
import ClientDetailsView from '@/components/clients/client-details-view';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import type { NewBusiness } from '@/lib/data';

export default function ClientDetailsPage() {
  const params = useParams();
  
  const [client, setClient] = React.useState<NewBusiness | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientId = params.clientId;
        if (typeof clientId === 'string') {
          const fetchedClient = await getPolicyById(clientId);
          if (fetchedClient) {
            setClient(fetchedClient);
          }
          // If not fetched, it will be handled by the notFound() call after loading
        }
      } catch (err: any) {
        console.error("Failed to fetch client:", err);
        setError(err.message || 'An unexpected error occurred while fetching the policy data.');
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [params.clientId]);


  if (loading) {
    return (
        <div className="flex flex-col gap-6">
            <Skeleton className="h-10 w-1/2" />
            <div className="flex gap-4">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-8 w-36" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Policy</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (!client) {
    notFound();
  }

  const from = new URLSearchParams(window.location.search).get('from') || '';
  const tab = new URLSearchParams(window.location.search).get('tab') || 'overview';

  return <ClientDetailsView client={client} from={from} defaultTab={tab} />;
}
