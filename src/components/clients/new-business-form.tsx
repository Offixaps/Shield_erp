

'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Send, ShieldCheck, FilePenLine } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn, numberToWords } from '@/lib/utils';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { countries } from '@/lib/countries';
import { Separator } from '@/components/ui/separator';
import { getPolicyById, createPolicy, updatePolicy } from '@/lib/policy-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SignaturePadComponent from './signature-pad';
import ExistingPoliciesTable from './existing-policies-table';
import DeclinedPoliciesTable from './declined-policies-table';
import BeneficiaryTable from './beneficiary-table';
import MedicalHistoryTabs from './medical-history-tabs';
import LifestyleTab from './lifestyle-tab';
import PaymentDetailsTab from './payment-details-tab';

const bankNames = [
  'Absa Bank Ghana Limited',
  'Access Bank (Ghana) Plc',
  'Agricultural Development Bank Plc',
  'Bank of Africa Ghana Limited',
  'CalBank PLC',
  'Consolidated Bank Ghana Limited',
  'Ecobank Ghana PLC',
  'FBNBank (Ghana) Limited',
  'Fidelity Bank Ghana Limited',
  'First Atlantic Bank Limited',
  'First National Bank (Ghana) Limited',
  'GCB Bank PLC',
  'Guaranty Trust Bank (Ghana) Limited',
  'National Investment Bank Limited',
  'OmniBSIC Bank Ghana Limited',
  'Prudential Bank Limited',
  'Republic Bank (Ghana) PLC',
  'Societe Generale Ghana PLC',
  'Stanbic Bank Ghana Limited',
  'Standard Chartered Bank Ghana PLC',
  'United Bank for Africa (Ghana) Limited',
  'Universal Merchant Bank Limited',
  'Zenith Bank (Ghana) Limited',
];

const ghanaRegions = [
  'Ahafo',
  'Ashanti',
  'Bono',
  'Bono East',
  'Central',
  'Eastern',
  'Greater Accra',
  'North East',
  'Northern',
  'Oti',
  'Savannah',
  'Upper East',
  'Upper West',
  'Volta',
  'Western',
  'Western North',
] as const;

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
});

const reducedAlcoholReasonSchema = z.object({
    reduced: z.enum(['yes', 'no'], { required_error: "You must select Yes or No."}),
    notes: z.string().optional(),
});

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
  // Nested fields for High Blood Pressure
  diagnosisDate: z.date().optional(),
  bpReadingAtDiagnosis: z.string().optional(),
  causeOfHighBp: z.string().optional(),
  prescribedTreatment: z.string().optional(),
  complications: z.string().optional(),
  monitoringFrequency: z.string().optional(),
  lastMonitoredDate: z.date().optional(),
  lastBpReading: z.string().optional(),
  sugarCholesterolChecked: z.string().optional(),
  // Nested fields for Diabetes
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
  // Nested fields for Asthma
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
  // Nested fields for Digestive Disorders
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
    expiryDate: z.date({ required_error: 'Expiry date is required.' }),
    placeOfIssue: z.string().min(2, 'Place of issue is required.'),
    country: z.string().min(2, 'Country is required.'),
    region: z.enum(ghanaRegions, { required_error: 'Region is required.' }),
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
    hasExistingPolicies: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    existingPoliciesDetails: z.array(existingPolicySchema).optional(),
    declinedPolicy: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    declinedPolicyDetails: z.array(declinedPolicySchema).optional(),
    
    // Health
    height: z.coerce.number().positive('Height must be a positive number.').optional(),
    heightUnit: z.enum(['m', 'cm', 'ft']).default('cm'),
    weight: z.coerce.number().positive('Weight must be a positive number.').optional(),
    alcoholHabits: z.enum(alcoholHabitsOptions, { required_error: 'You must select a drinking habit.'}),
    alcoholBeer: alcoholDetailSchema.optional(),
    alcoholWine: alcoholDetailSchema.optional(),
    alcoholSpirits: alcoholDetailSchema.optional(),
    reducedAlcoholMedicalAdvice: reducedAlcoholReasonSchema,
    reducedAlcoholHealthProblems: reducedAlcoholReasonSchema,
    tobaccoHabits: z.enum(tobaccoHabitsOptions, { required_error: 'You must select a smoking habit.'}),
    usedNicotineLast12Months: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    tobaccoCigarettes: tobaccoDetailSchema.optional(),
    tobaccoCigars: tobaccoDetailSchema.optional(),
    tobaccoPipe: tobaccoDetailSchema.optional(),
    tobaccoNicotineReplacement: tobaccoDetailSchema.optional(),
    tobaccoEcigarettes: tobaccoDetailSchema.optional(),
    tobaccoOther: tobaccoDetailSchema.optional(),
    usedRecreationalDrugs: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    injectedNonPrescribedDrugs: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    testedPositiveViralInfection: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    testedPositiveFor: viralInfectionDetailSchema.optional(),
    awaitingResultsFor: viralInfectionDetailSchema.optional(),

    // Medical History
    bloodTransfusionOrSurgery: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    bloodTransfusionOrSurgeryDetails: z.array(illnessDetailSchema).optional(),
    highBloodPressure: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    highBloodPressureDetails: z.array(illnessDetailSchema).optional(),
    cancer: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    cancerDetails: z.array(illnessDetailSchema).optional(),
    diabetes: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    diabetesDetails: z.array(illnessDetailSchema).optional(),
    colitisCrohns: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    colitisCrohnsDetails: z.array(illnessDetailSchema).optional(),
    paralysisEpilepsy: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    paralysisEpilepsyDetails: z.array(illnessDetailSchema).optional(),
    mentalIllness: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    mentalIllnessDetails: z.array(illnessDetailSchema).optional(),
    arthritis: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    arthritisDetails: z.array(illnessDetailSchema).optional(),
    chestPain: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    chestPainDetails: z.array(illnessDetailSchema).optional(),
    asthma: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    asthmaDetails: z.array(illnessDetailSchema).optional(),
    digestiveDisorder: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
    digestiveDisorderDetails: z.array(illnessDetailSchema).optional(),
    bloodDisorder: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    bloodDisorderDetails: z.array(illnessDetailSchema).optional(),
    thyroidDisorder: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    thyroidDisorderDetails: z.array(illnessDetailSchema).optional(),
    kidneyDisorder: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    kidneyDisorderDetails: z.array(illnessDetailSchema).optional(),
    numbness: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    numbnessDetails: z.array(illnessDetailSchema).optional(),
    anxietyStress: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    anxietyStressDetails: z.array(illnessDetailSchema).optional(),
    earEyeDisorder: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    earEyeDisorderDetails: z.array(illnessDetailSchema).optional(),
    lumpGrowth: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    lumpGrowthDetails: z.array(illnessDetailSchema).optional(),
    hospitalAttendance: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    hospitalAttendanceDetails: z.array(illnessDetailSchema).optional(),
    criticalIllness: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    criticalIllnessDetails: z.array(illnessDetailSchema).optional(),
    sti: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    stiDetails: z.array(illnessDetailSchema).optional(),
    presentSymptoms: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    presentSymptomsDetails: z.array(illnessDetailSchema).optional(),
    presentWaitingConsultation: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    presentTakingMedication: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    familyMedicalHistory: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    familyMedicalHistoryDetails: z.array(familyMedicalHistoryDetailSchema).optional(),

    // Doctor's Details
    currentDoctorName: z.string().optional(),
    currentDoctorPhone: z.string().optional(),
    currentDoctorHospital: z.string().optional(),
    previousDoctorName: z.string().optional(),
    previousDoctorPhone: z.string().optional(),
    previousDoctorHospital: z.string().optional(),

    // Lifestyle
    flownAsPilot: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    flownAsPilotDetails: z.array(lifestyleDetailSchema).optional(),
    hazardousSports: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    hazardousSportsDetails: z.array(lifestyleDetailSchema).optional(),
    travelOutsideCountry: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.' }),
    travelOutsideCountryDetails: z.array(lifestyleDetailSchema).optional(),
    
  })
  .superRefine((data, ctx) => {
    // Total percentage for primary beneficiaries should be 100% if there are any
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
    | 'agent'
    | 'payment-details'
    | 'declaration';

export default function NewBusinessForm({ businessId }: NewBusinessFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<TabName>('coverage');
  const [bmi, setBmi] = React.useState<number | null>(null);
  const [bmiStatus, setBmiStatus] = React.useState<{ text: string, color: string } | null>(null);

  const [isLifeInsuredSignatureVerified, setIsLifeInsuredSignatureVerified] = React.useState(false);
  const [lifeInsuredVerificationCode, setLifeInsuredVerificationCode] = React.useState('');
  const [isLifeInsuredCodeSent, setIsLifeInsuredCodeSent] = React.useState(false);

  const [isPayerSignatureVerified, setIsPayerSignatureVerified] = React.useState(false);
  const [payerVerificationCode, setPayerVerificationCode] = React.useState('');
  const [isPayerCodeSent, setIsPayerCodeSent] = React.useState(false);

  
  const isEditMode = !!businessId;

  const form = useForm<z.infer<typeof newBusinessFormSchema>>({
    resolver: zodResolver(newBusinessFormSchema),
    defaultValues: {
      title: 'Mr' as const,
      email: '',
      phone: '',
      postalAddress: '',
      lifeAssuredFirstName: '',
      lifeAssuredMiddleName: '',
      lifeAssuredSurname: '',
      lifeAssuredDob: undefined,
      placeOfBirth: '',
      ageNextBirthday: 0,
      contractType: "Buy Term and Invest in Mutual Fund" as const,
      serialNumber: '',
      policyNumber: '',
      commencementDate: new Date(),
      premiumTerm: 0,
      policyTerm: 0,
      premiumAmount: 0,
      sumAssured: 0,
      paymentFrequency: 'Monthly' as const,
      increaseMonth: '',
      premiumPayerSurname: '',
      premiumPayerOtherNames: '',
      premiumPayerOccupation: '',
      premiumPayerRelationship: '',
      premiumPayerResidentialAddress: '',
      premiumPayerPostalAddress: '',
      premiumPayerDob: undefined,
      premiumPayerBusinessName: '',
      bankName: '',
      bankBranch: '',
      maritalStatus: 'Single' as const,
      dependents: 0,
      gender: 'Male' as const,
      nationalIdType: 'National ID' as const,
      idNumber: '',
      issueDate: undefined,
      expiryDate: undefined,
      placeOfIssue: '',
      country: 'Ghana',
      region: 'Greater Accra' as const,
      religion: 'Christian' as const,
      nationality: 'Ghana',
      languages: '',
      amountInWords: '',
      sortCode: '',
      accountType: 'Current' as const,
      bankAccountName: '',
      bankAccountNumber: '',
      occupation: '',
      natureOfBusiness: '',
      employer: '',
      employerAddress: '',
      monthlyBasicIncome: 0,
      otherIncome: 0,
      totalMonthlyIncome: 0,
      workTelephone: '',
      homeTelephone: '',
      residentialAddress: '',
      gpsAddress: '',
      isPolicyHolderPayer: true,
      primaryBeneficiaries: [],
      contingentBeneficiaries: [],
      hasExistingPolicies: 'no' as const,
      existingPoliciesDetails: [],
      declinedPolicy: 'no' as const,
      declinedPolicyDetails: [],
      height: 0,
      heightUnit: 'cm' as const,
      weight: 0,
      alcoholHabits: 'never_used' as const,
      alcoholBeer: { consumed: false, averagePerWeek: '' },
      alcoholWine: { consumed: false, averagePerWeek: '' },
      alcoholSpirits: { consumed: false, averagePerWeek: '' },
      reducedAlcoholMedicalAdvice: { reduced: 'no', notes: ''},
      reducedAlcoholHealthProblems: { reduced: 'no', notes: ''},
      tobaccoHabits: 'never_smoked' as const,
      usedNicotineLast12Months: 'no' as const,
      tobaccoCigarettes: { smoked: false, avgPerDay: '', avgPerWeek: '' },
      tobaccoCigars: { smoked: false, avgPerDay: '', avgPerWeek: '' },
      tobaccoPipe: { smoked: false, avgPerDay: '', avgPerWeek: '' },
      tobaccoNicotineReplacement: { smoked: false, avgPerDay: '', avgPerWeek: '' },
      tobaccoEcigarettes: { smoked: false, avgPerDay: '', avgPerWeek: '' },
      tobaccoOther: { smoked: false, avgPerDay: '', avgPerWeek: '', otherType: '' },
      usedRecreationalDrugs: 'no' as const,
      injectedNonPrescribedDrugs: 'no' as const,
      testedPositiveViralInfection: 'no' as const,
      testedPositiveFor: { hiv: false, hepB: false, hepC: false },
      awaitingResultsFor: { hiv: false, hepB: false, hepC: false },
      bloodTransfusionOrSurgery: 'no' as const,
      bloodTransfusionOrSurgeryDetails: [],
      highBloodPressure: 'no' as const,
      highBloodPressureDetails: [],
      cancer: 'no' as const,
      cancerDetails: [],
      diabetes: 'no' as const,
      diabetesDetails: [],
      colitisCrohns: 'no' as const,
      colitisCrohnsDetails: [],
      paralysisEpilepsy: 'no' as const,
      paralysisEpilepsyDetails: [],
      mentalIllness: 'no' as const,
      mentalIllnessDetails: [],
      arthritis: 'no' as const,
      arthritisDetails: [],
      chestPain: 'no' as const,
      chestPainDetails: [],
      asthma: 'no' as const,
      asthmaDetails: [],
      digestiveDisorder: 'no' as const,
      digestiveDisorderDetails: [],
      bloodDisorder: 'no' as const,
      bloodDisorderDetails: [],
      thyroidDisorder: 'no' as const,
      thyroidDisorderDetails: [],
      kidneyDisorder: 'no' as const,
      kidneyDisorderDetails: [],
      numbness: 'no' as const,
      numbnessDetails: [],
      anxietyStress: 'no' as const,
      anxietyStressDetails: [],
      earEyeDisorder: 'no' as const,
      earEyeDisorderDetails: [],
      lumpGrowth: 'no' as const,
      lumpGrowthDetails: [],
      hospitalAttendance: 'no' as const,
      hospitalAttendanceDetails: [],
      criticalIllness: 'no' as const,
      criticalIllnessDetails: [],
      sti: 'no' as const,
      stiDetails: [],
      presentSymptoms: 'no' as const,
      presentSymptomsDetails: [],
      presentWaitingConsultation: 'no' as const,
      presentTakingMedication: 'no' as const,
      familyMedicalHistory: 'no' as const,
      familyMedicalHistoryDetails: [],
      currentDoctorName: '',
      currentDoctorPhone: '',
      currentDoctorHospital: '',
      previousDoctorName: '',
      previousDoctorPhone: '',
      previousDoctorHospital: '',
      flownAsPilot: 'no' as const,
      flownAsPilotDetails: [],
      hazardousSports: 'no' as const,
      hazardousSportsDetails: [],
      travelOutsideCountry: 'no' as const,
      travelOutsideCountryDetails: [],
      paymentAuthoritySignature: '',
      lifeInsuredSignature: '',
      policyOwnerSignature: '',
      agentName: '',
      agentCode: '',
      uplineName: '',
      uplineCode: '',
      introducerCode: '',
      premiumPayerIdType: undefined,
      premiumPayerIdNumber: '',
      premiumPayerIssueDate: undefined,
      premiumPayerExpiryDate: undefined,
      premiumPayerPlaceOfIssue: '',
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
                  if (key.toLowerCase().includes('date') && d[key]) {
                    parsed[key] = new Date(d[key]);
                  } else if (typeof d[key] === 'undefined' || d[key] === null) {
                    if (illnessDetailSchema.shape[key as keyof typeof illnessDetailSchema.shape] &&
                        illnessDetailSchema.shape[key as keyof typeof illnessDetailSchema.shape]._def.typeName === 'ZodOptional' &&
                        (illnessDetailSchema.shape[key as keyof typeof illnessDetailSchema.shape] as any)._def.innerType._def.typeName === 'ZodString') 
                    {
                       parsed[key] = '';
                    }
                  }
                });
                return parsed;
              });
            };

            const getMedicalDetailsFor = (illness: string | string[]) => {
                const illnesses = Array.isArray(illness) ? illness : [illness];
                return parseMedicalDetails((data.medicalHistory || []).filter((h:any) => illnesses.includes(h.illness)));
            }
            
            const getLifestyleDetailsFor = (item: string) => {
                return (data.lifestyleDetails || []).filter((d: any) => d.item === item);
            }
            
            const defaultValues = {
              ...businessData,
              title: title,
              lifeAssuredFirstName: firstName,
              lifeAssuredMiddleName: middleName,
              lifeAssuredSurname: surname,
              policyNumber: businessData.policy || '',
              contractType: businessData.product as "Buy Term and Invest in Mutual Fund" | "The Education Policy",
              premiumAmount: businessData.premium,
              commencementDate: new Date(businessData.commencementDate),
              expiryDate: parseDate(data.expiryDate),
              lifeAssuredDob: parseDate(data.lifeAssuredDob),
              email: data.email || '',
              workTelephone: data.workTelephone || '',
              homeTelephone: data.homeTelephone || '',
              residentialAddress: data.residentialAddress || '',
              gpsAddress: data.gpsAddress || '',
              policyTerm: businessData.policyTerm,
              premiumTerm: businessData.premiumTerm,
              sumAssured: businessData.sumAssured,
              paymentFrequency: data.paymentFrequency,
              increaseMonth: format(new Date(businessData.commencementDate), 'MMMM'),
              premiumPayerSurname: businessData.payerName.split(' ').slice(-1).join(' ') || '',
              premiumPayerOtherNames: businessData.payerName.split(' ').slice(0, -1).join(' ') || '',
              premiumPayerOccupation: data.premiumPayerOccupation || '',
              maritalStatus: data.maritalStatus,
              dependents: data.dependents,
              gender: data.gender,
              nationalIdType: data.nationalIdType,
              idNumber: data.idNumber,
              issueDate: parseDate(data.issueDate),
              expiryDateId: parseDate(data.expiryDateId),
              placeOfIssue: data.placeOfIssue,
              country: data.country,
              region: data.region,
              religion: data.religion,
              nationality: data.nationality,
              languages: data.languages,
              amountInWords: data.amountInWords,
              sortCode: businessData.sortCode,
              accountType: data.accountType,
              bankBranch: data.bankBranch,
              bankAccountName: data.bankAccountName,
              bankAccountNumber: businessData.bankAccountNumber,
              occupation: data.occupation,
              natureOfBusiness: data.natureOfBusiness,
              employer: data.employer,
              employerAddress: data.employerAddress,
              monthlyBasicIncome: data.monthlyBasicIncome,
              otherIncome: data.otherIncome,
              totalMonthlyIncome: data.totalMonthlyIncome,
              serialNumber: businessData.serial,
              isPolicyHolderPayer: businessData.client === businessData.payerName,
              primaryBeneficiaries: parseBeneficiaries(businessData.primaryBeneficiaries),
              contingentBeneficiaries: parseBeneficiaries(businessData.contingentBeneficiaries),
              height: businessData.height,
              heightUnit: businessData.heightUnit,
              weight: businessData.weight,
              paymentAuthoritySignature: data.paymentAuthoritySignature || '',
              lifeInsuredSignature: data.lifeInsuredSignature || '',
              policyOwnerSignature: data.policyOwnerSignature || '',
              postalAddress: data.postalAddress,
              currentDoctorName: data.currentDoctorName || '',
              currentDoctorPhone: data.currentDoctorPhone || '',
              currentDoctorHospital: data.currentDoctorHospital || '',
              previousDoctorName: data.previousDoctorName || '',
              previousDoctorPhone: data.previousDoctorPhone || '',
              previousDoctorHospital: data.previousDoctorHospital || '',
              agentName: data.agentName || '',
              agentCode: data.agentCode || '',
              uplineName: data.uplineName || '',
              uplineCode: data.uplineCode || '',
              introducerCode: data.introducerCode || '',
              premiumPayerRelationship: data.premiumPayerRelationship || '',
              premiumPayerResidentialAddress: data.premiumPayerResidentialAddress || '',
              premiumPayerPostalAddress: data.premiumPayerPostalAddress || '',
              premiumPayerDob: parseDate(data.premiumPayerDob),
              premiumPayerBusinessName: data.premiumPayerBusinessName || '',
              premiumPayerIdType: data.premiumPayerIdType,
              premiumPayerIdNumber: data.premiumPayerIdNumber || '',
              premiumPayerIssueDate: parseDate(data.premiumPayerIssueDate),
              premiumPayerExpiryDate: parseDate(data.premiumPayerExpiryDate),
              premiumPayerPlaceOfIssue: data.premiumPayerPlaceOfIssue || '',
              
              hasExistingPolicies: (data.existingPoliciesDetails && data.existingPoliciesDetails.length > 0) ? 'yes' : 'no',
              existingPoliciesDetails: parseMedicalDetails(data.existingPoliciesDetails),
              declinedPolicy: (data.declinedPolicyDetails && data.declinedPolicyDetails.length > 0) ? 'yes' : 'no',
              declinedPolicyDetails: data.declinedPolicyDetails,

              alcoholHabits: businessData.alcoholHabits,
              alcoholBeer: { consumed: data.alcoholBeer?.consumed || false, averagePerWeek: data.alcoholBeer?.averagePerWeek || '' },
              alcoholWine: { consumed: data.alcoholWine?.consumed || false, averagePerWeek: data.alcoholWine?.averagePerWeek || '' },
              alcoholSpirits: { consumed: data.alcoholSpirits?.consumed || false, averagePerWeek: data.alcoholSpirits?.averagePerWeek || '' },
              reducedAlcoholMedicalAdvice: { reduced: data.reducedAlcoholMedicalAdvice?.reduced || 'no', notes: data.reducedAlcoholMedicalAdvice?.notes || '' },
              reducedAlcoholHealthProblems: { reduced: data.reducedAlcoholHealthProblems?.reduced || 'no', notes: data.reducedAlcoholHealthProblems?.notes || '' },

              tobaccoHabits: businessData.tobaccoHabits,
              usedNicotineLast12Months: data.usedNicotineLast12Months,
              tobaccoCigarettes: { smoked: data.tobaccoCigarettes?.smoked || false, avgPerDay: data.tobaccoCigarettes?.avgPerDay || '', avgPerWeek: data.tobaccoCigarettes?.avgPerWeek || '' },
              tobaccoCigars: { smoked: data.tobaccoCigars?.smoked || false, avgPerDay: data.tobaccoCigars?.avgPerDay || '', avgPerWeek: data.tobaccoCigars?.avgPerWeek || '' },
              tobaccoPipe: { smoked: data.tobaccoPipe?.smoked || false, avgPerDay: data.tobaccoPipe?.avgPerDay || '', avgPerWeek: data.tobaccoPipe?.avgPerWeek || '' },
              tobaccoNicotineReplacement: { smoked: data.tobaccoNicotineReplacement?.smoked || false, avgPerDay: data.tobaccoNicotineReplacement?.avgPerDay || '', avgPerWeek: data.tobaccoNicotineReplacement?.avgPerWeek || '' },
              tobaccoEcigarettes: { smoked: data.tobaccoEcigarettes?.smoked || false, avgPerDay: data.tobaccoEcigarettes?.avgPerDay || '', avgPerWeek: data.tobaccoEcigarettes?.avgPerWeek || '' },
              tobaccoOther: { smoked: data.tobaccoOther?.smoked || false, avgPerDay: data.tobaccoOther?.avgPerDay || '', avgPerWeek: data.tobaccoOther?.avgPerWeek || '', otherType: data.tobaccoOther?.otherType || '' },

              usedRecreationalDrugs: data.usedRecreationalDrugs,
              injectedNonPrescribedDrugs: data.injectedNonPrescribedDrugs,
              testedPositiveViralInfection: data.testedPositiveViralInfection,
              testedPositiveFor: data.testedPositiveFor,
              awaitingResultsFor: data.awaitingResultsFor,

              bloodTransfusionOrSurgery: (data.medicalHistory || []).some((h:any) => ['Blood transfusion', 'Surgery'].includes(h.illness)) ? 'yes' : 'no',
              bloodTransfusionOrSurgeryDetails: getMedicalDetailsFor(['Blood transfusion', 'Surgery']),
              highBloodPressure: (data.medicalHistory || []).some((h:any) => ['High blood pressure', 'Angina', 'Heart attack', 'Stroke', 'Coma'].includes(h.illness)) ? 'yes' : 'no',
              highBloodPressureDetails: getMedicalDetailsFor(['High blood pressure', 'Angina', 'Heart attack', 'Stroke', 'Coma']),
              cancer: (data.medicalHistory || []).some((h:any) => ['Cancer', 'Leukemia', "Hodgkin's disease", 'Lymphoma', 'Other tumor'].includes(h.illness)) ? 'yes' : 'no',
              cancerDetails: getMedicalDetailsFor(['Cancer', 'Leukemia', "Hodgkin's disease", 'Lymphoma', 'Other tumor']),
              diabetes: (data.medicalHistory || []).some((h:any) => h.illness === 'Diabetes') ? 'yes' : 'no',
              diabetesDetails: getMedicalDetailsFor('Diabetes'),
              colitisCrohns: (data.medicalHistory || []).some((h:any) => h.illness === "Crohn's disease" || h.illness === 'Colitis') ? 'yes' : 'no',
              colitisCrohnsDetails: getMedicalDetailsFor(["Crohn's disease", "Colitis"]),
              paralysisEpilepsy: (data.medicalHistory || []).some((h:any) => ['Paralysis', 'Multiple sclerosis', 'Epilepsy', 'Dementia'].includes(h.illness)) ? 'yes' : 'no',
              paralysisEpilepsyDetails: getMedicalDetailsFor(['Paralysis', 'Multiple sclerosis', 'Epilepsy', 'Dementia']),
              mentalIllness: (data.medicalHistory || []).some((h:any) => ['Hospital/psychiatric treatment for mental illness', 'Depression', 'Nervous breakdown'].includes(h.illness)) ? 'yes' : 'no',
              mentalIllnessDetails: getMedicalDetailsFor(['Hospital/psychiatric treatment for mental illness', 'Depression', 'Nervous breakdown']),
              arthritis: (data.medicalHistory || []).some((h:any) => ['Arthritis', 'Neck or back pain', 'Gout'].includes(h.illness)) ? 'yes' : 'no',
              arthritisDetails: getMedicalDetailsFor(['Arthritis', 'Neck or back pain', 'Gout']),
              chestPain: (data.medicalHistory || []).some((h:any) => ['Chest pain', 'Irregular heart beat', 'Raised cholesterol'].includes(h.illness)) ? 'yes' : 'no',
              chestPainDetails: getMedicalDetailsFor(['Chest pain', 'Irregular heart beat', 'Raised cholesterol']),
              asthma: (data.medicalHistory || []).some((h:any) => ['Asthma', 'Bronchitis', 'Shortness of breath'].includes(h.illness)) ? 'yes' : 'no',
              asthmaDetails: getMedicalDetailsFor(['Asthma', 'Bronchitis', 'Shortness of breath']),
              digestiveDisorder: (data.medicalHistory || []).some((h:any) => ['Duodenal Ulcer', 'Gastric Ulcer', 'Digestive System Disorder', 'Liver Disorder', 'Disorder of Pancreas'].includes(h.illness)) ? 'yes' : 'no',
              digestiveDisorderDetails: getMedicalDetailsFor(['Duodenal Ulcer', 'Gastric Ulcer', 'Digestive System Disorder', 'Liver Disorder', 'Disorder of Pancreas']),
              bloodDisorder: (data.medicalHistory || []).some((h:any) => ['Blood disorder', 'Anemia'].includes(h.illness)) ? 'yes' : 'no',
              bloodDisorderDetails: getMedicalDetailsFor(['Blood disorder', 'Anemia']),
              thyroidDisorder: (data.medicalHistory || []).some((h:any) => h.illness === 'Thyroid disorder') ? 'yes' : 'no',
              thyroidDisorderDetails: getMedicalDetailsFor('Thyroid disorder'),
              kidneyDisorder: (data.medicalHistory || []).some((h:any) => ['Kidney disorder', 'Renal failure', 'Bladder disorder'].includes(h.illness)) ? 'yes' : 'no',
              kidneyDisorderDetails: getMedicalDetailsFor(['Kidney disorder', 'Renal failure', 'Bladder disorder']),
              numbness: (data.medicalHistory || []).some((h:any) => h.illness === 'Numbness') ? 'yes' : 'no',
              numbnessDetails: getMedicalDetailsFor('Numbness'),
              anxietyStress: (data.medicalHistory || []).some((h:any) => ['Anxiety', 'Stress', 'Depression'].includes(h.illness)) ? 'yes' : 'no',
              anxietyStressDetails: getMedicalDetailsFor(['Anxiety', 'Stress', 'Depression']),
              earEyeDisorder: (data.medicalHistory || []).some((h:any) => ['Ear disorder', 'Eye disorder', 'Blindness', 'Blurred vision', 'Double vision'].includes(h.illness)) ? 'yes' : 'no',
              earEyeDisorderDetails: getMedicalDetailsFor(['Ear disorder', 'Eye disorder', 'Blindness', 'Blurred vision', 'Double vision']),
              lumpGrowth: (data.medicalHistory || []).some((h:any) => ['Lump', 'Growth', 'Mole', 'Freckle'].includes(h.illness)) ? 'yes' : 'no',
              lumpGrowthDetails: getMedicalDetailsFor(['Lump', 'Growth', 'Mole', 'Freckle']),
              hospitalAttendance: (data.medicalHistory || []).some((h:any) => ['X-ray', 'Scan', 'Checkup', 'Operation'].includes(h.illness)) ? 'yes' : 'no',
              hospitalAttendanceDetails: getMedicalDetailsFor(['X-ray', 'Scan', 'Checkup', 'Operation']),
              criticalIllness: (data.medicalHistory || []).some((h:any) => ["Alzheimer's Disease", 'Multiple Sclerosis'].includes(h.illness)) ? 'yes' : 'no',
              criticalIllnessDetails: getMedicalDetailsFor(["Alzheimer's Disease", 'Multiple Sclerosis']),
              sti: (data.medicalHistory || []).some((h:any) => ['Urethral discharge', 'Chancroid', 'Gonorrhoea', 'Syphilis', 'Urethritis', 'Genital sores', 'HIV infection', 'Balanitis', 'Genital Warts', 'Vaginal discharge', 'Vaginal trush'].includes(h.illness)) ? 'yes' : 'no',
              stiDetails: getMedicalDetailsFor(['Urethral discharge', 'Chancroid', 'Gonorrhoea', 'Syphilis', 'Urethritis', 'Genital sores', 'HIV infection', 'Balanitis', 'Genital Warts', 'Vaginal discharge', 'Vaginal trush']),
              presentSymptoms: data.presentSymptoms,
              presentSymptomsDetails: getMedicalDetailsFor('Present Symptoms'),
              presentWaitingConsultation: data.presentWaitingConsultation,
              presentTakingMedication: data.presentTakingMedication,

              familyMedicalHistory: businessData.familyMedicalHistory,
              familyMedicalHistoryDetails: businessData.familyMedicalHistoryDetails,

              flownAsPilot: (data.lifestyleDetails || []).some((d:any) => d.item === 'Pilot') ? 'yes' : 'no',
              flownAsPilotDetails: getLifestyleDetailsFor('Pilot'),
              hazardousSports: (data.lifestyleDetails || []).some((d:any) => ['Scuba diving', 'Mountain Climbing', 'Parachuting', 'Hang gliding', 'Paragliding', 'Automobile racing', 'Motorcycles Racing', 'Boat racing'].includes(d.item)) ? 'yes' : 'no',
              hazardousSportsDetails: getLifestyleDetailsFor('Scuba diving'),
              travelOutsideCountry: (data.lifestyleDetails || []).some((d:any) => ['Live Outside', 'Work outside', 'Go on Holiday'].includes(d.item)) ? 'yes' : 'no',
              travelOutsideCountryDetails: getLifestyleDetailsFor('Live Outside'),
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
  const height = form.watch('height');
  const heightUnit = form.watch('heightUnit');
  const weight = form.watch('weight');
  const hasExistingPolicies = form.watch('hasExistingPolicies');
  const declinedPolicy = form.watch('declinedPolicy');


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
        // Birthday hasn't happened this year yet
      } else {
        // Birthday has already passed this year
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
    if (height && weight && Number(height) > 0 && Number(weight) > 0) {
      let heightInMeters: number;
      switch (heightUnit) {
        case 'cm':
          heightInMeters = Number(height) / 100;
          break;
        case 'ft':
          heightInMeters = Number(height) * 0.3048;
          break;
        case 'm':
        default:
          heightInMeters = Number(height);
          break;
      }

      const calculatedBmi = Number(weight) / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi);

    } else {
      setBmi(null);
    }
  }, [height, heightUnit, weight]);
  
  React.useEffect(() => {
    const amount = form.getValues('premiumAmount');
    if (amount && Number(amount) > 0) {
        const words = numberToWords(Number(amount));
        form.setValue('amountInWords', `${words} Ghana Cedis`);
    } else {
        form.setValue('amountInWords', '');
    }
  }, [premiumAmount, form]);
  
  const handleSendLifeInsuredCode = () => {
    setIsLifeInsuredCodeSent(true);
    toast({
      title: "Verification Code Sent",
      description: `A verification code has been sent to ${form.getValues('email')}. (This is a simulation).`,
    });
  };
  
  const handleVerifyLifeInsuredCode = () => {
    if (lifeInsuredVerificationCode === "123456") {
      setIsLifeInsuredSignatureVerified(true);
      toast({
        title: "Identity Verified",
        description: "Your signature has been successfully verified.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "The verification code is incorrect. Please try again.",
      });
    }
  };

  const handleSendPayerCode = () => {
    setIsPayerCodeSent(true);
    toast({
      title: "Verification Code Sent",
      description: `A verification code has been sent to the premium payer's contact. (This is a simulation).`,
    });
  };

  const handleVerifyPayerCode = () => {
    if (payerVerificationCode === "123456") {
      setIsPayerSignatureVerified(true);
      toast({
        title: "Identity Verified",
        description: "The premium payer's signature has been successfully verified.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "The verification code is incorrect. Please try again.",
      });
    }
  };

  async function onSubmit(values: z.infer<typeof newBusinessFormSchema>) {
    try {
        if (isEditMode) {
            await updatePolicy(parseInt(businessId!), values);
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

  // State for popovers
  const [dobOpen, setDobOpen] = React.useState(false);
  const [issueDateOpen, setIssueDateOpen] = React.useState(false);
  const [expiryDateOpen, setExpiryDateOpen] = React.useState(false);
  const [payerDobOpen, setPayerDobOpen] = React.useState(false);
  const [payerIssueDateOpen, setPayerIssueDateOpen] = React.useState(false);
  const [payerExpiryDateOpen, setPayerExpiryDateOpen] = React.useState(false);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab as (value: string) => void} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto">
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
            <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
            <TabsTrigger value="existing-policies">Existing Policies</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="agent">Agent</TabsTrigger>
            <TabsTrigger value="payment-details">Payment Details</TabsTrigger>
            <TabsTrigger value="declaration">Declaration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="coverage" className="mt-6 space-y-8">
             <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
              <h3>Personal details of life insured</h3>
            </div>
            <Separator className="my-0" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mr">Mr</SelectItem>
                        <SelectItem value="Mrs">Mrs</SelectItem>
                        <SelectItem value="Miss">Miss</SelectItem>
                        <SelectItem value="Dr">Dr</SelectItem>
                        <SelectItem value="Prof">Prof</SelectItem>
                        <SelectItem value="Hon">Hon</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lifeAssuredFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lifeAssuredMiddleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Kofi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lifeAssuredSurname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surname</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lifeAssuredDob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover open={dobOpen} onOpenChange={setDobOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setDobOpen(false);
                          }}
                          initialFocus
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="placeOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place of Birth (City/Town)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Accra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ageNextBirthday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (Next Birthday)</FormLabel>
                    <FormControl>
                      <Input type="number" disabled {...field} value={field.value || 0} />
                    </FormControl>
                    <FormDescription>
                      This is the age of the Life Assured.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dependents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Dependents</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Ghana" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ghanaRegions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Religion</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select religion" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Christian">Christian</SelectItem>
                        <SelectItem value="Muslim">Muslim</SelectItem>
                        <SelectItem value="Traditional">Traditional</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Languages Spoken</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., English, Twi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>Identification</h3>
              <Separator className="my-0" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
              <FormField
                control={form.control}
                name="nationalIdType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National ID</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {idTypes.map(idType => (
                            <SelectItem key={idType} value={idType}>{idType}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., GHA-123456789-0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="placeOfIssue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place of Issue</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Accra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Issue Date</FormLabel>
                    <Popover open={issueDateOpen} onOpenChange={setIssueDateOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setIssueDateOpen(false);
                          }}
                          initialFocus
                          disabled={(date) => date > new Date()}
                          captionLayout="dropdown-buttons"
                          fromYear={1980}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date</FormLabel>
                    <Popover open={expiryDateOpen} onOpenChange={setExpiryDateOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setExpiryDateOpen(false);
                          }}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          captionLayout="dropdown-buttons"
                          fromYear={new Date().getFullYear()}
                          toYear={new Date().getFullYear() + 20}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>Contact Details</h3>
              <Separator className="my-0" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="applicant.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="024 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workTelephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Telephone</FormLabel>
                    <FormControl>
                      <Input placeholder="030 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="homeTelephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Telephone</FormLabel>
                    <FormControl>
                      <Input placeholder="030 765 4321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, Accra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="residentialAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residential Address</FormLabel>
                    <FormControl>
                      <Input placeholder="456 Oak Avenue, Accra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gpsAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPS Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., GA-123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>Employment Details</h3>
              <Separator className="my-0" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="natureOfBusiness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nature of Business/Work</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Business Rd, Accra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyBasicIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Basic Income (GHS)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="3000.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otherIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Income (GHS)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalMonthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Monthly Income (GHS)</FormLabel>
                    <FormControl>
                      <Input type="number" disabled {...field} />
                    </FormControl>
                    <FormDescription>This is calculated automatically.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>Coverage Details</h3>
              <Separator className="my-0" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
              <FormField
                control={form.control}
                name="contractType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a policy type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Buy Term and Invest in Mutual Fund">
                          Buy Term and Invest in Mutual Fund
                        </SelectItem>
                        <SelectItem value="The Education Policy">
                          The Education Policy
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="policyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Allocated upon acceptance" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commencementDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Policy Commencement Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Set automatically on policy acceptance.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="policyTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Term (years)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5" {...field} disabled />
                    </FormControl>
                    <FormDescription>Auto-calculated: 75 - Age</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="premiumTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Premium Term (years)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} disabled />
                    </FormControl>
                    <FormDescription>Auto-calculated: 65 - Age</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sumAssured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provisional Sum Assured</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10000.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="premiumAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provisional Premium Amount (GHS)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a payment frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Bi-Annually">Bi-Annually</SelectItem>
                        <SelectItem value="Annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="increaseMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Increase Month</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormDescription>This is automatically set from the commencement date.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="beneficiaries" className="mt-6 space-y-8">
            <div>
              <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
                <h3>Primary Beneficiaries</h3>
              </div>
              <Separator className="my-0" />
              <div className="p-4 border border-t-0 rounded-b-md">
                <BeneficiaryTable form={form} fieldName="primaryBeneficiaries" />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
                <h3>Contingent Beneficiaries</h3>
              </div>
              <Separator className="my-0" />
              <div className="p-4 border border-t-0 rounded-b-md">
                <BeneficiaryTable form={form} fieldName="contingentBeneficiaries" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="existing-policies" className="mt-6 space-y-8">
            <div>
              <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
                <h3>Existing Life Insurance Policies</h3>
              </div>
              <Separator className="my-0" />
              <div className="p-4 border border-t-0 rounded-b-md space-y-6">
                <FormField
                  control={form.control}
                  name="hasExistingPolicies"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Do you have any existing life insurance policies with this or any other company?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="yes" /></FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="no" /></FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {hasExistingPolicies === 'yes' && (
                  <ExistingPoliciesTable form={form} fieldName="existingPoliciesDetails" />
                )}
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
                <h3>Declined / Postponed Life Insurance</h3>
              </div>
              <Separator className="my-0" />
              <div className="p-4 border border-t-0 rounded-b-md space-y-6">
                 <FormField
                  control={form.control}
                  name="declinedPolicy"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Have you ever had an application for life, critical illness, or disability insurance declined, postponed, or accepted on special terms?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="yes" /></FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="no" /></FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {declinedPolicy === 'yes' && (
                  <DeclinedPoliciesTable form={form} fieldName="declinedPolicyDetails" />
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="health" className="mt-6 space-y-8">
            <LifestyleTab form={form} bmi={bmi} />
            <MedicalHistoryTabs form={form} />
          </TabsContent>
          
          <TabsContent value="agent" className="mt-6 space-y-8">
            <div className='flex items-center justify-between text-lg font-bold text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
                <h3>DETAILS OF AGENT</h3>
            </div>
            <Separator className="my-0" />
            <div className="p-4 space-y-6">
                <p>I am a duly authorized agent of First Insurance.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="agentName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name of Agent</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Jane Doe" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="agentCode"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., A1234" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="uplineName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name of Upline</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., John Smith" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="uplineCode"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Upline Code</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., U5678" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="introducerCode"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Introducer's Code</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., I9101" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
          </TabsContent>

          <TabsContent value="payment-details" className="mt-6">
            <PaymentDetailsTab
                form={form}
                payerDobOpen={payerDobOpen}
                setPayerDobOpen={setPayerDobOpen}
                payerIssueDateOpen={payerIssueDateOpen}
                setPayerIssueDateOpen={setPayerIssueDateOpen}
                payerExpiryDateOpen={payerExpiryDateOpen}
                setPayerExpiryDateOpen={setPayerExpiryDateOpen}
            />
          </TabsContent>

          <TabsContent value="declaration" className="mt-6 space-y-8">
            <div>
              <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
                <h3>Declaration and Authorisation by Life Insured</h3>
              </div>
              <Separator className="my-0" />
              <div className="p-4 border border-t-0 rounded-b-md space-y-6">
                <p className="text-sm text-justify">
                  I, the life to be insured, hereby declare that all the foregoing statements and answers are true, complete and correct and I agree that this proposal and declaration, together with any other declarations by me, shall be the basis of the contract between me and First Insurance Company Ltd. I further agree that in the event of any untrue or incorrect statement or any suppression or misrepresentation of material information, the policy to be issued shall be void and all monies which shall have been paid in respect thereof, shall be forfeited to the company. I agree to First Insurance Company Ltd processing my personal data including my sensitive personal data for the purpose of this insurance. I further agree to First Insurance Company Ltd transferring my personal data including my sensitive personal data outside Ghana where it is necessary to do so for the purpose of this insurance.
                </p>
                <Separator />
                <FormField
                  control={form.control}
                  name="lifeInsuredSignature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Life Insured's Signature</FormLabel>
                      <FormControl>
                        <SignaturePadComponent
                          initialUrl={field.value}
                          onSave={(dataUrl) => field.onChange(dataUrl)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <AlertTitle>Signature Verification</AlertTitle>
                  <Alert>
                    <ShieldCheck className="h-4 w-4" />
                    <AlertTitle>Verify your identity to confirm your signature</AlertTitle>
                    <AlertDescription>
                      We will send a one-time verification code to your email address ({form.getValues('email') || 'not provided'}) to confirm your signature.
                    </AlertDescription>
                  </Alert>
                  {!isLifeInsuredCodeSent ? (
                    <Button type="button" onClick={handleSendLifeInsuredCode} className="w-full sm:w-auto">
                      <Send className="mr-2" /> Send Verification Code
                    </Button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        placeholder="Enter 6-digit code"
                        value={lifeInsuredVerificationCode}
                        onChange={(e) => setLifeInsuredVerificationCode(e.target.value)}
                        maxLength={6}
                        className="w-full sm:w-48"
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyLifeInsuredCode}
                        disabled={isLifeInsuredSignatureVerified}
                        className="w-full sm:w-auto"
                      >
                        <ShieldCheck className="mr-2" /> {isLifeInsuredSignatureVerified ? 'Verified' : 'Verify'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!isPolicyHolderPayer && (
              <div>
                <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
                  <h3>Declaration of Conditional Coverage by Policy Owner</h3>
                </div>
                <Separator className="my-0" />
                <div className="p-4 border border-t-0 rounded-b-md space-y-6">
                  <p className="text-sm text-justify">
                    I, the policy owner, hereby declare that all the foregoing statements and answers are true, complete and correct and I agree that this proposal and declaration, together with any other declarations by me, shall be the basis of the contract between me and First Insurance Company Ltd.
                  </p>
                  <Separator />
                   <FormField
                    control={form.control}
                    name="policyOwnerSignature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Owner's Signature</FormLabel>
                        <FormControl>
                          <SignaturePadComponent
                            initialUrl={field.value}
                            onSave={(dataUrl) => field.onChange(dataUrl)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-4">
                  <AlertTitle>Signature Verification</AlertTitle>
                  <Alert>
                    <ShieldCheck className="h-4 w-4" />
                    <AlertTitle>Verify Policy Owner's identity to confirm signature</AlertTitle>
                    <AlertDescription>
                        We will send a one-time verification code to the policy owner's contact details to confirm their signature.
                    </AlertDescription>
                  </Alert>
                   {!isPayerCodeSent ? (
                    <Button type="button" onClick={handleSendPayerCode} className="w-full sm:w-auto">
                      <Send className="mr-2" /> Send Verification Code
                    </Button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        placeholder="Enter 6-digit code"
                        value={payerVerificationCode}
                        onChange={(e) => setPayerVerificationCode(e.target.value)}
                        maxLength={6}
                        className="w-full sm:w-48"
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyPayerCode}
                        disabled={isPayerSignatureVerified}
                        className="w-full sm:w-auto"
                      >
                        <ShieldCheck className="mr-2" /> {isPayerSignatureVerified ? 'Verified' : 'Verify'}
                      </Button>
                    </div>
                  )}
                </div>
                </div>
              </div>
            )}
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

