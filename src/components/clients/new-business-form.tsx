
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form
} from '@/components/ui/form';

import { useToast } from '@/hooks/use-toast';
import { format, differenceInYears, isValid, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { getPolicyById, createPolicy, updatePolicy, generateNewSerialNumber } from '@/lib/policy-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, numberToWords } from '@/lib/utils';
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


const emptyFormValues: z.infer<typeof newBusinessFormSchema> = {
  onboardingStatus: 'Incomplete Policy',
  title: 'Mr',
  lifeAssuredFirstName: '',
  lifeAssuredMiddleName: '',
  lifeAssuredSurname: '',
  lifeAssuredDob: new Date(),
  placeOfBirth: '',
  email: '',
  phone: '',
  postalAddress: '',
  workTelephone: '',
  homeTelephone: '',
  residentialAddress: '',
  gpsAddress: '',
  ageNextBirthday: 0,
  maritalStatus: 'Single',
  dependents: 0,
  gender: 'Male',
  nationalIdType: 'National ID',
  idNumber: '',
  issueDate: new Date(),
  expiryDateId: undefined,
  placeOfIssue: '',
  country: 'Ghana',
  region: '',
  religion: 'Christian',
  nationality: 'Ghanaian',
  languages: '',
  contractType: 'The Education Policy',
  serial: '',
  policy: '',
  commencementDate: new Date(),
  policyTerm: 0,
  premiumTerm: 0,
  sumAssured: 0,
  premiumAmount: 0,
  paymentFrequency: 'Monthly',
  increaseMonth: '',
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
  premiumPayerDob: undefined,
  premiumPayerBusinessName: '',
  premiumPayerIdType: 'National ID',
  premiumPayerIdNumber: '',
  premiumPayerIssueDate: undefined,
  premiumPayerExpiryDate: undefined,
  premiumPayerPlaceOfIssue: '',
  bankName: '',
  bankBranch: '',
  amountInWords: '',
  sortCode: '',
  accountType: 'Savings',
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
  presentWaitingConsultation: 'no',
  presentTakingMedication: 'no',
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
};


function parseDates(data: any): any {
    if (!data) return data;
    const newData = { ...data };

    const dateKeys = [
        'lifeAssuredDob', 'issueDate', 'expiryDateId', 'commencementDate',
        'premiumPayerDob', 'premiumPayerIssueDate', 'premiumPayerExpiryDate',
    ];

    for (const key in newData) {
        if (Object.prototype.hasOwnProperty.call(newData, key)) {
            const value = newData[key];
            if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                const date = new Date(value);
                if (isValid(date)) {
                    newData[key] = date;
                }
            } else if (dateKeys.includes(key) && typeof value === 'string') {
                const date = parseISO(value);
                 if (isValid(date)) {
                    newData[key] = date;
                }
            }
            else if (Array.isArray(value)) {
                newData[key] = value.map(item => parseDates(item));
            } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
                newData[key] = parseDates(value);
            }
        }
    }
    return newData;
}


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
    defaultValues: emptyFormValues,
  });

  const { formState: { errors } } = form;

   React.useEffect(() => {
    async function fetchPolicy() {
      if (isEditMode && currentBusinessId) {
        const businessData = await getPolicyById(currentBusinessId);
        if (businessData) {
          const dataWithDates = parseDates(businessData);
          form.reset({
            ...emptyFormValues,
            ...dataWithDates,
          });
        }
      } else {
        form.setValue('commencementDate', new Date());
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
    if (lifeAssuredDob && lifeAssuredDob instanceof Date && !isNaN(lifeAssuredDob.getTime())) {
        form.setValue('increaseMonth', format(lifeAssuredDob, 'MMMM'));
    }
  }, [lifeAssuredDob, form]);

  React.useEffect(() => {
    if (lifeAssuredDob && lifeAssuredDob instanceof Date && isValid(lifeAssuredDob)) {
      const today = new Date();
      let age = today.getFullYear() - lifeAssuredDob.getFullYear();
      const monthDiff = today.getMonth() - lifeAssuredDob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < lifeAssuredDob.getDate())) {
        // age remains the same
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
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: error.message || 'An unexpected error occurred while saving your progress.',
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
    } catch (error: any) {
      console.error('Save and Close error:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: error.message || 'An unexpected error occurred while saving.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasErrorInTab = (tab: TabName) => {
    const tabErrorFields = tabFields[tab] as (keyof z.infer<typeof newBusinessFormSchema>)[];
    return tabErrorFields.some(field => errors[field]);
  };

    const onValidationErrors = (errors: FieldErrors) => {
        const errorKeys = Object.keys(errors) as (keyof z.infer<typeof newBusinessFormSchema>)[];
        
        for (const tab of TABS) {
            const fieldsInTab = tabFields[tab];
            const firstErrorFieldInTab = errorKeys.find(key => fieldsInTab.includes(key));
            
            if (firstErrorFieldInTab) {
                setActiveTab(tab);
                toast({
                    variant: 'destructive',
                    title: 'Validation Error',
                    description: `Please correct the errors on the "${tab.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}" tab.`,
                });
                return;
            }
        }

        toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: 'Please review all tabs and correct the highlighted errors.',
        });
    };

    const onSubmit = async (values: z.infer<typeof newBusinessFormSchema>) => {
        setIsSubmitting(true);
        
        try {
            if (!currentBusinessId) {
                throw new Error('No business ID found for final submission. Please save the form first.');
            }
            
            const finalValues = {
                ...values,
                onboardingStatus: 'Pending First Premium' as const,
            };
            
            await updatePolicy(currentBusinessId, finalValues as any);
            
            router.push('/business-development/sales/thank-you');
        } catch (error: any) {
            console.error('Form submission error:', error);
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: error.message || 'An unexpected error occurred. Please review all tabs for errors.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLastTab = activeTab === TABS[TABS.length - 1];
    
    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onValidationErrors)} className="space-y-8">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabName)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto">
                {TABS.map(tab => (
                <TabsTrigger key={tab} value={tab}>
                    <span className={cn(hasErrorInTab(tab) && 'text-destructive')}>
                        {tab.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                </TabsTrigger>
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
