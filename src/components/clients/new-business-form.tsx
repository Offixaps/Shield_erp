

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

import CoverageTab from './form-tabs/coverage-tab';
import BeneficiariesTab from './form-tabs/beneficiaries-tab';
import ExistingPoliciesTab from './form-tabs/existing-policies-tab';
import HealthTab from './form-tabs/health-tab';
import AgentTab from './form-tabs/agent-tab';
import PaymentDetailsTab from './form-tabs/payment-details-tab';
import DeclarationTab from './form-tabs/declaration-tab';
import LifestyleTab from './form-tabs/lifestyle-tab';


const idTypes = [
  "Driver's License",
  'Passport',
  'Voter ID',
  'National ID',
  'SSNIT',
  'NHIS',
  'TIN',
] as const;

const beneficiarySchema = z.object({
    name: z.string().min(1, "Name is required."),
    dob: z.date({ required_error: 'Date of birth is required.' }),
    gender: z.enum(['Male', 'Female']),
    relationship: z.string().min(1, "Relationship is required."),
    telephone: z.string().optional(),
    percentage: z.coerce.number().min(0).max(100, "Percentage must be between 0 and 100."),
    isIrrevocable: z.boolean().optional().default(false),
});

const existingPolicySchema = z.object({
  companyName: z.string().min(1, "Company name is required."),
  personCovered: z.string().min(1, "Name of person covered is required."),
  policyType: z.string().min(1, "Type of policy is required."),
  issueDate: z.date({ required_error: 'Issue date is required.' }),
  premiumAmount: z.coerce.number().positive(),
  faceAmount: z.coerce.number().positive(),
  changedGrpOrInd: z.enum(['yes', 'no'], { required_error: "This field is required."}),
});

const declinedPolicySchema = z.object({
    companyName: z.string().min(1, "Company name is required."),
    details: z.string().min(1, "Details are required."),
});

const alcoholHabitsOptions = [
    'never_used',
    'occasional_socially',
    'ex_drinker_over_5_years',
    'ex_drinker_1_to_5_years',
    'ex_drinker_within_1_year',
    'current_regular_drinker',
] as const;

const alcoholDetailSchema = z.object({
    consumed: z.boolean().default(false),
    averagePerWeek: z.string().optional(),
    notes: z.string().optional(),
});

const reducedAlcoholReasonSchema = z.object({
    reduced: z.enum(['yes', 'no']),
    notes: z.string().optional(),
}).optional();

const tobaccoHabitsOptions = [
    'never_smoked',
    'ex_smoker_over_5_years',
    'ex_smoker_1_to_5_years',
    'ex_smoker_within_1_year',
    'smoke_occasionally_socially',
    'current_regular_smoker',
] as const;

const tobaccoDetailSchema = z.object({
    smoked: z.boolean().default(false),
    avgPerDay: z.string().optional(),
    avgPerWeek: z.string().optional(),
    otherType: z.string().optional(),
});

const viralInfectionDetailSchema = z.object({
    hiv: z.boolean().default(false),
    hepB: z.boolean().default(false),
    hepC: z.boolean().default(false),
});

export const illnessDetailSchema = z.object({
  illness: z.string().min(1, 'Illness/Injury is required.'),
  date: z.date({ required_error: 'Date is required.' }).optional(),
  hospital: z.string().optional(),
  duration: z.string().optional(),
  status: z.string().optional(),
  // High Blood Pressure
  diagnosisDate: z.date().optional(),
  bpReadingAtDiagnosis: z.string().optional(),
  causeOfHighBp: z.string().optional(),
  prescribedTreatment: z.string().optional(),
  complications: z.string().optional(),
  monitoringFrequency: z.string().optional(),
  lastMonitoredDate: z.date().optional(),
  lastBpReading: z.string().optional(),
  sugarCholesterolChecked: z.string().optional(),
  // Diabetes
  diabetesFirstSignsDate: z.date().optional(),
  diabetesSymptoms: z.string().optional(),
  diabetesConsulted: z.enum(['yes', 'no']).optional(),
  diabetesDiagnosisDate: z.date().optional(),
  diabetesHospitalized: z.string().optional(),
  diabetesTakingInsulin: z.string().optional(),
  diabetesOralTreatment: z.string().optional(),
  diabetesDosageVaried: z.string().optional(),
  diabetesRegularTests: z.string().optional(),
  diabetesLatestBloodSugar: z.string().optional(),
  diabetesDiabeticComa: z.string().optional(),
  diabetesComplications: z.string().optional(),
  diabetesOtherExams: z.string().optional(),
  diabetesOtherConsultations: z.string().optional(),
  // Asthma
  asthmaFirstSignsAge: z.coerce.number().optional(),
  asthmaSymptomDuration: z.string().optional(),
  asthmaSymptomFrequency: z.string().optional(),
  asthmaTrigger: z.string().optional(),
  asthmaLastAttackDate: z.date().optional(),
  asthmaSeverity: z.enum(['Mild', 'Moderate', 'Severe']).optional(),
  asthmaMedication: z.string().optional(),
  asthmaSteroidTherapy: z.string().optional(),
  asthmaHospitalization: z.string().optional(),
  asthmaWorkAbsence: z.string().optional(),
  asthmaFunctionalLimitation: z.string().optional(),
  asthmaChestXRay: z.string().optional(),
  asthmaComplicatingFeatures: z.string().optional(),
  // Digestive Disorders
  digestiveSymptoms: z.string().optional(),
  digestiveSymptomFrequency: z.string().optional(),
  digestiveConditionStartDate: z.date().optional(),
  digestivePreciseDiagnosis: z.string().optional(),
  digestiveMedication: z.string().optional(),
  hadEndoscopy: z.enum(['yes', 'no']).optional(),
  endoscopyDetails: z.string().optional(),
  hadDigestiveSurgery: z.enum(['yes', 'no']).optional(),
  problemsAfterSurgery: z.enum(['yes', 'no']).optional(),
  problemsAfterSurgeryDetails: z.string().optional(),
  isReceivingTreatmentNow: z.enum(['yes', 'no']).optional(),
  treatmentDetails: z.string().optional(),
  dischargeDate: z.date().optional(),
});

const familyMedicalHistoryDetailSchema = z.object({
  condition: z.string().min(1, 'Condition is required.'),
  relation: z.string().min(1, 'Relation is required.'),
  ageOfOccurrence: z.coerce.number().positive('Age must be a positive number.').optional(),
  currentAgeOrAgeAtDeath: z.coerce.number().positive('Age must be a positive number.').optional(),
});

const lifestyleDetailSchema = z.object({
    item: z.string().min(1, "Item selection is required."),
    details: z.string().optional(),
});


export const newBusinessFormSchema = z
  .object({
    // Client Details
    title: z.enum(['Mr', 'Mrs', 'Miss', 'Dr', 'Prof', 'Hon']),
    lifeAssuredFirstName: z.string().min(2, 'First name must be at least 2 characters.'),
    lifeAssuredMiddleName: z.string().optional(),
    lifeAssuredSurname: z.string().min(2, 'Surname must be at least 2 characters.'),
    lifeAssuredDob: z.date({ required_error: 'Date of birth is required.' }),
    placeOfBirth: z.string().min(2, 'Place of birth is required.'),
    email: z.string().email('Invalid email address.'),
    phone: z.string().min(10, 'Telephone Number must be at least 10 digits.'),
    postalAddress: z.string().min(5, 'Postal address is required.'),
    workTelephone: z.string().optional(),
    homeTelephone: z.string().optional(),
    residentialAddress: z.string().optional(),
    gpsAddress: z.string().optional(),
    ageNextBirthday: z.coerce.number().optional(),
    maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
    dependents: z.coerce.number().min(0, 'Number of dependents cannot be negative.'),
    gender: z.enum(['Male', 'Female']),
    nationalIdType: z.enum(idTypes),
    idNumber: z.string().min(2, 'ID Number is required.'),
    issueDate: z.date({ required_error: 'Issue date is required.' }),
    expiryDate: z.date().optional(),
    placeOfIssue: z.string().min(2, 'Place of issue is required.'),
    country: z.string().min(2, 'Country is required.'),
    region: z.string().optional(),
    religion: z.enum(['Christian', 'Muslim', 'Traditional', 'Other']),
    nationality: z.string().min(2, 'Nationality is required.'),
    languages: z.string().min(2, 'Languages spoken is required.'),

    // Coverage Details
    contractType: z.enum([
      'Buy Term and Invest in Mutual Fund',
      'The Education Policy',
    ]),
    serialNumber: z.string().regex(/^\d{4}$/, 'Serial number must be a 4-digit number.'),
    policyNumber: z.string().optional(),
    commencementDate: z.date({ required_error: 'A start date is required.' }),
    policyTerm: z.coerce.number().positive('Policy term must be a positive number.'),
    premiumTerm: z.coerce.number().positive('Premium term must be a positive number.'),
    sumAssured: z.coerce
      .number()
      .positive('Sum assured must be a positive number.'),
    premiumAmount: z.coerce
      .number()
      .positive('Premium amount must be a positive number.'),
    paymentFrequency: z.enum(['Monthly', 'Annually', 'Quarterly', 'Bi-Annually']),
    increaseMonth: z.string().min(1, 'Increase month is required.'),

    // Agent Details
    agentName: z.string().optional(),
    agentCode: z.string().optional(),
    uplineName: z.string().optional(),
    uplineCode: z.string().optional(),
    introducerCode: z.string().optional(),

    // Employment Details
    occupation: z.string().min(2, 'Occupation is required.'),
    natureOfBusiness: z.string().min(2, 'Nature of business/work is required.'),
    employer: z.string().min(2, 'Employer is required.'),
    employerAddress: z.string().min(5, 'Employer address is required.'),
    monthlyBasicIncome: z.coerce.number().positive('Monthly basic income must be a positive number.'),
    otherIncome: z.coerce.number().min(0, 'Other income cannot be negative.'),
    totalMonthlyIncome: z.coerce.number().optional(),

    // Payment Details
    isPolicyHolderPayer: z.boolean().default(true),
    premiumPayerSurname: z.string().optional(),
    premiumPayerOtherNames: z.string().optional(),
    premiumPayerOccupation: z.string().optional(),
    premiumPayerRelationship: z.string().optional(),
    premiumPayerResidentialAddress: z.string().optional(),
    premiumPayerPostalAddress: z.string().optional(),
    premiumPayerDob: z.date().optional(),
    premiumPayerBusinessName: z.string().optional(),
    premiumPayerIdType: z.enum(idTypes).optional(),
    premiumPayerIdNumber: z.string().optional(),
    premiumPayerIssueDate: z.date().optional(),
    premiumPayerExpiryDate: z.date().optional(),
    premiumPayerPlaceOfIssue: z.string().optional(),
    bankName: z.string().min(2, 'Bank name is required.'),
    bankBranch: z.string().min(2, 'Bank branch is required.'),
    amountInWords: z.string().min(3, 'Amount in words is required.'),
    sortCode: z.string().min(6, 'Sort code must be at least 6 characters.'),
    accountType: z.enum(['Current', 'Savings', 'Other']),
    bankAccountName: z.string().min(2, 'Bank account name is required.'),
    bankAccountNumber: z.string().min(10, 'Bank account number must be at least 10 digits.'),
    paymentAuthoritySignature: z.string().optional(),
    lifeInsuredSignature: z.string().optional(),
    policyOwnerSignature: z.string().optional(),

    // Beneficiaries
    primaryBeneficiaries: z.array(beneficiarySchema).optional(),
    contingentBeneficiaries: z.array(beneficiarySchema).optional(),
    
    // Existing Policies
    hasExistingPolicies: z.enum(['yes', 'no']),
    existingPoliciesDetails: z.array(existingPolicySchema).optional(),
    declinedPolicy: z.enum(['yes', 'no']),
    declinedPolicyDetails: z.array(declinedPolicySchema).optional(),
    
    // Health
    height: z.coerce.number().positive('Height must be a positive number.').optional(),
    heightUnit: z.enum(['m', 'cm', 'ft']).default('cm'),
    weight: z.coerce.number().positive('Weight must be a positive number.').optional(),
    bmi: z.coerce.number().optional(),
    alcoholHabits: z.enum(alcoholHabitsOptions),
    alcoholBeer: alcoholDetailSchema.optional(),
    alcoholWine: alcoholDetailSchema.optional(),
    alcoholSpirits: alcoholDetailSchema.optional(),
    reducedAlcoholMedicalAdvice: reducedAlcoholReasonSchema.optional(),
    reducedAlcoholHealthProblems: reducedAlcoholReasonSchema.optional(),
    tobaccoHabits: z.enum(tobaccoHabitsOptions),
    usedNicotineLast12Months: z.enum(['yes', 'no']),
    tobaccoCigarettes: tobaccoDetailSchema.optional(),
    tobaccoCigars: tobaccoDetailSchema.optional(),
    tobaccoPipe: tobaccoDetailSchema.optional(),
    tobaccoNicotineReplacement: tobaccoDetailSchema.optional(),
    tobaccoEcigarettes: tobaccoDetailSchema.optional(),
    tobaccoOther: tobaccoDetailSchema.optional(),
    usedRecreationalDrugs: z.enum(['yes', 'no']),
    injectedNonPrescribedDrugs: z.enum(['yes', 'no']),
    testedPositiveViralInfection: z.enum(['yes', 'no']),
    testedPositiveFor: viralInfectionDetailSchema.optional(),
    awaitingResultsFor: viralInfectionDetailSchema.optional(),

    // Medical History
    bloodTransfusionOrSurgery: z.enum(['yes', 'no']),
    bloodTransfusionOrSurgeryDetails: z.array(illnessDetailSchema).optional(),
    highBloodPressure: z.enum(['yes', 'no']),
    highBloodPressureDetails: z.array(illnessDetailSchema).optional(),
    cancer: z.enum(['yes', 'no']),
    cancerDetails: z.array(illnessDetailSchema).optional(),
    diabetes: z.enum(['yes', 'no']),
    diabetesDetails: z.array(illnessDetailSchema).optional(),
    colitisCrohns: z.enum(['yes', 'no']),
    colitisCrohnsDetails: z.array(illnessDetailSchema).optional(),
    paralysisEpilepsy: z.enum(['yes', 'no']),
    paralysisEpilepsyDetails: z.array(illnessDetailSchema).optional(),
    mentalIllness: z.enum(['yes', 'no']),
    mentalIllnessDetails: z.array(illnessDetailSchema).optional(),
    arthritis: z.enum(['yes', 'no']),
    arthritisDetails: z.array(illnessDetailSchema).optional(),
    chestPain: z.enum(['yes', 'no']),
    chestPainDetails: z.array(illnessDetailSchema).optional(),
    asthma: z.enum(['yes', 'no']),
    asthmaDetails: z.array(illnessDetailSchema).optional(),
    digestiveDisorder: z.enum(['yes', 'no']),
    digestiveDisorderDetails: z.array(illnessDetailSchema).optional(),
    bloodDisorder: z.enum(['yes', 'no']),
    bloodDisorderDetails: z.array(illnessDetailSchema).optional(),
    thyroidDisorder: z.enum(['yes', 'no']),
    thyroidDisorderDetails: z.array(illnessDetailSchema).optional(),
    kidneyDisorder: z.enum(['yes', 'no']),
    kidneyDisorderDetails: z.array(illnessDetailSchema).optional(),
    numbness: z.enum(['yes', 'no']),
    numbnessDetails: z.array(illnessDetailSchema).optional(),
    anxietyStress: z.enum(['yes', 'no']),
    anxietyStressDetails: z.array(illnessDetailSchema).optional(),
    earEyeDisorder: z.enum(['yes', 'no']),
    earEyeDisorderDetails: z.array(illnessDetailSchema).optional(),
    lumpGrowth: z.enum(['yes', 'no']),
    lumpGrowthDetails: z.array(illnessDetailSchema).optional(),
    hospitalAttendance: z.enum(['yes', 'no']),
    hospitalAttendanceDetails: z.array(illnessDetailSchema).optional(),
    criticalIllness: z.enum(['yes', 'no']),
    criticalIllnessDetails: z.array(illnessDetailSchema).optional(),
    sti: z.enum(['yes', 'no']),
    stiDetails: z.array(illnessDetailSchema).optional(),
    presentSymptoms: z.enum(['yes', 'no']),
    presentSymptomsDetails: z.array(illnessDetailSchema).optional(),
    presentWaitingConsultation: z.enum(['yes', 'no']).optional(),
    presentTakingMedication: z.enum(['yes', 'no']).optional(),
    familyMedicalHistory: z.enum(['yes', 'no']),
    familyMedicalHistoryDetails: z.array(familyMedicalHistoryDetailSchema).optional(),

    // Doctor's Details
    currentDoctorName: z.string().optional(),
    currentDoctorPhone: z.string().optional(),
    currentDoctorHospital: z.string().optional(),
    previousDoctorName: z.string().optional(),
    previousDoctorPhone: z.string().optional(),
    previousDoctorHospital: z.string().optional(),

    // Lifestyle
    flownAsPilot: z.enum(['yes', 'no']),
    flownAsPilotDetails: z.array(lifestyleDetailSchema).optional(),
    hazardousSports: z.enum(['yes', 'no']),
    hazardousSportsDetails: z.array(lifestyleDetailSchema).optional(),
    travelOutsideCountry: z.enum(['yes', 'no']),
    travelOutsideCountryDetails: z.array(lifestyleDetailSchema).optional(),
    
  })
  .superRefine((data, ctx) => {
    if (data.primaryBeneficiaries && data.primaryBeneficiaries.length > 0) {
      const totalPrimaryPercentage = data.primaryBeneficiaries.reduce(
        (acc, b) => acc + (b.percentage || 0),
        0
      );
      if (totalPrimaryPercentage !== 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['primaryBeneficiaries'],
          message: 'Total percentage for primary beneficiaries must be 100.',
        });
      }
    }
  });


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

            const parseMedicalDetails = (details: any[] | undefined) => {
              return (details || []).map(d => {
                const parsed: any = {...d};
                Object.keys(d).forEach(key => {
                  if (key.toLowerCase().includes('date') && d[key as keyof typeof d]) {
                    (parsed as any)[key] = new Date((d as any)[key]);
                  } else if (typeof d[key as keyof typeof d] === 'undefined' || d[key as keyof typeof d] === null) {
                    if (illnessDetailSchema.shape[key as keyof typeof illnessDetailSchema.shape] &&
                        ((illnessDetailSchema.shape[key as keyof typeof illnessDetailSchema.shape]) as any)._def.innerType._def.typeName === 'ZodString') 
                    {
                       parsed[key] = '';
                    }
                  }
                });
                return parsed;
              });
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
