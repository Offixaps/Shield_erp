

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
import { FilePenLine, Send, Save, XCircle } from 'lucide-react';
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

  const form = useForm<z.infer<typeof newBusinessFormSchema>>({
    resolver: zodResolver(newBusinessFormSchema),
    mode: 'onBlur',
    defaultValues: {
        onboardingStatus: 'Incomplete Policy',
        title: 'Mr',
        lifeAssuredFirstName: '',
        lifeAssuredMiddleName: '',
        lifeAssuredSurname: '',
        placeOfBirth: '',
        email: '',
        phone: '',
        postalAddress: '',
        workTelephone: '',
        homeTelephone: '',
        residentialAddress: '',
        gpsAddress: '',
        ageNextBirthday: 0,
        dependents: 0,
        idNumber: '',
        placeOfIssue: '',
        country: 'Ghana',
        region: '',
        religion: undefined,
        nationality: 'Ghanaian',
        languages: '',
        serial: '',
        policy: '',
        policyTerm: 0,
        premiumTerm: 0,
        sumAssured: 0,
        premiumAmount: 0,
        increaseMonth: format(new Date(), 'MMMM'),
        agentName: '',
        agentCode: '',
        uplineName: '',
        uplineCode: '',
        introducerCode: '',
        occupation: '',
        natureOfBusiness: '',
        employer: '',
        employerAddress: '',
        monthlyBasicIncome: 0,
        otherIncome: 0,
        totalMonthlyIncome: 0,
        isPolicyHolderPayer: true,
        premiumPayerSurname: '',
        premiumPayerOtherNames: '',
        premiumPayerOccupation: '',
        premiumPayerRelationship: '',
        premiumPayerResidentialAddress: '',
        premiumPayerPostalAddress: '',
        premiumPayerBusinessName: '',
        premiumPayerIdNumber: '',
        premiumPayerPlaceOfIssue: '',
        bankName: '',
        bankBranch: '',
        amountInWords: '',
        sortCode: '',
        accountType: undefined,
        bankAccountName: '',
        bankAccountNumber: '',
        paymentAuthoritySignature: '',
        lifeInsuredSignature: '',
        policyOwnerSignature: '',
        primaryBeneficiaries: [],
        contingentBeneficiaries: [],
        hasExistingPolicies: 'no',
        existingPoliciesDetails: [],
        declinedPolicy: 'no',
        declinedPolicyDetails: [],
        height: 0,
        heightUnit: 'cm',
        weight: 0,
        bmi: 0,
        alcoholHabits: 'never_used',
        alcoholBeer: { consumed: false, averagePerWeek: '', notes: '' },
        alcoholWine: { consumed: false, averagePerWeek: '', notes: '' },
        alcoholSpirits: { consumed: false, averagePerWeek: '', notes: '' },
        reducedAlcoholMedicalAdvice: { reduced: 'no', notes: '' },
        reducedAlcoholHealthProblems: { reduced: 'no', notes: '' },
        tobaccoHabits: 'never_smoked',
        usedNicotineLast12Months: 'no',
        tobaccoCigarettes: { smoked: false, avgPerDay: '', avgPerWeek: '' },
        tobaccoCigars: { smoked: false, avgPerDay: '', avgPerWeek: '' },
        tobaccoPipe: { smoked: false, avgPerDay: '', avgPerWeek: '' },
        tobaccoNicotineReplacement: { smoked: false, avgPerDay: '', avgPerWeek: '' },
        tobaccoEcigarettes: { smoked: false, avgPerDay: '', avgPerWeek: '' },
        tobaccoOther: { smoked: false, avgPerDay: '', avgPerWeek: '', otherType: '' },
        usedRecreationalDrugs: 'no',
        injectedNonPrescribedDrugs: 'no',
        testedPositiveViralInfection: 'no',
        testedPositiveFor: { hiv: false, hepB: false, hepC: false },
        awaitingResultsFor: { hiv: false, hepB: false, hepC: false },
        bloodTransfusionOrSurgery: 'no',
        bloodTransfusionOrSurgeryDetails: [],
        highBloodPressure: 'no',
        highBloodPressureDetails: [],
        cancer: 'no',
        cancerDetails: [],
        diabetes: 'no',
        diabetesDetails: [],
        colitisCrohns: 'no',
        colitisCrohnsDetails: [],
        paralysisEpilepsy: 'no',
        paralysisEpilepsyDetails: [],
        mentalIllness: 'no',
        mentalIllnessDetails: [],
        arthritis: 'no',
        arthritisDetails: [],
        chestPain: 'no',
        chestPainDetails: [],
        asthma: 'no',
        asthmaDetails: [],
        digestiveDisorder: 'no',
        digestiveDisorderDetails: [],
        bloodDisorder: 'no',
        bloodDisorderDetails: [],
        thyroidDisorder: 'no',
        thyroidDisorderDetails: [],
        kidneyDisorder: 'no',
        kidneyDisorderDetails: [],
        numbness: 'no',
        numbnessDetails: [],
        anxietyStress: 'no',
        anxietyStressDetails: [],
        earEyeDisorder: 'no',
        earEyeDisorderDetails: [],
        lumpGrowth: 'no',
        lumpGrowthDetails: [],
        hospitalAttendance: 'no',
        hospitalAttendanceDetails: [],
        criticalIllness: 'no',
        criticalIllnessDetails: [],
        sti: 'no',
        stiDetails: [],
        presentSymptoms: 'no',
        presentSymptomsDetails: [],
        familyMedicalHistory: 'no',
        familyMedicalHistoryDetails: [],
        currentDoctorName: '',
        currentDoctorPhone: '',
        currentDoctorHospital: '',
        previousDoctorName: '',
        previousDoctorPhone: '',
        previousDoctorHospital: '',
        flownAsPilot: 'no',
        flownAsPilotDetails: [],
        hazardousSports: 'no',
        hazardousSportsDetails: [],
        travelOutsideCountry: 'no',
        travelOutsideCountryDetails: [],
    }
  });

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
                return dateString ? new Date(dateString) : undefined;
            }

            const parseBeneficiaries = (beneficiaries: any[] | undefined) => {
                return (beneficiaries || []).map(b => ({...b, dob: b.dob ? new Date(b.dob) : undefined }));
            };
            
            // Create a sanitized object that matches the form's expected structure and types
            const sanitizedData: Partial<z.infer<typeof newBusinessFormSchema>> = {
                ...form.getValues(), // Start with form defaults to ensure all keys are present
                ...businessData, // Overwrite with fetched data
                 // Ensure all numeric fields have a default value of 0 if null/undefined
                ageNextBirthday: businessData.ageNextBirthday || 0,
                dependents: businessData.dependents || 0,
                policyTerm: businessData.policyTerm || 0,
                premiumTerm: businessData.premiumTerm || 0,
                sumAssured: businessData.sumAssured || 0,
                premiumAmount: businessData.premium || 0,
                monthlyBasicIncome: businessData.monthlyBasicIncome || 0,
                otherIncome: businessData.otherIncome || 0,
                totalMonthlyIncome: businessData.totalMonthlyIncome || 0,
                height: businessData.height || 0,
                weight: businessData.weight || 0,
                bmi: businessData.bmi || 0,
                // Ensure all string fields have a default of ''
                lifeAssuredFirstName: firstName,
                lifeAssuredMiddleName: middleName,
                lifeAssuredSurname: surname,
                placeOfBirth: businessData.placeOfBirth || '',
                email: businessData.email || '',
                phone: businessData.phone || '',
                postalAddress: businessData.postalAddress || '',
                workTelephone: businessData.workTelephone || '',
                homeTelephone: businessData.homeTelephone || '',
                residentialAddress: businessData.residentialAddress || '',
                gpsAddress: businessData.gpsAddress || '',
                idNumber: businessData.idNumber || '',
                placeOfIssue: businessData.placeOfIssue || '',
                country: businessData.country || 'Ghana',
                nationality: businessData.nationality || 'Ghanaian',
                languages: businessData.languages || '',
                serial: businessData.serial || '',
                policy: businessData.policy || '',
                agentName: businessData.agentName || '',
                agentCode: businessData.agentCode || '',
                uplineName: businessData.uplineName || '',
                uplineCode: businessData.uplineCode || '',
                introducerCode: businessData.introducerCode || '',
                occupation: businessData.occupation || '',
                natureOfBusiness: businessData.natureOfBusiness || '',
                employer: businessData.employer || '',
                employerAddress: businessData.employerAddress || '',
                bankName: businessData.bankName || '',
                bankBranch: businessData.bankBranch || '',
                amountInWords: businessData.amountInWords || '',
                sortCode: businessData.sortCode || '',
                bankAccountName: businessData.bankAccountName || '',
                bankAccountNumber: businessData.bankAccountNumber || '',
                paymentAuthoritySignature: businessData.paymentAuthoritySignature || '',
                lifeInsuredSignature: businessData.lifeInsuredSignature || '',
                policyOwnerSignature: businessData.policyOwnerSignature || '',
                premiumPayerSurname: (businessData as any).premiumPayerSurname || '',
                premiumPayerOtherNames: (businessData as any).premiumPayerOtherNames || '',
                premiumPayerOccupation: (businessData as any).premiumPayerOccupation || '',
                premiumPayerRelationship: (businessData as any).premiumPayerRelationship || '',
                premiumPayerResidentialAddress: (businessData as any).premiumPayerResidentialAddress || '',
                premiumPayerPostalAddress: (businessData as any).premiumPayerPostalAddress || '',
                premiumPayerBusinessName: (businessData as any).premiumPayerBusinessName || '',
                premiumPayerIdNumber: (businessData as any).premiumPayerIdNumber || '',
                premiumPayerPlaceOfIssue: (businessData as any).premiumPayerPlaceOfIssue || '',
                currentDoctorName: (businessData as any).currentDoctorName || '',
                currentDoctorPhone: (businessData as any).currentDoctorPhone || '',
                currentDoctorHospital: (businessData as any).currentDoctorHospital || '',
                previousDoctorName: (businessData as any).previousDoctorName || '',
                previousDoctorPhone: (businessData as any).previousDoctorPhone || '',
                previousDoctorHospital: (businessData as any).previousDoctorHospital || '',
                // Map product to contractType
                contractType: businessData.product as "Buy Term and Invest in Mutual Fund" | "The Education Policy",
                // Handle dates
                lifeAssuredDob: parseDate(businessData.lifeAssuredDob),
                commencementDate: parseDate(businessData.commencementDate),
                expiryDate: parseDate(businessData.expiryDate),
                issueDate: parseDate(businessData.issueDate),
                expiryDateId: parseDate(businessData.expiryDateId),
                premiumPayerDob: parseDate((businessData as any).premiumPayerDob),
                premiumPayerIssueDate: parseDate((businessData as any).premiumPayerIssueDate),
                premiumPayerExpiryDate: parseDate((businessData as any).premiumPayerExpiryDate),
                // Handle arrays
                primaryBeneficiaries: parseBeneficiaries(businessData.primaryBeneficiaries),
                contingentBeneficiaries: parseBeneficiaries(businessData.contingentBeneficiaries),
                existingPoliciesDetails: (businessData.existingPoliciesDetails || []).map(p => ({ ...p, issueDate: new Date(p.issueDate) })),
            };

            form.reset(sanitizedData as any);
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
    } catch (error) {
      console.error('Save and Next error:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'An unexpected error occurred while saving your progress.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndClose = async () => {
    setIsSubmitting(true);
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
    } catch (error) {
      console.error('Save and Close error:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'An unexpected error occurred while saving.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const onSubmit = async (values: z.infer<typeof newBusinessFormSchema>) => {
    setIsSubmitting(true);
    try {
      if (!currentBusinessId) {
        throw new Error('No business ID found for final submission.');
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
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'An unexpected error occurred. Please review all tabs for errors.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const isLastTab = activeTab === TABS[TABS.length - 1];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
