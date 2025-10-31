
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
import { newBusinessData, type NewBusiness, type OnboardingStatus } from '@/lib/data';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import ConfirmFirstPremiumDialog from '@/components/premium-administration/confirm-first-premium-dialog';
import VerifyMandateDialog from '@/components/premium-administration/verify-mandate-dialog';
import { useRouter } from 'next/navigation';

export default function NewBusinessPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [businessList, setBusinessList] = React.useState(newBusinessData);

    const handleVerifyMandate = (id: number, newStatus: OnboardingStatus, notes?: string) => {
        const businessIndex = newBusinessData.findIndex(item => item.id === id);
        if (businessIndex !== -1) {
            const clientName = newBusinessData[businessIndex].client;
            
            newBusinessData[businessIndex] = {
                ...newBusinessData[businessIndex],
                onboardingStatus: newStatus,
                mandateVerified: newStatus === 'Mandate Verified',
                mandateReworkNotes: notes
            };

            setBusinessList([...newBusinessData]); // Trigger re-render
            router.refresh(); // Force refresh for other components if needed, though direct mutation should be picked up

            if (newStatus === 'Mandate Verified') {
                toast({
                    title: "Mandate Verified",
                    description: `Mandate for ${clientName} has been verified.`
                });
            } else {
                 toast({
                    title: "Mandate Rework Required",
                    description: `Mandate for ${clientName} sent back for rework.`
                });
            }
        }
    };
    
    const handleConfirmFirstPremium = (id: number) => {
        const businessIndex = newBusinessData.findIndex(item => item.id === id);
        if (businessIndex !== -1) {
            const clientName = newBusinessData[businessIndex].client;
            
            newBusinessData[businessIndex] = {
                ...newBusinessData[businessIndex],
                onboardingStatus: 'First Premium Confirmed',
                billingStatus: 'First Premium Paid',
                firstPremiumPaid: true
            };

            setBusinessList([...newBusinessData]); // Trigger re-render
            router.refresh();
            
            toast({
                title: "First Premium Confirmed",
                description: `First premium for ${clientName} has been confirmed.`
            });
        }
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
        case 'vetting completed':
            return 'bg-blue-500/80';
        case 'accepted':
            return 'bg-green-500/80';
        case 'ntu':
        case 'deferred':
            return 'bg-gray-500/80';
        case 'declined':
        case 'rework required':
        case 'mandate rework required':
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
                        <VerifyMandateDialog client={business} onConfirm={handleVerifyMandate} />
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
