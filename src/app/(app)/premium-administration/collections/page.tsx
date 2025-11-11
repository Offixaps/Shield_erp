

'use client';

import * as React from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import type { NewBusiness } from '@/lib/data';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Handshake, Smartphone, CircleStop, Banknote, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPolicies, billAllActivePolicies, applyAnnualIncreases } from '@/lib/policy-service';
import { format, isAfter, startOfDay, getYear, differenceInYears, isBefore } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const bankBrandData = [
    { name: 'Absa Bank Ghana Limited', logo: '/logos/banks/absa.svg', color: '#E60000', textColor: '#FFFFFF' },
    { name: 'Access Bank (Ghana) Plc', logo: '/logos/banks/access.svg', color: '#00539B', textColor: '#FFFFFF' },
    { name: 'Agricultural Development Bank Plc', logo: '/logos/banks/adb.svg', color: '#008000', textColor: '#FFFFFF' },
    { name: 'Bank of Africa Ghana Limited', logo: '/logos/banks/boa.svg', color: '#D9232D', textColor: '#FFFFFF' },
    { name: 'CalBank PLC', logo: '/logos/banks/calbank.svg', color: '#003366', textColor: '#FFFFFF' },
    { name: 'Consolidated Bank Ghana Limited', logo: '/logos/banks/cbg.svg', color: '#008080', textColor: '#FFFFFF' },
    { name: 'Ecobank Ghana PLC', logo: '/logos/banks/ecobank.svg', color: '#00539B', textColor: '#FFFFFF' },
    { name: 'FBNBank (Ghana) Limited', logo: '/logos/banks/fbn.svg', color: '#0033A0', textColor: '#FFFFFF' },
    { name: 'Fidelity Bank Ghana Limited', logo: '/logos/banks/fidelity.svg', color: '#FFA500', textColor: '#000000' },
    { name: 'First Atlantic Bank Limited', logo: '/logos/banks/first-atlantic.svg', color: '#8A2BE2', textColor: '#FFFFFF' },
    { name: 'First National Bank (Ghana) Limited', logo: '/logos/banks/fnb.svg', color: '#00AEEF', textColor: '#FFFFFF' },
    { name: 'GCB Bank PLC', logo: '/logos/banks/gcb.svg', color: '#004386', textColor: '#FFFFFF' },
    { name: 'Guaranty Trust Bank (Ghana) Limited', logo: '/logos/banks/gtb.svg', color: '#F7941D', textColor: '#FFFFFF' },
    { name: 'National Investment Bank Limited', logo: '/logos/banks/nib.svg', color: '#FFD700', textColor: '#000000' },
    { name: 'OmniBSIC Bank Ghana Limited', logo: '/logos/banks/omnibsic.svg', color: '#4B0082', textColor: '#FFFFFF' },
    { name: 'Prudential Bank Limited', logo: '/logos/banks/prudential.svg', color: '#00008B', textColor: '#FFFFFF' },
    { name: 'Republic Bank (Ghana) PLC', logo: '/logos/banks/republic.svg', color: '#E30613', textColor: '#FFFFFF' },
    { name: 'Societe Generale Ghana PLC', logo: '/logos/banks/sg.svg', color: '#E3000F', textColor: '#FFFFFF' },
    { name: 'Stanbic Bank Ghana Limited', logo: '/logos/banks/stanbic.svg', color: '#00AEEF', textColor: '#FFFFFF' },
    { name: 'Standard Chartered Bank Ghana PLC', logo: '/logos/banks/sc.svg', color: '#0072C6', textColor: '#FFFFFF' },
    { name: 'United Bank for Africa (Ghana) Limited', logo: '/logos/banks/uba.svg', color: '#D2232A', textColor: '#FFFFFF' },
    { name: 'Universal Merchant Bank Limited', logo: '/logos/banks/umb.svg', color: '#800000', textColor: '#FFFFFF' },
    { name: 'Zenith Bank (Ghana) Limited', logo: '/logos/banks/zenith.svg', color: '#E30613', textColor: '#FFFFFF' },
];

const nonBankCollectionData = [
  { name: 'Controller', icon: Handshake, filter: 'controller' },
  { name: 'Mobile Money', icon: Smartphone, filter: 'mobile-money' },
  { name: 'Stop Order', icon: CircleStop, filter: 'stop-order' },
];

export default function CollectionsPage() {
    const { toast } = useToast();
    const [selectedNonBankFilter, setSelectedNonBankFilter] = React.useState<string | null>(null);
    const [eligibleForBillingCount, setEligibleForBillingCount] = React.useState(0);
    const [eligibleForIncreaseCount, setEligibleForIncreaseCount] = React.useState(0);

     const calculateEligibleForBilling = () => {
        const policies = getPolicies();
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        let count = 0;

        policies.forEach(policy => {
            if (policy.policyStatus !== 'Active') return;
            
            const commencementDate = new Date(policy.commencementDate);
            if (isAfter(commencementDate, today)) return;

            const hasBeenBilledThisMonth = (policy.bills || []).some(bill => {
                const billDate = new Date(bill.dueDate);
                return billDate.getFullYear() === currentYear && billDate.getMonth() === currentMonth;
            });

            if (!hasBeenBilledThisMonth) {
                count++;
            }
        });
        setEligibleForBillingCount(count);
    };

    const calculateEligibleForIncrease = () => {
        const policies = getPolicies();
        const today = startOfDay(new Date());
        const currentYear = getYear(today);
        let count = 0;

        policies.forEach(policy => {
            if (policy.policyStatus !== 'Active') return;

            const commencementDate = startOfDay(new Date(policy.commencementDate));
            const policyAgeInYears = differenceInYears(today, commencementDate);

            if (policyAgeInYears >= 10) return;
            
            const anniversaryThisYear = new Date(commencementDate);
            anniversaryThisYear.setFullYear(currentYear);

            if (isBefore(anniversaryThisYear, today) || anniversaryThisYear.getTime() === today.getTime()) {
                const alreadyIncreasedThisYear = (policy.activityLog || []).some(log => 
                    log.action === 'API/ABI Applied' && getYear(new Date(log.date)) === currentYear
                );
                if (!alreadyIncreasedThisYear) {
                    count++;
                }
            }
        });
        setEligibleForIncreaseCount(count);
    };


    const handleConfirmBillAll = () => {
        try {
            const count = billAllActivePolicies();
            const currentMonth = format(new Date(), 'MMMM yyyy');
             toast({
                title: 'Billing Process Complete',
                description: `${count} active policies have been billed for ${currentMonth}.`,
            });
        } catch (error) {
            console.error("Failed to bill active policies:", error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
             toast({
                variant: 'destructive',
                title: 'Billing Failed',
                description: errorMessage,
            });
        }
    };
    
    const handleConfirmApplyIncreases = () => {
        try {
            const count = applyAnnualIncreases();
            if (count > 0) {
                 toast({
                    title: 'Process Complete',
                    description: `Annual premium and benefit increases (API/ABI) have been applied to ${count} eligible active policies.`,
                });
            } else {
                toast({
                    title: 'Process Complete',
                    description: 'No policies were eligible for an annual increase at this time.',
                });
            }
        } catch (error) {
            console.error("Failed to apply annual increases:", error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
            toast({
                variant: 'destructive',
                title: 'API/ABI Process Failed',
                description: errorMessage,
            });
        }
    };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          title="Premium Collection"
          description="Select a collection method to view active policies."
        />
        <div className="flex flex-wrap gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" onClick={calculateEligibleForIncrease}>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Apply Annual Increases
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Annual Increases</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to apply annual premium and benefit increases (API/ABI) to <strong>{eligibleForIncreaseCount} eligible active policies</strong>. This action cannot be undone. Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmApplyIncreases}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button onClick={calculateEligibleForBilling}>
                        <Banknote className="mr-2 h-4 w-4" />
                        Bill All Active Policies
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Bulk Billing</AlertDialogTitle>
                        <AlertDialogDescription>
                           You are about to generate a new bill for <strong>{eligibleForBillingCount} eligible active policies</strong> for the current month. This action will mark their billing status as 'Outstanding'. Do you want to proceed?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmBillAll}>Confirm & Bill</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>
      <Tabs defaultValue="bank" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bank">Bank Premium Collection</TabsTrigger>
          <TabsTrigger value="non-bank">Non-Bank Premium Collection</TabsTrigger>
        </TabsList>
        <TabsContent value="bank" className="mt-6">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
            {bankBrandData.map((bank) => (
              <Link key={bank.name} href={`/premium-administration/collections/${encodeURIComponent(bank.name)}`} passHref>
                <Card
                  className='cursor-pointer transition-all hover:shadow-md h-40 w-40'
                  style={{ 
                      backgroundColor: bank.color, 
                      color: bank.textColor
                  }}
                >
                  <CardContent className="flex flex-col items-center justify-center p-4 gap-3 text-center h-full">
                      <div className="relative w-full h-12">
                          <Image
                              src={bank.logo}
                              alt={`${bank.name} logo`}
                              fill
                              className="object-contain"
                              onError={(e) => { e.currentTarget.src = `https://placehold.co/120x40/FFFFFF/${bank.color.substring(1)}/png?text=${bank.name.split(' ')[0]}` }}
                          />
                      </div>
                    <p className="text-xs font-medium leading-tight line-clamp-2">
                      {bank.name.replace(' (Ghana) Limited', '').replace(' PLC', '').replace(' Limited', '')}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="non-bank" className="mt-6">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
                {nonBankCollectionData.map((item) => {
                    const Icon = item.icon;
                    return (
                    <Card
                        key={item.name}
                        className={cn(
                        'cursor-pointer transition-all hover:shadow-md h-40 w-40',
                        selectedNonBankFilter === item.filter ? 'ring-2 ring-offset-2 ring-primary' : ''
                        )}
                        onClick={() => setSelectedNonBankFilter(item.filter)}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-4 gap-3 text-center h-full">
                        <Icon className="h-10 w-10 text-primary" />
                        <p className="text-sm font-medium leading-tight">{item.name}</p>
                        </CardContent>
                    </Card>
                    );
                })}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
