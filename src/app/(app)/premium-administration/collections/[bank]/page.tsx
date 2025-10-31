
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPolicies } from '@/lib/policy-service';
import type { NewBusiness } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';

export default function BankPoliciesPage() {
  const params = useParams();
  const bankName = React.useMemo(() => {
    const bank = params.bank;
    return typeof bank === 'string' ? decodeURIComponent(bank) : '';
  }, [params.bank]);

  const [policies, setPolicies] = React.useState<NewBusiness[]>([]);

  React.useEffect(() => {
    if (bankName) {
      const allPolicies = getPolicies();
      const filtered = allPolicies.filter(
        (p) => p.policyStatus === 'Active' && p.bankName === bankName
      );
      setPolicies(filtered);
    }
  }, [bankName]);

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'up to date':
        return 'bg-green-500/80';
      case 'outstanding':
        return 'bg-orange-500/80';
      default:
        return 'bg-gray-500/80';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Active Policies for ${bankName.replace(' (Ghana) Limited', '').replace(' PLC', '').replace(' Limited', '')}`}
          description="A list of all active policies for this bank."
        />
        <div className="flex items-center gap-2">
            <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Post to Bank
            </Button>
            <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Bank Report
            </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {policies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Policy #</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Commencement</TableHead>
                  <TableHead>Billing Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell>
                      <Link href={`/business-development/clients/${policy.id}?from=premium-admin`} className="font-medium text-primary hover:underline">
                          {policy.client}
                      </Link>
                    </TableCell>
                    <TableCell>{policy.policy}</TableCell>
                    <TableCell>GHS{policy.premium.toFixed(2)}</TableCell>
                    <TableCell>
                      {format(new Date(policy.commencementDate), 'PPP')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'w-28 justify-center',
                          getStatusBadgeColor(policy.billingStatus),
                          'text-white'
                        )}
                      >
                        {policy.billingStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">
              No active policies found for {bankName.replace(' (Ghana) Limited', '').replace(' PLC', '').replace(' Limited', '')}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
