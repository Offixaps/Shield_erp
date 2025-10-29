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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-medium">{value || 'N/A'}</p>
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

  const statementData = [
    {
      date: '2024-07-01',
      description: 'Premium Due',
      debit: 150.0,
      credit: 0,
      balance: 150.0,
    },
    {
      date: '2024-07-05',
      description: 'Payment Received',
      debit: 0,
      credit: 150.0,
      balance: 0.0,
    },
    {
      date: '2024-08-01',
      description: 'Premium Due',
      debit: 150.0,
      credit: 0,
      balance: 150.0,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={client.client}
        description={`Policy #${client.policy}`}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailItem label="Client Name" value={client.client} />
            <DetailItem label="Date of Birth" value="1985-05-20" />
            <DetailItem label="Email" value="j.doe@example.com" />
            <DetailItem label="Phone Number" value="024 123 4567" />
            <DetailItem label="Address" value="123 Main St, Accra" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policy Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailItem label="Policy Number" value={client.policy} />
            <DetailItem label="Product" value={client.product} />
            <DetailItem
              label="Premium"
              value={`GHS ${client.premium.toFixed(2)}`}
            />
            <DetailItem
              label="Commencement Date"
              value={format(new Date(client.commencementDate), 'PPP')}
            />
            <DetailItem label="Status" value={client.status} />
            <DetailItem label="Policy Term" value="10 Years" />
            <DetailItem label="Premium Term" value="5 Years" />
            <DetailItem label="Payment Frequency" value="Monthly" />
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Underwriting</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Underwriting details, including risk assessments and decisions, will be displayed here.</p>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailItem label="Payment Method" value="Direct Debit" />
            <DetailItem label="Bank Name" value="CalBank PLC" />
            <DetailItem label="Bank Branch" value="Accra Main" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statement</CardTitle>
            <CardDescription>
              Billing and payment information for this policy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit (GHS)</TableHead>
                  <TableHead className="text-right">Credit (GHS)</TableHead>
                  <TableHead className="text-right">Balance (GHS)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statementData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(new Date(row.date), 'PPP')}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell className="text-right">
                      {row.debit > 0 ? row.debit.toFixed(2) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.credit > 0 ? row.credit.toFixed(2) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {row.balance.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}