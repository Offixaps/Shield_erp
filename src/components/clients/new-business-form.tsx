

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
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { getPolicyById, createPolicy, updatePolicy } from '@/lib/policy-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { numberToWords } from '@/lib/utils';
import { FilePenLine, Send } from 'lucide-react';
import { newBusinessFormSchema } from './new-business-form-schema';

import CoverageTab from './form-tabs/coverage-tab';
import BeneficiariesTab from './form-tabs/beneficiaries-tab';
import ExistingPoliciesTab from './form-tabs/existing-policies-tab';
import HealthTab from './form-tabs/health-tab';
import AgentTab from './form-tabs/agent-tab';
import PaymentDetailsTab from './form-tabs/payment-details-tab';
import DeclarationTab from './form-tabs/declaration-tab';
import LifestyleTab from './form-tabs/lifestyle-tab';

type NewBusinessFormProps = {
    businessId?: string;
}

type TabName = 
    | 'coverage'
    | 'beneficiaries'
    | 'existing-policies'
    | 'health'
    | 'lifestyle'
    | 'declaration'
    | 'agent'
    | 'payment-details';

export default function NewBusinessForm({ businessId }: NewBusinessFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<TabName>('coverage');
  const isEditMode = !!businessId;

  const form = useForm<z.infer<typeof newBusinessFormSchema>>({
    resolver: zodResolver(newBusinessFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
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
        nationality: 'Ghanaian',
        languages: '',
        serialNumber: '',
        policyNumber: '',
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
        alcoholBeer: { consumed: false, averagePerWeek: '' },
        alcoholWine: { consumed: false, averagePerWeek: '' },
        alcoholSpirits: { consumed: false, averagePerWeek: '' },
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

  const isPolicyHolderPayer = form.watch('isPolicyHolderPayer');
    React.useEffect(() => {
        form.trigger();
    }, [isPolicyHolderPayer, form]);


  React.useEffect(() => {
    if (isEditMode && businessId) {
      getPolicyById(parseInt(businessId, 10)).then(businessData => {
          if (businessData) {
            const nameParts = businessData.client.split(' ');
            const title = (['Mr', 'Mrs', 'Miss', 'Dr', 'Prof', 'Hon'].find(t => t === nameParts[0]) || 'Mr') as 'Mr' | 'Mrs' | 'Miss' | 'Dr' | 'Prof' | 'Hon';
            const nameWithoutTitle = nameParts[0] === title ? nameParts.slice(1).join(' ') : businessData.client;
            const nameOnlyParts = nameWithoutTitle.split(' ');

            const firstName = nameOnlyParts[0] || '';
            const surname = nameOnlyParts.length > 1 ? nameOnlyParts[nameOnlyParts.length - 1] : '';
            const middleName = nameOnlyParts.length > 2 ? nameOnlyParts.slice(1, -1).join(' ') : '';
            
            const data: any = { ...businessData };
            const parseDate = (dateString: string | undefined) => dateString ? new Date(dateString) : undefined;
            
            const parseBeneficiaries = (beneficiaries: any[] | undefined) => {
                return (beneficiaries || []).map(b => ({...b, dob: new Date(b.dob)}));
            };

            const defaultValues = {
              ...businessData,
              lifeAssuredFirstName: firstName,
              lifeAssuredMiddleName: middleName,
              lifeAssuredSurname: surname,
              policyNumber: businessData.policy || '',
              contractType: businessData.product as "Buy Term and Invest in Mutual Fund" | "The Education Policy",
              premiumAmount: businessData.premium,
              commencementDate: new Date(businessData.commencementDate),
              expiryDate: parseDate(data.expiryDate),
              lifeAssuredDob: parseDate(data.lifeAssuredDob),
              issueDate: parseDate(data.issueDate),
              isPolicyHolderPayer: businessData.client === businessData.payerName,
              primaryBeneficiaries: parseBeneficiaries(businessData.primaryBeneficiaries),
              contingentBeneficiaries: parseBeneficiaries(businessData.contingentBeneficiaries),
              existingPoliciesDetails: (businessData.existingPoliciesDetails || []).map(p => ({ ...p, issueDate: new Date(p.issueDate) })),
            };
            form.reset(defaultValues as any);
        }
      });
    }
  }, [isEditMode, businessId, form]);

  const commencementDate = form.watch('commencementDate');
  const lifeAssuredDob = form.watch('lifeAssuredDob');
  const premiumAmount = form.watch('premiumAmount');
  const monthlyBasicIncome = form.watch('monthlyBasicIncome');
  const otherIncome = form.watch('otherIncome');
  const ageNextBirthday = form.watch('ageNextBirthday');

  React.useEffect(() => {
    if (commencementDate) {
      form.setValue('increaseMonth', format(commencementDate, 'MMMM'));
    }
  }, [commencementDate, form]);

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
  

  async function onSubmit(values: z.infer<typeof newBusinessFormSchema>) {
    try {
        if (isEditMode) {
            await updatePolicy(parseInt(businessId!), values as any);
        } else {
            await createPolicy(values);
        }
        toast({
            title: isEditMode ? 'Form Updated' : 'Form Submitted',
            description: isEditMode ? 'Policy details have been successfully updated.' : 'New client and policy details have been captured.',
        });
        router.push('/business-development/sales');
        router.refresh();
    } catch (error) {
        console.error("Form submission error:", error);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: "An unexpected error occurred while submitting the form.",
        });
    }
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab as (value: string) => void} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto">
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
            <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
            <TabsTrigger value="existing-policies">Existing Policies</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="declaration">Declaration</TabsTrigger>
            <TabsTrigger value="agent">Agent</TabsTrigger>
            <TabsTrigger value="payment-details">Payment Details</TabsTrigger>
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
          
          <TabsContent value="declaration" className="mt-6 space-y-8">
            <DeclarationTab form={form} />
          </TabsContent>

          <TabsContent value="agent" className="mt-6 space-y-8">
            <AgentTab form={form} />
          </TabsContent>

          <TabsContent value="payment-details" className="mt-6">
            <PaymentDetailsTab form={form} />
          </TabsContent>

        </Tabs>
        
        <div className="flex justify-end p-4">
            <Button type="submit">
                {isEditMode ? <><FilePenLine className="mr-2" />Update Application</> : <><Send className="mr-2" />Submit Application</>}
            </Button>
        </div>
      </form>
    </Form>
  );
}
