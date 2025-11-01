
'use client';

import * as React from 'react';
import { getPolicyById } from '@/lib/policy-service';
import { notFound, useSearchParams, useParams } from 'next/navigation';
import ClientDetailsView from '@/components/clients/client-details-view';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const [client, setClient] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const clientId = params.clientId;
    if (typeof clientId === 'string') {
        const fetchedClient = getPolicyById(parseInt(clientId, 10));
        if (fetchedClient) {
            setClient(fetchedClient);
        }
        setLoading(false);
    }
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
  
  if (!client) {
    notFound();
  }

  const from = searchParams.get('from') || '';
  const tab = searchParams.get('tab') || 'overview';

  return <ClientDetailsView client={client} from={from} defaultTab={tab} />;
}
