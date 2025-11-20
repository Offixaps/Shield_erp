

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
import { FilePenLine, Search, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { usePathname } from 'next/navigation';
import DeletePolicyDialog from './delete-policy-dialog';
import { getPolicies, deletePolicy as deletePolicyFromService } from '@/lib/policy-service';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function NewBusinessTable() {
  const pathname = usePathname();

  const from = pathname.includes('/underwriting')
    ? 'underwriting'
    : 'business-development';
    
  const isAllPoliciesPage = pathname.includes('/all-policies');
  const isUnderwritingNewBusiness = pathname.includes('/underwriting/new-business');
  const isBDSalesPage = pathname.includes('/business-development/sales');
  
  const [allData, setAllData] = React.useState<NewBusiness[]>([]);
  const [filteredData, setFilteredData] = React.useState<NewBusiness[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const loadPolicies = React.useCallback(async () => {
    let policies = await getPolicies();
    
    if (isBDSalesPage) {
        const onboardingStatuses: NewBusiness['onboardingStatus'][] = [
            'Incomplete Policy',
            'Pending First Premium',
            'First Premium Confirmed',
            'Pending Vetting',
            'Vetting Completed',
            'Rework Required',
            'Pending Medicals',
            'Medicals Completed',
            'Pending Decision',
            'Pending Mandate',
            'Mandate Verified',
            'Mandate Rework Required',
        ];
        policies = policies.filter(p => onboardingStatuses.includes(p.onboardingStatus));
    } else if (isAllPoliciesPage) {
       const acceptedStatuses: NewBusiness['onboardingStatus'][] = ['Accepted', 'Mandate Verified', 'Policy Issued'];
       policies = policies.filter(p => acceptedStatuses.includes(p.onboardingStatus));
    } else if (isUnderwritingNewBusiness) {
        const pendingStatuses: NewBusiness['onboardingStatus'][] = ['Pending Vetting', 'Pending Medicals', 'Pending Decision', 'Vetting Completed', 'Medicals Completed', 'Rework Required'];
        policies = policies.filter(p => pendingStatuses.includes(p.onboardingStatus));
    }

    // Sort by ID descending to show the latest policies first
    policies.sort((a, b) => (b.id as number) - (a.id as number));
    
    setAllData(policies);
    setFilteredData(policies);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [isAllPoliciesPage, isUnderwritingNewBusiness, isBDSalesPage]);

  React.useEffect(() => {
    loadPolicies();
    
    // Add event listener for storage changes to refresh data
    const handleStorageChange = () => loadPolicies();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, [loadPolicies]);

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
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [searchTerm, allData]);

  const handleDelete = async (id: string) => {
    await deletePolicyFromService(id);
    loadPolicies(); // Reload data after deletion
  };
  
  const getStatusBadgeStyling = (status: string) => {
    const lowerCaseStatus = status.toLowerCase();
    switch (lowerCaseStatus) {
      case 'pending vetting':
      case 'pending mandate':
      case 'pending first premium':
      case 'pending medicals':
      case 'pending decision':
      case 'pending':
        return 'bg-[#fcba03] text-black';
      case 'vetting completed':
      case 'mandate verified':
      case 'first premium confirmed':
      case 'medicals completed':
        return 'bg-blue-500/80 text-white';
      case 'accepted':
      case 'active':
      case 'policy issued':
        return 'bg-green-500/80 text-white';
      case 'ntu':
      case 'deferred':
      case 'incomplete policy':
        return 'bg-gray-500/80 text-white';
      case 'declined':
      case 'lapsed':
      case 'cancelled':
      case 'rework required':
      case 'mandate rework required':
        return 'bg-red-500/80 text-white';
      default:
        return 'bg-gray-500/80 text-white';
    }
  };

  const pageCount = Math.ceil(filteredData.length / pagination.pageSize);
  const paginatedData = filteredData.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

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
                {paginatedData.map((business, index) => {
                  const isIncomplete = business.onboardingStatus === 'Incomplete Policy';
                  return (
                    <TableRow key={business.id}>
                        <TableCell>{pagination.pageIndex * pagination.pageSize + index + 1}</TableCell>
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
                          {business.commencementDate && !isNaN(new Date(business.commencementDate).getTime())
                              ? format(new Date(business.commencementDate), 'PPP')
                              : 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                        <Badge
                            className={cn('w-44 justify-center truncate', getStatusBadgeStyling(isAllPoliciesPage ? business.policyStatus : business.onboardingStatus))}
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
                                <Button variant={isIncomplete ? 'default' : 'ghost'} size="icon" asChild>
                                    <Link
                                      href={`/business-development/sales/${business.id}/edit`}
                                    >
                                      {isIncomplete ? <Play className="h-4 w-4" /> : <FilePenLine className="h-4 w-4" />}
                                    </Link>
                                </Button>
                                <DeletePolicyDialog onConfirm={() => handleDelete(business.id as string)} />
                                </div>
                            )}
                            </TableCell>
                        )}
                    </TableRow>
                  );
                })}
            </TableBody>
            </Table>
        </div>
        {filteredData.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No policies found matching your search.</p>
        )}

        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {Math.min(pagination.pageIndex * pagination.pageSize + 1, filteredData.length)} to {Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredData.length)} of{' '}
              {filteredData.length} entries
            </div>
            <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                    value={`${pagination.pageSize}`}
                    onValueChange={(value) => {
                    setPagination({
                        pageIndex: 0,
                        pageSize: Number(value),
                    });
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                    {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                        </SelectItem>
                    ))}
                     <SelectItem value={`${filteredData.length}`}>All</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {pagination.pageIndex + 1} of {pageCount}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                    disabled={pagination.pageIndex === 0}
                >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                    disabled={pagination.pageIndex >= pageCount - 1}
                >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    </div>
  );
}
