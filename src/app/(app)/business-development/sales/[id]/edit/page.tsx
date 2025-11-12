
'use client';

import * as React from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import NewBusinessForm from '@/components/clients/new-business-form';
import { getPolicyById } from '@/lib/policy-service';
import { notFound, useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye } from 'lucide-react';

export default function EditBusinessPage() {
  const params = useParams();
  const [client, setClient] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const clientId = params.id;
    if (typeof clientId === 'string') {
        const fetchedClient = getPolicyById(parseInt(clientId, 10));
        if (fetchedClient) {
            setClient(fetchedClient);
        }
        setLoading(false);
    }
  }, [params.id]);


  if (loading) {
    return (
        <div className="flex flex-col gap-6">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-96 w-full" />
        </div>
    )
  }
  
  if (!client) {
    notFound();
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader
            title={`Edit Policy for ${client.client}`}
            description="Update policy details across the different sections."
        />
        <Button asChild>
            <Link href={`/business-development/clients/${params.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Client Details
            </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <NewBusinessForm businessId={params.id as string} />
        </CardContent>
      </Card>
    </div>
  );
}
