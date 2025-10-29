import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { newBusinessData } from '@/lib/data';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
  );
}

export default function ClientDetailsPage({
  params,
}: {
  params: { clientId: string };
}) {
  const client = newBusinessData.find(
    (item) => item.id.toString() === params.clientId
  );

  if (!client) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={client.client}
        description={`Policy #${client.policy}`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Client and Policy Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailItem label="Client Name" value={client.client} />
                        <DetailItem label="Product" value={client.product} />
                        <DetailItem label="Premium" value={`GHS ${client.premium.toFixed(2)}`} />
                        <DetailItem label="Commencement Date" value={format(new Date(client.commencementDate), 'PPP')} />
                         <DetailItem label="Status" value={client.status} />
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <DetailItem label="Email" value="j.doe@example.com" />
                     <DetailItem label="Phone Number" value="024 123 4567" />
                     <DetailItem label="Address" value="123 Main St, Accra" />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
