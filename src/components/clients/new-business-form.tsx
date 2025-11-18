
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form
} from '@/components/ui/form';

import { useToast } from '@/hooks/use-toast';
import { format, differenceInYears } from 'date-fns';
import { useRouter } from 'next/navigation';
import { getPolicyById, createPolicy, updatePolicy, generateNewSerialNumber } from '@/lib/policy-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { numberToWords } from '@/lib/utils';
import { FilePenLine, Send, Save, XCircle, AlertCircle } from 'lucide-react';
import { newBusinessFormSchema, type TabName, tabFields } from './new-business-form-schema';

import CoverageTab from './form-tabs/coverage-tab';
import BeneficiariesTab from './form-tabs/beneficiaries-tab';
import ExistingPoliciesTab from './form-tabs/existing-policies-tab';
import HealthTab from './form-tabs/health-tab';
import AgentTab from './form-tabs/agent-tab';
import PaymentDetailsTab from './form-tabs/payment-details-tab';
import DeclarationTab from './form-tabs/declaration-tab';
import LifestyleTab from './form-tabs/lifestyle-tab';
import { Loader2 } from 'lucide-react';
import type { NewBusiness } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { set } from 'date-fns';

type NewBusinessFormProps = {
    businessId?: string;
}

const TABS: TabName[] = [
    'coverage',
    'beneficiaries',
    'existing-policies',
    'health',
    'lifestyle',
    'payment-details',
    'agent',
    'declaration',
];


export default function NewBusinessForm({ businessId }: NewBusinessFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<TabName>('coverage');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(!!businessId);
  const [currentBusinessId, setCurrentBusinessId] = React.useState<string | undefined>(businessId);
  const [submissionError, setSubmissionError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof newBusinessFormSchema>>({
    resolver: zodResolver(newBusinessFormSchema),
    mode: 'onBlur',
    defaultValues: {
      ...newBusinessFormSchema.parse({
        // Provide explicit defaults for dates to avoid uncontrolled component errors
        lifeAssuredDob: new Date(),
        issueDate: new Date(),
        commencementDate: new Date(),
        // Initialize arrays to prevent uncontrolled errors
        primaryBeneficiaries: [],
        contingentBeneficiaries: [],
        existingPoliciesDetails: [],
        declinedPolicyDetails: [],
        bloodTransfusionOrSurgeryDetails: [],
        highBloodPressureDetails: [],
        cancerDetails: [],
        diabetesDetails: [],
        colitisCrohnsDetails: [],
        paralysisEpilepsyDetails: [],
        mentalIllnessDetails: [],
        arthritisDetails: [],
        chestPainDetails: [],
        asthmaDetails: [],
        digestiveDisorderDetails: [],
        bloodDisorderDetails: [],
        thyroidDisorderDetails: [],
        kidneyDisorderDetails: [],
        numbnessDetails: [],
        anxietyStressDetails: [],
        earEyeDisorderDetails: [],
        lumpGrowthDetails: [],
        hospitalAttendanceDetails: [],
        criticalIllnessDetails: [],
        stiDetails: [],
        presentSymptomsDetails: [],
        familyMedicalHistoryDetails: [],
        flownAsPilotDetails: [],
        hazardousSportsDetails: [],
        travelOutsideCountryDetails: [],
      }),
    },
  });

  // Watch for any form changes to clear the top-level error
  const formValues = form.watch();
  React.useEffect(() => {
    if (submissionError) {
      setSubmissionError(null);
    }
  }, [formValues, submissionError]);

  React.useEffect(() => {
    async function fetchPolicy() {
        if (isEditMode && currentBusinessId) {
          const businessData = await getPolicyById(currentBusinessId);
          if (businessData) {
            
            const nameParts = (businessData.client || '').split(' ');
            const title = (['Mr', 'Mrs', 'Miss', 'Dr', 'Prof', 'Hon'].find(t => t === nameParts[0]) || 'Mr') as 'Mr' | 'Mrs' | 'Miss' | 'Dr' | 'Prof' | 'Hon';
            const nameWithoutTitle = nameParts[0] === title ? nameParts.slice(1).join(' ') : businessData.client;
            const nameOnlyParts = nameWithoutTitle.split(' ');

            const firstName = nameOnlyParts[0] || '';
            const surname = nameOnlyParts.length > 1 ? nameOnlyParts[nameOnlyParts.length - 1] : '';
            const middleName = nameOnlyParts.length > 2 ? nameOnlyParts.slice(1, -1).join(' ') : '';
            
            const parseDate = (dateString: string | undefined | null): Date | undefined => {
                if (!dateString) return undefined;
                try {
                    const date = new Date(dateString);
                    // Check if the parsed date is valid
                    if (isNaN(date.getTime())) {
                        // Try parsing different formats if needed, or return undefined
                        const parts = dateString.split(/[-/]/);
                        if (parts.length === 3) {
                            // Assuming YYYY-MM-DD or MM/DD/YYYY
                            const year = parseInt(parts[0].length === 4 ? parts[0] : parts[2]);
                            const month = parseInt(parts[1]) -1;
                            const day = parseInt(parts[0].length === 4 ? parts[2] : parts[0]);
                             const robustDate = new Date(year, month, day);
                             if(!isNaN(robustDate.getTime())) return robustDate;
                        }
                        return undefined;
                    }
                    return date;
                } catch {
                    return undefined;
                }
            }

            const parseBeneficiaries = (beneficiaries: any[] | undefined) => {
                return (beneficiaries || []).map(b => ({...b, dob: b.dob ? new Date(b.dob) : undefined }));
            };
            
            const sanitizedData = {
                ...businessData,
                lifeAssuredFirstName: firstName,
                lifeAssuredMiddleName: middleName,
                lifeAssuredSurname: surname,
                contractType: businessData.product as "Buy Term and Invest in Mutual Fund" | "The Education Policy",
                premiumAmount: businessData.premium,
                lifeAssuredDob: parseDate(businessData.lifeAssuredDob),
                commencementDate: parseDate(businessData.commencementDate),
                issueDate: parseDate(businessData.issueDate),
                expiryDateId: parseDate(businessData.expiryDateId),
                primaryBeneficiaries: parseBeneficiaries(businessData.primaryBeneficiaries),
                contingentBeneficiaries: parseBeneficiaries(businessData.contingentBeneficiaries),
                existingPoliciesDetails: (businessData.existingPoliciesDetails || []).map(p => ({ ...p, issueDate: parseDate(p.issueDate) })),
            };

            form.reset(newBusinessFormSchema.parse(sanitizedData));
        }
      }
    }
    fetchPolicy();
  }, [isEditMode, currentBusinessId, form]);

  const lifeAssuredDob = form.watch('lifeAssuredDob');
  const premiumAmount = form.watch('premiumAmount');
  const monthlyBasicIncome = form.watch('monthlyBasicIncome');
  const otherIncome = form.watch('otherIncome');
  const ageNextBirthday = form.watch('ageNextBirthday');
  const contractType = form.watch('contractType');

  React.useEffect(() => {
    async function setSerialNumber() {
        if (contractType && !isEditMode && !form.getValues('serial')) {
            const newSerial = await generateNewSerialNumber();
            form.setValue('serial', newSerial);
        }
    }
    setSerialNumber();
  }, [contractType, isEditMode, form]);

  React.useEffect(() => {
    const dob = form.getValues('lifeAssuredDob');
    if (dob) {
        form.setValue('increaseMonth', format(new Date(dob), 'MMMM'));
    }
  }, [lifeAssuredDob, form]);

  React.useEffect(() => {
    if (lifeAssuredDob) {
      const today = new Date();
      let age = today.getFullYear() - lifeAssuredDob.getFullYear();
      const monthDiff = today.getMonth() - lifeAssuredDob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < lifeAssuredDob.getDate())) {
      } else {
        age += 1;
      }
      form.setValue('ageNextBirthday', age);
    }
  }, [lifeAssuredDob, form]);

   React.useEffect(() => {
    if (ageNextBirthday && ageNextBirthday > 0) {
      const policyTerm = 75 - ageNextBirthday;
      const premiumTerm = 65 - ageNextBirthday;

      form.setValue('policyTerm', Math.max(0, policyTerm));
      form.setValue('premiumTerm', Math.max(0, premiumTerm));
    }
  }, [ageNextBirthday, form]);

  React.useEffect(() => {
    const basic = Number(monthlyBasicIncome) || 0;
    const other = Number(otherIncome) || 0;
    form.setValue('totalMonthlyIncome', basic + other);
  }, [monthlyBasicIncome, otherIncome, form]);
  
  React.useEffect(() => {
    const amount = form.getValues('premiumAmount');
    if (amount && Number(amount) > 0) {
        const words = numberToWords(Number(amount));
        form.setValue('amountInWords', `${words} Ghana Cedis`);
    } else {
        form.setValue('amountInWords', '');
    }
  }, [premiumAmount, form]);
  
  const handleSaveAndNext = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    const currentTabFields = tabFields[activeTab];
    const isValid = await form.trigger(currentTabFields as any);

    if (!isValid) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please correct the errors on this tab before proceeding.',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const values = form.getValues();
      let policyId = currentBusinessId;

      if (isEditMode && policyId) {
        await updatePolicy(policyId, values as any);
        toast({
          title: 'Progress Saved',
          description: 'Your application has been updated successfully.',
        });
      } else {
        const newPolicyId = await createPolicy(values as any);
        setCurrentBusinessId(newPolicyId);
        setIsEditMode(true); 
        // Update URL without a full page reload/navigation
        window.history.replaceState(null, '', `/business-development/sales/${newPolicyId}/edit`);
        toast({
          title: 'Application Started',
          description: 'Your new application has been saved as Incomplete.',
        });
        policyId = newPolicyId;
      }

      const currentIndex = TABS.indexOf(activeTab);
      if (currentIndex < TABS.length - 1) {
        setActiveTab(TABS[currentIndex + 1]);
      }
    } catch (error: any) {
      console.error('Save and Next error:', error);
      const errorMessage = error.message || 'An unexpected error occurred while saving your progress.';
      setSubmissionError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndClose = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    const values = form.getValues();
    let policyId = currentBusinessId;

    try {
      if (isEditMode && policyId) {
        await updatePolicy(policyId, values as any);
      } else {
        policyId = await createPolicy(values as any);
      }
      toast({
        title: 'Progress Saved',
        description: 'Your application has been saved.',
      });
      router.push('/business-development/sales');
    } catch (error: any) {
      console.error('Save and Close error:', error);
      const errorMessage = error.message || 'An unexpected error occurred while saving.';
      setSubmissionError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const onSubmit = async (values: z.infer<typeof newBusinessFormSchema>) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      if (!currentBusinessId) {
        throw new Error('No business ID found for final submission. Please save the form first.');
      }
      
      const finalValues = {
        ...values,
        onboardingStatus: 'Pending First Premium' as const,
      };

      await updatePolicy(currentBusinessId, finalValues as any);

      toast({
        title: 'Application Submitted',
        description: 'Your new business application has been successfully submitted for review.',
      });
      router.push('/business-development/sales');
      router.refresh();
    } catch (error: any) {
      console.error('Form submission error:', error);
      const errorMessage = error.message || 'An unexpected error occurred. Please review all tabs for errors.';
      setSubmissionError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const isLastTab = activeTab === TABS[TABS.length - 1];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {submissionError && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{submissionError}</AlertDescription>
            </Alert>
        )}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabName)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto">
            {TABS.map(tab => (
              <TabsTrigger key={tab} value={tab}>{tab.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="coverage" className="mt-6 space-y-8">
            <CoverageTab form={form} />
          </TabsContent>
          <TabsContent value="beneficiaries" className="mt-6 space-y-8">
            <BeneficiariesTab form={form} />
          </TabsContent>
          <TabsContent value="existing-policies" className="mt-6 space-y-8">
            <ExistingPoliciesTab form={form} />
          </TabsContent>
          <TabsContent value="health" className="mt-6 space-y-8">
            <HealthTab form={form} />
          </TabsContent>
          <TabsContent value="lifestyle" className="mt-6 space-y-8">
            <LifestyleTab form={form} />
          </TabsContent>
          <TabsContent value="payment-details" className="mt-6">
            <PaymentDetailsTab form={form} />
          </TabsContent>
           <TabsContent value="agent" className="mt-6 space-y-8">
            <AgentTab form={form} />
          </TabsContent>
          <TabsContent value="declaration" className="mt-6 space-y-8">
            <DeclarationTab form={form} />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end p-4 gap-2">
           <Button type="button" variant="outline" onClick={handleSaveAndClose} disabled={isSubmitting}>
              <XCircle className="mr-2" />
              Save & Close
            </Button>
            {isLastTab ? (
                 <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2" />}
                    Submit Application
                </Button>
            ) : (
                <Button type="button" onClick={handleSaveAndNext} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2" />}
                    Save & Next
                </Button>
            )}
        </div>
      </form>
    </Form>
  );
}
