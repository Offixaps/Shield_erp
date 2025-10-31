

'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type NewBusiness } from '@/lib/data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FilePenLine } from 'lucide-react';
import { usePathname } from 'next/navigation';
import DeletePolicyDialog from './delete-policy-dialog';
import { getPolicies, deletePolicy as deletePolicyFromService } from '@/lib/policy-service';

export default function NewBusinessTable() {
  const pathname = usePathname();

  const from = pathname.includes('/underwriting')
    ? 'underwriting'
    : 'business-development';
    
  const isAllPoliciesPage = pathname.includes('/all-policies');
  const isUnderwritingNewBusiness = pathname.includes('/underwriting/new-business');
  
  const [data, setData] = React.useState<NewBusiness[]>([]);

  React.useEffect(() => {
    let policies = getPolicies();
    if (isAllPoliciesPage) {
      policies = policies.filter(item => 
        ['Active', 'Lapsed', 'Cancelled', 'Accepted'].includes(item.policyStatus) || item.onboardingStatus === 'Accepted'
      );
    }
    setData(policies);
  }, [isAllPoliciesPage]);


  const handleDelete = (id: number) => {
    if (deletePolicyFromService(id)) {
      setData(data.filter((item) => item.id !== id));
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending vetting':
        case 'pending mandate':
        case 'pending first premium':
        case 'pending medicals':
            return 'bg-yellow-500/80';
        case 'vetting completed':
        case 'mandate verified':
        case 'first premium confirmed':
        case 'medicals completed':
            return 'bg-blue-500/80';
        case 'accepted':
        case 'active':
            return 'bg-green-500/80';
        case 'ntu':
        case 'deferred':
            return 'bg-gray-500/80';
        case 'declined':
        case 'lapsed':
        case 'cancelled':
        case 'rework required':
        case 'mandate rework required':
            return 'bg-red-500/80';
        default:
            return 'bg-gray-500/80';
    }
  }


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>{isAllPoliciesPage ? 'Policy #' : 'Serial #'}</TableHead>
          <TableHead>Telephone #</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Premium</TableHead>
          <TableHead>Commencement Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((business, index) => (
          <TableRow key={business.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <Link
                href={`/business-development/clients/${business.id}?from=${from}`}
                className="font-medium text-primary hover:underline"
              >
                {business.client}
              </Link>
            </TableCell>
            <TableCell>
              {isAllPoliciesPage
                ? business.onboardingStatus === 'Accepted' || ['Active', 'Lapsed', 'Cancelled'].includes(business.policyStatus)
                  ? business.policy
                  : business.serial
                : business.serial}
            </TableCell>
            <TableCell>{business.phone}</TableCell>
            <TableCell>{business.product}</TableCell>
            <TableCell>GHS{business.premium.toFixed(2)}</TableCell>
            <TableCell>
              {format(new Date(business.commencementDate), 'PPP')}
            </TableCell>
            <TableCell>
              <Badge
                className={cn('w-44 justify-center truncate', getStatusBadgeColor(isAllPoliciesPage ? business.policyStatus : business.onboardingStatus), 'text-white')}
              >
                {isAllPoliciesPage ? business.policyStatus : business.onboardingStatus}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {isUnderwritingNewBusiness ? (
                <Button asChild size="sm" className="bg-sidebar text-sidebar-foreground hover:bg-sidebar/90">
                   <Link href={`/business-development/clients/${business.id}?from=underwriting`}>
                    Process
                  </Link>
                </Button>
              ) : (
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={`/business-development/sales/${business.id}/edit`}
                    >
                      <FilePenLine className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeletePolicyDialog onConfirm={() => handleDelete(business.id)} />
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

    
