
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
import { getPolicies } from '@/lib/policy-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function MandatesPage() {
    const [allMandates, setAllMandates] = React.useState<NewBusiness[]>([]);
    const [filteredMandates, setFilteredMandates] = React.useState<NewBusiness[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const policies = getPolicies();
        const pendingMandates = policies.filter(p => p.onboardingStatus === 'Pending Mandate');
        setAllMandates(pendingMandates);
        setFilteredMandates(pendingMandates);
    }, []);

    React.useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filtered = allMandates.filter(item => {
        return (
            item.client.toLowerCase().includes(lowercasedFilter) ||
            item.policy.toLowerCase().includes(lowercasedFilter)
        );
        });
        setFilteredMandates(filtered);
    }, [searchTerm, allMandates]);


  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mandates Pending Verification"
        description="A list of new policies awaiting mandate verification from Underwriting."
      />
      <Card>
        <CardContent className="pt-6 space-y-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by client or policy number..."
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
                        <TableHead>Policy #</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Premium</TableHead>
                        <TableHead>Commencement Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredMandates.map((business, index) => (
                        <TableRow key={business.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                            <Link href={`/business-development/clients/${business.id}?from=underwriting`} className="font-medium text-primary hover:underline">
                            {business.client}
                            </Link>
                        </TableCell>
                        <TableCell>
                            {business.policy}
                        </TableCell>
                        <TableCell>
                            {business.product}
                        </TableCell>
                        <TableCell>
                            GHS{business.premium.toFixed(2)}
                        </TableCell>
                        <TableCell>
                            {format(new Date(business.commencementDate), 'PPP')}
                        </TableCell>
                        <TableCell>
                            <Badge
                            className={cn(
                                'w-44 justify-center truncate',
                                'bg-yellow-500/80',
                                'text-white'
                            )}
                            >
                            {business.onboardingStatus}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button asChild size="sm">
                                <Link href={`/business-development/clients/${business.id}?from=underwriting`}>
                                    Review Mandate
                                </Link>
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
          {filteredMandates.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No policies are currently pending mandate verification matching your search.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
