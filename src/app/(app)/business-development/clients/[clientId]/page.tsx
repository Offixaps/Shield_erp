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
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, PauseCircle } from 'lucide-react';

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
      <div className="text-base font-medium">{value || 'N/A'}</div>
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
      <div className="flex items-start justify-between">
        <PageHeader
          title={client.client}
          description={`Policy #${client.policy}`}
        />
        {client.status === 'Pending' && (
          <div className="flex gap-2">
            <Button>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Policy
            </Button>
            <Button variant="outline">
              <PauseCircle className="mr-2 h-4 w-4" />
              Defer Policy
            </Button>
            <Button variant="destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Decline Policy
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailItem label="Life Assured Name" value={client.client} />
            <DetailItem label="Life Assured Date of Birth" value="1985-05-20" />
            <DetailItem label="Applicant Email Address" value="j.doe@example.com" />
            <DetailItem
              label="Applicant Telephone Number"
              value="024 123 4567"
            />
            <DetailItem
              label="Applicant postal address"
              value="123 Main St, Accra"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policy Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailItem label="Policy Number" value={client.policy} />
            <DetailItem label="Contract Type" value={client.product} />
            <DetailItem
              label="Premium Amount (GHS)"
              value={`GHS ${client.premium.toFixed(2)}`}
            />
            <DetailItem
              label="Policy Commencement Date"
              value={format(new Date(client.commencementDate), 'PPP')}
            />
            <DetailItem
              label="Approval Status"
              value={
                <Badge
                  className={cn(
                    client.status === 'Approved' && 'bg-green-500/80',
                    client.status === 'Pending' && 'bg-yellow-500/80',
                    client.status === 'Declined' && 'bg-red-500/80',
                    'text-white'
                  )}
                  variant={client.status === 'Approved' ? 'default' : 'secondary'}
                >
                  {client.status}
                </Badge>
              }
            />
            <DetailItem label="Policy Term (years)" value="10 Years" />
            <DetailItem label="Premium Term (years)" value="5 Years" />
            <DetailItem label="Payment Frequency" value="Monthly" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Underwriting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Underwriting details, including risk assessments and decisions,
              will be displayed here.
            </p>
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
