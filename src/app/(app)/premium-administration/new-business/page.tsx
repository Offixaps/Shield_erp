

'use client';

import * as React from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type NewBusiness } from '@/lib/data';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ConfirmFirstPremiumDialog from '@/components/premium-administration/confirm-first-premium-dialog';
import VerifyMandateDialog from '@/components/premium-administration/verify-mandate-dialog';
import { getPolicies } from '@/lib/policy-service';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function NewBusinessPage() {
    const [allBusinessList, setAllBusinessList] = React.useState<NewBusiness[]>([]);
    const [filteredBusinessList, setFilteredBusinessList] = React.useState<NewBusiness[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const policies = getPolicies();
        setAllBusinessList(policies);
        setFilteredBusinessList(policies);
    }, []);

    React.useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filtered = allBusinessList.filter(item => {
        return (
            item.client.toLowerCase().includes(lowercasedFilter) ||
            item.serial.toLowerCase().includes(lowercasedFilter) ||
            (item.policy && item.policy.toLowerCase().includes(lowercasedFilter))
        );
        });
        setFilteredBusinessList(filtered);
    }, [searchTerm, allBusinessList]);


    const handlePolicyUpdate = (updatedPolicy: NewBusiness) => {
        const updatedList = allBusinessList.map(p => p.id === updatedPolicy.id ? updatedPolicy : p)
        setAllBusinessList(updatedList);
        setFilteredBusinessList(updatedList);
    };

    const getStatusBadgeStyling = (status: string) => {
    const lowerCaseStatus = status.toLowerCase();
    switch (lowerCaseStatus) {
        case 'pending vetting':
        case 'pending mandate':
        case 'pending first premium':
        case 'pending medicals':
            return 'bg-[#fcba03] text-black';
        case 'vetting completed':
        case 'mandate verified':
        case 'first premium confirmed':
        case 'medicals completed':
            return 'bg-blue-500/80 text-white';
        case 'accepted':
        case 'policy issued':
            return 'bg-green-500/80 text-white';
        case 'ntu':
        case 'deferred':
            return 'bg-gray-500/80 text-white';
        case 'declined':
        case 'rework required':
        case 'mandate rework required':
            return 'bg-red-500/80 text-white';
        default:
            return 'bg-gray-500/80 text-white';
    }
  }


  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New Business Review"
        description="A list of new policies pending review and activation."
      />
      <Card>
        <CardContent className="pt-6 space-y-4">
           <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by client, policy, or serial..."
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
                    <TableHead>Serial #</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Premium</TableHead>
                    <TableHead>Commencement Date</TableHead>
                    <TableHead>Onboarding Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredBusinessList.map((business, index) => (
                    <TableRow key={business.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                        <Link href={`/business-development/clients/${business.id}?from=premium-admin`} className="font-medium text-primary hover:underline">
                        {business.client}
                        </Link>
                    </TableCell>
                    <TableCell>
                        {business.serial}
                    </TableCell>
                    <TableCell>
                        {business.product}
                    </TableCell>
                    <TableCell>
                        GHS{business.premium.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                        {format(new Date(business.commencementDate), 'PPP')}
                    </TableCell>
                    <TableCell>
                        <Badge
                        className={cn(
                            'w-44 justify-center truncate',
                            getStatusBadgeStyling(business.onboardingStatus)
                        )}
                        >
                        {business.onboardingStatus}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        {business.onboardingStatus === 'Pending Mandate' && (
                        <div className="flex gap-2 justify-end">
                            <VerifyMandateDialog client={business} onUpdate={handlePolicyUpdate} />
                        </div>
                        )}
                        {business.onboardingStatus === 'Pending First Premium' && (
                            <div className="flex gap-2 justify-end">
                                <ConfirmFirstPremiumDialog client={business} onUpdate={handlePolicyUpdate} />
                            </div>
                        )}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
           </div>
            {filteredBusinessList.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No policies found matching your search.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
