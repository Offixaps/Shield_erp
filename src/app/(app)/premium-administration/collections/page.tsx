
'use client';

import * as React from 'react';
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
import Image from 'next/image';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Handshake, Smartphone, CircleStop } from 'lucide-react';


// TODO: Replace placeholder logos and colors with actual brand assets.
// Logos should be placed in the /public/logos/banks/ directory.
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
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(null);
  const [policies, setPolicies] = React.useState<NewBusiness[]>([]);
  const [filteredPolicies, setFilteredPolicies] = React.useState<NewBusiness[]>([]);

  React.useEffect(() => {
    const allPolicies = getPolicies();
    setPolicies(allPolicies);
  }, []);

  React.useEffect(() => {
    if (selectedFilter) {
      const activePoliciesForFilter = policies.filter(
        (p) => {
          // This logic needs to be adapted based on how non-bank payments are stored.
          // For now, we assume bankName covers all cases for simplicity.
          // In a real scenario, you might have a different field like 'paymentMethod'
          const isBank = bankBrandData.some(b => b.name === selectedFilter);
          if (isBank) {
            return p.policyStatus === 'Active' && p.bankName === selectedFilter
          }
          // Placeholder for non-bank filtering. 
          // You'd need to have a field on the policy to filter by, e.g. p.collectionMethod === selectedFilter
          return false;
        }
      );
      setFilteredPolicies(activePoliciesForFilter);
    } else {
      setFilteredPolicies([]);
    }
  }, [selectedFilter, policies]);

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
        title="Premium Collection"
        description="Select a collection method to view all active policies."
      />
      <Tabs defaultValue="bank" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bank">Bank Premium Collection</TabsTrigger>
          <TabsTrigger value="non-bank">Non-Bank Premium Collection</TabsTrigger>
        </TabsList>
        <TabsContent value="bank" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {bankBrandData.map((bank) => (
              <Card
                key={bank.name}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  selectedFilter === bank.name ? 'ring-2 ring-offset-2 ring-primary border-primary' : 'border-transparent'
                )}
                onClick={() => setSelectedFilter(bank.name)}
                style={{ 
                    backgroundColor: bank.color, 
                    color: bank.textColor
                }}
              >
                <CardContent className="flex flex-col items-center justify-center p-4 gap-3 text-center h-32">
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
            ))}
          </div>
        </TabsContent>
        <TabsContent value="non-bank" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {nonBankCollectionData.map((item) => {
                    const Icon = item.icon;
                    return (
                    <Card
                        key={item.name}
                        className={cn(
                        'cursor-pointer transition-all hover:shadow-md',
                        selectedFilter === item.filter ? 'ring-2 ring-offset-2 ring-primary' : ''
                        )}
                        onClick={() => setSelectedFilter(item.filter)}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-4 gap-3 text-center h-32">
                        <Icon className="h-10 w-10 text-primary" />
                        <p className="text-sm font-medium leading-tight">{item.name}</p>
                        </CardContent>
                    </Card>
                    );
                })}
            </div>
        </TabsContent>
      </Tabs>

      {selectedFilter && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Active Policies for {selectedFilter.replace(' (Ghana) Limited', '').replace(' PLC', '').replace(' Limited', '')}</CardTitle>
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
                No active policies found for {selectedFilter.replace(' (Ghana) Limited', '').replace(' PLC', '').replace(' Limited', '')}.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
