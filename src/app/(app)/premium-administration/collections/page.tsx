
'use client';

import * as React from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPolicies } from '@/lib/policy-service';
import type { NewBusiness } from '@/lib/data';
import { Landmark } from 'lucide-react';
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

const bankNames = [
  'Absa Bank Ghana Limited',
  'Access Bank (Ghana) Plc',
  'Agricultural Development Bank Plc',
  'Bank of Africa Ghana Limited',
  'CalBank PLC',
  'Consolidated Bank Ghana Limited',
  'Ecobank Ghana PLC',
  'FBNBank (Ghana) Limited',
  'Fidelity Bank Ghana Limited',
  'First Atlantic Bank Limited',
  'First National Bank (Ghana) Limited',
  'GCB Bank PLC',
  'Guaranty Trust Bank (Ghana) Limited',
  'National Investment Bank Limited',
  'OmniBSIC Bank Ghana Limited',
  'Prudential Bank Limited',
  'Republic Bank (Ghana) PLC',
  'Societe Generale Ghana PLC',
  'Stanbic Bank Ghana Limited',
  'Standard Chartered Bank Ghana PLC',
  'United Bank for Africa (Ghana) Limited',
  'Universal Merchant Bank Limited',
  'Zenith Bank (Ghana) Limited',
];

export default function CollectionsPage() {
  const [selectedBank, setSelectedBank] = React.useState<string | null>(null);
  const [policies, setPolicies] = React.useState<NewBusiness[]>([]);
  const [filteredPolicies, setFilteredPolicies] = React.useState<NewBusiness[]>([]);

  React.useEffect(() => {
    const allPolicies = getPolicies();
    setPolicies(allPolicies);
  }, []);

  React.useEffect(() => {
    if (selectedBank) {
      const activePoliciesForBank = policies.filter(
        (p) => p.policyStatus === 'Active' && p.bankName === selectedBank
      );
      setFilteredPolicies(activePoliciesForBank);
    } else {
      setFilteredPolicies([]);
    }
  }, [selectedBank, policies]);

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
      <PageHeader
        title="Premium Collection by Bank"
        description="Select a bank to view all active policies for collection."
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {bankNames.map((bank) => (
          <Card
            key={bank}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md hover:border-primary',
              selectedBank === bank && 'border-primary ring-2 ring-primary'
            )}
            onClick={() => setSelectedBank(bank)}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 gap-2 text-center">
              <Landmark className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium leading-tight">
                {bank.replace(' (Ghana) Limited', '').replace(' PLC', '').replace(' Limited', '')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedBank && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Active Policies for {selectedBank}</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPolicies.length > 0 ? (
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
                  {filteredPolicies.map((policy) => (
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
                No active policies found for {selectedBank}.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
