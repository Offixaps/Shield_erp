

import { getPolicyById } from '@/lib/policy-service';
import { notFound } from 'next/navigation';
import ClientDetailsView from '@/components/clients/client-details-view';

export default function ClientDetailsPage({
  params,
  searchParams,
}: {
  params: { clientId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const client = getPolicyById(parseInt(params.clientId, 10));

  if (!client) {
    notFound();
  }

  const from = typeof searchParams.from === 'string' ? searchParams.from : '';

  return <ClientDetailsView client={client} from={from} />;
}
