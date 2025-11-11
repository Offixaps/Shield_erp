

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
import { FilePenLine, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import DeletePolicyDialog from './delete-policy-dialog';
import { getPolicies, deletePolicy as deletePolicyFromService } from '@/lib/policy-service';
import { Input } from '@/components/ui/input';

export default function NewBusinessTable() {
  const pathname = usePathname();

  const from = pathname.includes('/underwriting')
    ? 'underwriting'
    : 'business-development';
    
  const isAllPoliciesPage = pathname.includes('/all-policies');
  const isUnderwritingNewBusiness = pathname.includes('/underwriting/new-business');
  
  const [allData, setAllData] = React.useState<NewBusiness[]>([]);
  const [filteredData, setFilteredData] = React.useState<NewBusiness[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    let policies = getPolicies();
    if (isAllPoliciesPage) {
      const acceptedStatuses: NewBusiness['onboardingStatus'][] = ['Accepted', 'Mandate Verified', 'Policy Issued'];
      policies = policies.filter(p => acceptedStatuses.includes(p.onboardingStatus));
    }
    setAllData(policies);
    setFilteredData(policies);
  }, [pathname, isAllPoliciesPage]);

  React.useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = allData.filter(item => {
      return (
        item.client.toLowerCase().includes(lowercasedFilter) ||
        (item.policy && item.policy.toLowerCase().includes(lowercasedFilter)) ||
        item.serial.toLowerCase().includes(lowercasedFilter) ||
        item.phone.toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, allData]);

  const handleDelete = (id: number) => {
    if (deletePolicyFromService(id)) {
      const updatedData = allData.filter((item) => item.id !== id);
      setAllData(updatedData);
      setFilteredData(updatedData);
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
        case 'policy issued':
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
    <div className="space-y-4">
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search by client, policy, serial, or phone..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="rounded-md border">
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
                {!isAllPoliciesPage && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredData.map((business, index) => (
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
                    {isAllPoliciesPage && business.policy
                        ? business.policy
                        : business.serial}
                    </TableCell>
                    <TableCell>{business.phone}</TableCell>
                    <TableCell>{business.product}</TableCell>
                    <TableCell>GHS{business.premium.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
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
                    {!isAllPoliciesPage && (
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
                    )}
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
        {filteredData.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No policies found matching your search.</p>
        )}
    </div>
  );
}
