
'use client';

import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
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
import { XCircle, PauseCircle, ThumbsDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import AcceptPolicyDialog from '@/components/clients/accept-policy-dialog';
import type { newBusinessData } from '@/lib/data';

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

export default function ClientDetailsView({
  client,
  from,
}: {
  client: (typeof newBusinessData)[0];
  from: string;
}) {
  const isFromUnderwriting = from === 'underwriting';

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
        {isFromUnderwriting && client.status === 'Pending' && (
          <div className="flex gap-2">
            <AcceptPolicyDialog client={client} />
            <Button className="bg-sidebar text-sidebar-foreground hover:bg-sidebar/90">
              <PauseCircle className="mr-2 h-4 w-4" />
              Defer Policy
            </Button>
            <Button className="bg-sidebar text-sidebar-foreground hover:bg-sidebar/90">
              <ThumbsDown className="mr-2 h-4 w-4" />
              NTU Policy
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
            <h3 className="text-lg font-medium bg-sidebar text-sidebar-foreground p-2 rounded-t-md">Client Details</h3>
             <Separator className="my-0" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <DetailItem label="Life Assured Name" value={client.client} />
            <DetailItem label="Life Assured Date of Birth" value="1985-05-20" />
            <DetailItem label="Applicant Name" value={client.client} />
            <DetailItem label="Applicant Date of Birth" value="1985-05-20" />
            <DetailItem label="Age (Next Birthday)" value="40" />
            <DetailItem label="Applicant Email Address" value="j.doe@example.com" />
            <DetailItem
              label="Applicant Telephone Number"
              value={client.phone}
            />
            <DetailItem
              label="Applicant Postal Address"
              value="123 Main St, Accra"
            />
            <DetailItem label="Gender" value="Male" />
            <DetailItem label="Marital Status" value="Married" />
            <DetailItem label="Number of Dependents" value="2" />
            <DetailItem label="Nationality" value="Ghana" />
            <DetailItem label="Country" value="Ghana" />
            <DetailItem label="Religion" value="Christian" />
            <DetailItem label="Languages Spoken" value="English, Twi" />
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <h3 className="text-lg font-medium bg-sidebar text-sidebar-foreground p-2 rounded-t-md">Identification</h3>
                <Separator className="my-0" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <DetailItem label="National ID Type" value="Passport" />
                <DetailItem label="ID Number" value="G1234567" />
                <DetailItem label="Place of Issue" value="Accra" />
                <DetailItem label="Issue Date" value={format(new Date('2020-01-01'), 'PPP')} />
                <DetailItem label="Expiry Date" value={format(new Date('2030-01-01'), 'PPP')} />
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium bg-sidebar text-sidebar-foreground p-2 rounded-t-md">Policy Details</h3>
            <Separator className="my-0" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <DetailItem label="Serial Number" value={client.serial} />
            <DetailItem label="Policy Number" value={client.policy} />
            <DetailItem label="Contract Type" value={client.product} />
            <DetailItem
              label="Premium Amount (GHS)"
              value={`GHS ${client.premium.toFixed(2)}`}
            />
             <DetailItem
              label="Sum Assured (GHS)"
              value={`GHS 50,000.00`}
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
            <DetailItem label="Policy Term (years)" value="10" />
            <DetailItem label="Premium Term (years)" value="5" />
            <DetailItem label="Payment Frequency" value="Monthly" />
            <DetailItem label="Increase Month" value={format(new Date(client.commencementDate), 'MMMM')} />
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <h3 className="text-lg font-medium bg-sidebar text-sidebar-foreground p-2 rounded-t-md">Employment Details</h3>
                <Separator className="my-0" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <DetailItem label="Occupation" value="Software Engineer" />
                <DetailItem label="Nature of Business/Work" value="Technology" />
                <DetailItem label="Employer" value="Google" />
                <DetailItem label="Employer Address" value="1600 Amphitheatre Parkway, Mountain View, CA" />
                <DetailItem label="Monthly Basic Income (GHS)" value="10,000.00" />
                <DetailItem label="Other Income (GHS)" value="2,000.00" />
                <DetailItem label="Total Monthly Income (GHS)" value="12,000.00" />
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <h3 className="text-lg font-medium bg-sidebar text-sidebar-foreground p-2 rounded-t-md">Payment Details</h3>
             <Separator className="my-0" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <DetailItem label="Premium Payer Name" value={client.client} />
            <DetailItem label="Premium Payer Occupation" value="Accountant" />
            <DetailItem label="Bank Name" value="CalBank PLC" />
            <DetailItem label="Bank Branch" value="Accra Main" />
            <DetailItem label="Sort Code" value="123456" />
            <DetailItem label="Account Type" value="Current" />
            <DetailItem label="Bank Account Name" value={client.client} />
            <DetailItem label="Bank Account Number" value="00112233445566" />
            <DetailItem label="Premium Amount (GHS)" value={`GHS ${client.premium.toFixed(2)}`} />
            <DetailItem label="Amount in Words" value="One Hundred and Fifty Ghana Cedis" />
            <DetailItem label="Premium Deduction Frequency" value="Monthly" />
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
