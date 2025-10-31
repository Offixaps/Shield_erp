
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
import { newBusinessData, type NewBusiness } from '@/lib/data';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ConfirmFirstPremiumDialog from '@/components/premium-administration/confirm-first-premium-dialog';

export default function NewBusinessPage() {
    const { toast } = useToast();
    const [businessList, setBusinessList] = React.useState(newBusinessData);

    const handleVerifyMandate = (id: number) => {
        setBusinessList(prevList => prevList.map(item => {
            if (item.id === id) {
                 toast({
                    title: "Mandate Verified",
                    description: `Mandate for ${item.client} has been verified.`
                });
                return { ...item, onboardingStatus: 'Pending First Premium', mandateVerified: true };
            }
            return item;
        }));
    };
    
    const handleConfirmFirstPremium = (id: number) => {
        setBusinessList(prevList => prevList.map(item => {
            if (item.id === id) {
                toast({
                    title: "First Premium Confirmed",
                    description: `First premium for ${item.client} has been confirmed.`
                });
                return { ...item, onboardingStatus: 'First Premium Confirmed', billingStatus: 'First Premium Paid', firstPremiumPaid: true };
            }
            return item;
        }));
    };

    const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending mandate':
        case 'pending first premium':
        case 'pending medicals':
            return 'bg-yellow-500/80';
        case 'mandate verified':
        case 'first premium confirmed':
        case 'medicals completed':
            return 'bg-blue-500/80';
        case 'accepted':
            return 'bg-green-500/80';
        case 'ntu':
        case 'deferred':
            return 'bg-gray-500/80';
        case 'declined':
            return 'bg-red-500/80';
        default:
            return 'bg-gray-500/80';
    }
  }


  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New Business Review"
        description="A list of new policies pending review and activation."
      />
      <Card>
        <CardContent className="pt-6">
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
              {businessList.map((business, index) => (
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
                    GHS{business.premium.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(business.commencementDate), 'PPP')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        'w-44 justify-center truncate',
                        getStatusBadgeColor(business.onboardingStatus),
                        'text-white'
                      )}
                    >
                      {business.onboardingStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {business.onboardingStatus === 'Pending Mandate' && (
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" onClick={() => handleVerifyMandate(business.id)}>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Verify Mandate
                        </Button>
                      </div>
                    )}
                    {business.onboardingStatus === 'Pending First Premium' && (
                        <div className="flex gap-2 justify-end">
                            <ConfirmFirstPremiumDialog client={business} onConfirm={handleConfirmFirstPremium} />
                        </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
