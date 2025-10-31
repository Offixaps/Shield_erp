'use client';

import * as React from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  XCircle,
  PauseCircle,
  ThumbsDown,
  FileClock,
  Check,
  Undo2,
} from 'lucide-react';
import AcceptPolicyDialog from '@/components/clients/accept-policy-dialog';
import type { NewBusiness } from '@/lib/data';
import { newBusinessData } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-base font-medium">{value || 'N/A'}</div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: React.ReactNode;
}) {
  return (
    <Card className="flex-1 bg-card">
      <CardHeader className="p-3">
        <p className="text-xs text-muted-foreground">{title}</p>
        <div className="text-sm font-semibold">{value}</div>
      </CardHeader>
    </Card>
  );
}

export default function ClientDetailsView({
  client: initialClient,
  from,
}: {
  client: NewBusiness;
  from: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  // We use state to manage client data to reflect updates without a full page reload
  const [client, setClient] = React.useState(initialClient);

  React.useEffect(() => {
    setClient(initialClient);
  }, [initialClient]);

  const isFromUnderwriting = from === 'underwriting';
  const canMakeDecision =
    isFromUnderwriting && client.onboardingStatus === 'Medicals Completed';
  const canStartMedicals =
    isFromUnderwriting && client.onboardingStatus === 'First Premium Confirmed';
  const isPendingMedicals =
    isFromUnderwriting && client.onboardingStatus === 'Pending Medicals';
  const isNTU = isFromUnderwriting && client.onboardingStatus === 'NTU';

  const updateOnboardingStatus = (
    newStatus: NewBusiness['onboardingStatus'],
    medicalUnderwritingState?: NewBusiness['medicalUnderwritingState']
  ) => {
    const businessIndex = newBusinessData.findIndex((b) => b.id === client.id);
    if (businessIndex !== -1) {
      const updatedClient = {
        ...newBusinessData[businessIndex],
        onboardingStatus: newStatus,
        ...(medicalUnderwritingState && { medicalUnderwritingState }),
      };
      newBusinessData[businessIndex] = updatedClient;
      setClient(updatedClient); // Update local state to re-render component

      toast({
        title: 'Status Updated',
        description: `Policy status changed to ${newStatus}.`,
      });
      router.refresh(); // Soft refresh to ensure data is in sync if needed elsewhere
    }
  };

  const handleStartMedicals = () => {
    updateOnboardingStatus('Pending Medicals', {
      started: true,
      startDate: new Date().toISOString(),
      completed: false,
    });
  };

  const handleMedicalsCompleted = () => {
    updateOnboardingStatus('Medicals Completed', {
      ...client.medicalUnderwritingState,
      completed: true,
    });
  };
  
  const handleRevertNTU = () => {
    updateOnboardingStatus('Pending Medicals');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      // Onboarding
      case 'pending mandate':
      case 'pending first premium':
      case 'pending medicals':
      case 'pending decision':
        return 'bg-yellow-500/80';
      case 'mandate verified':
      case 'first premium confirmed':
      case 'medicals completed':
        return 'bg-blue-500/80';
      case 'accepted':
      case 'active':
      case 'in force':
      case 'up to date':
      case 'first premium paid':
        return 'bg-green-500/80';
      case 'ntu':
      case 'deferred':
      case 'inactive':
        return 'bg-gray-500/80';
      case 'declined':
      case 'cancelled':
        return 'bg-red-500/80';
      case 'lapsed':
      case 'outstanding':
        return 'bg-orange-500/80';
      default:
        return 'bg-gray-500/80';
    }
  };

  const summaryDetails = [
    { title: 'Policy Number', value: client.policy || 'N/A' },
    { title: 'Contract Type', value: client.product },
    { title: 'Premium', value: `GHS ${client.premium.toFixed(2)}` },
    { title: 'Sum Assured', value: `GHS ${client.sumAssured.toFixed(2)}` },
    {
      title: 'Commencement Date',
      value: client.commencementDate
        ? format(new Date(client.commencementDate), 'PPP')
        : 'N/A',
    },
    {
      title: 'Expiry Date',
      value: client.expiryDate
        ? format(new Date(client.expiryDate), 'PPP')
        : 'N/A',
    },
    { title: 'Policy Term', value: `${client.policyTerm} years` },
    { title: 'Premium Term', value: `${client.premiumTerm} years` },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <PageHeader title={client.client} />
          <div className="flex flex-wrap gap-2">
            {canStartMedicals && (
              <Button onClick={handleStartMedicals}>
                <FileClock className="mr-2 h-4 w-4" />
                Start Medicals
              </Button>
            )}
            {isPendingMedicals && (
               <Button onClick={handleMedicalsCompleted}>
                <Check className="mr-2 h-4 w-4" />
                Medicals Completed
              </Button>
            )}
            {isNTU && (
                 <Button onClick={handleRevertNTU} variant="outline">
                    <Undo2 className="mr-2 h-4 w-4" />
                    Revert to Pending Medicals
                </Button>
            )}
            {canMakeDecision && (
              <>
                <AcceptPolicyDialog client={client} />
                <Button className="bg-sidebar text-sidebar-foreground hover:bg-sidebar/90">
                  <PauseCircle className="mr-2 h-4 w-4" />
                  Defer Policy
                </Button>
                <Button className="bg-sidebar text-sidebar-foreground hover:bg-sidebar/90">
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  NTU Policy
                </Button>
                <Button variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Decline Policy
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Onboarding Status:</span>
            <Badge
              className={cn(
                getStatusBadgeColor(client.onboardingStatus),
                'text-white'
              )}
            >
              {client.onboardingStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Billing Status:</span>
            <Badge
              className={cn(
                getStatusBadgeColor(client.billingStatus),
                'text-white'
              )}
            >
              {client.billingStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Policy Status:</span>
            <Badge
              className={cn(
                getStatusBadgeColor(client.policyStatus),
                'text-white'
              )}
            >
              {client.policyStatus}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="p-0">
            <h3 className="bg-summary p-2 font-medium uppercase text-sidebar-foreground rounded-t-md">
              Policy Summary
            </h3>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {summaryDetails.map((detail) => (
                <SummaryCard
                  key={detail.title}
                  title={detail.title}
                  value={detail.value}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-0">
            <h3 className="bg-sidebar p-2 font-medium uppercase text-sidebar-foreground rounded-t-md">
              Personal details of life insured
            </h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <DetailItem label="Life Assured Name" value={client.client} />
            <DetailItem label="Life Assured Date of Birth" value="1985-05-20" />
            <DetailItem label="Applicant Name" value={client.client} />
            <DetailItem label="Applicant Date of Birth" value="1985-05-20" />
            <DetailItem label="Age (Next Birthday)" value="40" />
            <DetailItem label="Email Address" value="j.doe@example.com" />
            <DetailItem label="Telephone Number" value={client.phone} />
            <DetailItem label="Postal Address" value="123 Main St, Accra" />
            <DetailItem label="Gender" value="Male" />
            <DetailItem label="Marital Status" value="Married" />
            <DetailItem label="Number of Dependents" value="2" />
            <DetailItem label="Nationality" value="Ghana" />
            <DetailItem label="Country" value="Ghana" />
            <DetailItem label="Religion" value="Christian" />
            <DetailItem label="Languages Spoken" value="English, Twi" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-0">
            <h3 className="bg-sidebar p-2 font-medium uppercase text-sidebar-foreground rounded-t-md">
              Identification
            </h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <DetailItem label="National ID Type" value="Passport" />
            <DetailItem label="ID Number" value="G1234567" />
            <DetailItem label="Place of Issue" value="Accra" />
            <DetailItem
              label="Issue Date"
              value={format(new Date('2020-01-01'), 'PPP')}
            />
            <DetailItem
              label="Expiry Date"
              value={format(new Date('2030-01-01'), 'PPP')}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-0">
            <h3 className="bg-sidebar p-2 font-medium uppercase text-sidebar-foreground rounded-t-md">
              Policy Details
            </h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <DetailItem label="Serial Number" value={client.serial} />
            <DetailItem label="Payment Frequency" value="Monthly" />
            <DetailItem
              label="Increase Month"
              value={client.commencementDate ? format(new Date(client.commencementDate), 'MMMM') : 'N/A'}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-0">
            <h3 className="bg-sidebar p-2 font-medium uppercase text-sidebar-foreground rounded-t-md">
              Employment Details
            </h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <DetailItem label="Occupation" value="Software Engineer" />
            <DetailItem label="Nature of Business/Work" value="Technology" />
            <DetailItem label="Employer" value="Google" />
            <DetailItem
              label="Employer Address"
              value="1600 Amphitheatre Parkway, Mountain View, CA"
            />
            <DetailItem label="Monthly Basic Income (GHS)" value="10,000.00" />
            <DetailItem label="Other Income (GHS)" value="2,000.00" />
            <DetailItem label="Total Monthly Income (GHS)" value="12,000.00" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-0">
            <h3 className="bg-sidebar p-2 font-medium uppercase text-sidebar-foreground rounded-t-md">
              Payment Details
            </h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <DetailItem label="Premium Payer Name" value={client.client} />
            <DetailItem
              label="Premium Payer Occupation"
              value="Accountant"
            />
            <DetailItem label="Bank Name" value="CalBank PLC" />
            <DetailItem label="Bank Branch" value="Accra Main" />
            <DetailItem label="Sort Code" value="123456" />
            <DetailItem label="Account Type" value="Current" />
            <DetailItem label="Bank Account Name" value={client.client} />
            <DetailItem
              label="Bank Account Number"
              value="00112233445566"
            />
            <DetailItem
              label="Premium Amount (GHS)"
              value={`GHS ${client.premium.toFixed(2)}`}
            />
            <DetailItem
              label="Amount in Words"
              value="One Hundred and Fifty Ghana Cedis"
            />
            <DetailItem
              label="Premium Deduction Frequency"
              value="Monthly"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-0">
            <h3 className="bg-sidebar p-2 font-medium uppercase text-sidebar-foreground rounded-t-md">
              Underwriting
            </h3>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Underwriting details, including risk assessments and decisions,
              will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
