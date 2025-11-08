

'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, Info, Send, ShieldCheck } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { countries } from '@/lib/countries';
import { Separator } from '@/components/ui/separator';
import { getPolicyById, createPolicy, updatePolicy } from '@/lib/policy-service';
import type { ActivityLog } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Badge } from '../ui/badge';
import MedicalConditionDetailsTable from './medical-condition-details-table';
import FamilyMedicalHistoryTable from './family-medical-history-table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import LifestyleDetailTable from './lifestyle-detail-table';
import SignaturePad from './signature-pad';

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


const formSchema = z
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

    // Beneficiaries
    primaryBeneficiaries: z.array(beneficiarySchema).optional(),
    contingentBeneficiaries: z.array(beneficiarySchema).optional(),
    
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
    bloodDisorder: z.enum(['yes', 'no'], { required_error: 'You must select Yes or No.'}),
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
    
    // Declaration
    lifeInsuredSignature: z.string().optional(),
    policyOwnerSignature: z.string().optional(),
  });

type NewBusinessFormProps = {
    businessId?: string;
}

const tabSequence = [
    'policy-holder',
    'beneficiaries',
    'health',
    'lifestyle',
    'declaration',
    'payment-details',
];

const alcoholHabitsLabels: Record<typeof alcoholHabitsOptions[number], string> = {
    never_used: 'Have never used alcohol',
    occasional_socially: 'Drink occasionally or socially only',
    ex_drinker_over_5_years: 'Ex-drinker; last drunk alcohol over 5 years ago',
    ex_drinker_1_to_5_years: 'Ex-drinker: last drunk alcohol 1 to 5 years ago',
    ex_drinker_within_1_year: 'Ex-drinker: last drunk alcohol within the last year',
    current_regular_drinker: 'Current regular drinker',
};

const tobaccoHabitsLabels: Record<typeof tobaccoHabitsOptions[number], string> = {
    never_smoked: 'Have never smoked',
    ex_smoker_over_5_years: 'Ex-smoker: last smoked or used nicotine products over 5 years ago',
    ex_smoker_1_to_5_years: 'Ex-smoker: last smoked or used nicotine products 1 to 5 years ago',
    ex_smoker_within_1_year: 'Ex-smoker: last smoked or used nicotine products within the last year',
    smoke_occasionally_socially: 'Smoke occasionally or socially only',
    current_regular_smoker: 'Current regular smoker',
};

export default function NewBusinessForm({ businessId }: NewBusinessFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState(tabSequence[0]);
  const [bmi, setBmi] = React.useState<number | null>(null);
  const [bmiStatus, setBmiStatus] = React.useState<{ text: string, color: string } | null>(null);
  const [lifeInsuredSignatureDataUrl, setLifeInsuredSignatureDataUrl] = React.useState<string | null>(null);
  const [policyOwnerSignatureDataUrl, setPolicyOwnerSignatureDataUrl] = React.useState<string | null>(null);
  const [isSignatureVerified, setIsSignatureVerified] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [isCodeSent, setIsCodeSent] = React.useState(false);

  
  const isEditMode = !!businessId;
  
  const defaultValues = React.useMemo(() => {
    if (isEditMode && businessId) {
      const businessData = getPolicyById(parseInt(businessId, 10));
      if (businessData) {
        const nameParts = businessData.client.split(' ');
        const title = (['Mr', 'Mrs', 'Miss', 'Dr', 'Prof', 'Hon'].find(t => t === nameParts[0]) || 'Mr') as 'Mr' | 'Mrs' | 'Miss' | 'Dr' | 'Prof' | 'Hon';
        const nameWithoutTitle = nameParts[0] === title ? nameParts.slice(1).join(' ') : businessData.client;
        const nameOnlyParts = nameWithoutTitle.split(' ');

        const firstName = nameOnlyParts[0] || '';
        const surname = nameOnlyParts.length > 1 ? nameOnlyParts[nameOnlyParts.length - 1] : '';
        const middleName = nameOnlyParts.length > 2 ? nameOnlyParts.slice(1, -1).join(' ') : '';
        
        return {
          title: title,
          lifeAssuredFirstName: firstName,
          lifeAssuredMiddleName: middleName,
          lifeAssuredSurname: surname,
          policyNumber: businessData.policy || '',
          contractType: businessData.product as "Buy Term and Invest in Mutual Fund" | "The Education Policy",
          premiumAmount: businessData.premium,
          commencementDate: new Date(businessData.commencementDate),
          lifeAssuredDob: new Date('1985-05-20'),
          placeOfBirth: businessData.placeOfBirth,
          email: 'j.doe@example.com',
          phone: businessData.phone,
          postalAddress: '123 Main St, Accra',
          workTelephone: '030 123 4567',
          homeTelephone: '030 765 4321',
          residentialAddress: '456 Oak Avenue, Accra',
          gpsAddress: 'GA-123-4567',
          policyTerm: businessData.policyTerm,
          premiumTerm: businessData.premiumTerm,
          sumAssured: businessData.sumAssured,
          paymentFrequency: 'Monthly' as const,
          increaseMonth: format(new Date(businessData.commencementDate), 'MMMM'),
          premiumPayerSurname: businessData.payerName.split(' ').slice(-1).join(' '),
          premiumPayerOtherNames: businessData.payerName.split(' ').slice(0, -1).join(' '),
          premiumPayerOccupation: 'Accountant',
          bankName: businessData.bankName,
          bankBranch: 'Accra Main',
          maritalStatus: 'Married' as const,
          dependents: 2,
          gender: 'Male' as const,
          nationalIdType: 'Passport' as const,
          idNumber: 'G1234567',
          issueDate: new Date('2020-01-01'),
          expiryDate: new Date('2030-01-01'),
          placeOfIssue: 'Accra',
          country: 'Ghana',
          region: 'Greater Accra' as const,
          religion: 'Christian' as const,
          nationality: 'Ghana',
          languages: 'English, Twi',
          amountInWords: '',
          sortCode: businessData.sortCode,
          accountType: 'Current' as const,
          bankAccountName: businessData.payerName,
          bankAccountNumber: businessData.bankAccountNumber,
          occupation: 'Software Engineer',
          natureOfBusiness: 'Technology',
          employer: 'Google',
          employerAddress: '1600 Amphitheatre Parkway, Mountain View, CA',
          monthlyBasicIncome: 10000,
          otherIncome: 2000,
          totalMonthlyIncome: 12000,
          serialNumber: businessData.serial,
          isPolicyHolderPayer: businessData.client === businessData.payerName,
          primaryBeneficiaries: [],
          contingentBeneficiaries: [],
          height: '',
          heightUnit: 'cm' as const,
          weight: '',
        };
      }
    }
    return {
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
      height: '',
      heightUnit: 'cm' as const,
      weight: '',
      alcoholHabits: 'never_used' as const,
      alcoholBeer: { consumed: false, averagePerWeek: '', notes: '' },
      alcoholWine: { consumed: false, averagePerWeek: '', notes: '' },
      alcoholSpirits: { consumed: false, averagePerWeek: '', notes: '' },
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
      lifeInsuredSignature: '',
      policyOwnerSignature: '',
    };
  }, [isEditMode, businessId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as any,
  });
  
  const { fields: primaryFields, append: appendPrimary, remove: removePrimary } = useFieldArray({
    control: form.control,
    name: 'primaryBeneficiaries'
  });

  const { fields: contingentFields, append: appendContingent, remove: removeContingent } = useFieldArray({
    control: form.control,
    name: 'contingentBeneficiaries'
  });

  React.useEffect(() => {
    form.reset(defaultValues as any);
  }, [defaultValues, form]);


  const commencementDate = form.watch('commencementDate');
  const lifeAssuredDob = form.watch('lifeAssuredDob');
  const premiumAmount = form.watch('premiumAmount');
  const paymentFrequency = form.watch('paymentFrequency');
  const monthlyBasicIncome = form.watch('monthlyBasicIncome');
  const otherIncome = form.watch('otherIncome');
  const ageNextBirthday = form.watch('ageNextBirthday');
  const isPolicyHolderPayer = form.watch('isPolicyHolderPayer');
  const alcoholHabits = form.watch('alcoholHabits');
  const tobaccoHabits = form.watch('tobaccoHabits');
  const usedNicotineLast12Months = form.watch('usedNicotineLast12Months');
  const height = form.watch('height');
  const heightUnit = form.watch('heightUnit');
  const weight = form.watch('weight');
  const testedPositiveViralInfection = form.watch('testedPositiveViralInfection');
  const bloodTransfusionOrSurgery = form.watch('bloodTransfusionOrSurgery');
  const highBloodPressure = form.watch('highBloodPressure');
  const cancer = form.watch('cancer');
  const diabetes = form.watch('diabetes');
  const colitisCrohns = form.watch('colitisCrohns');
  const paralysisEpilepsy = form.watch('paralysisEpilepsy');
  const mentalIllness = form.watch('mentalIllness');
  const arthritis = form.watch('arthritis');
  const chestPain = form.watch('chestPain');
  const asthma = form.watch('asthma');
  const digestiveDisorder = form.watch('digestiveDisorder');
  const bloodDisorder = form.watch('bloodDisorder');
  const thyroidDisorder = form.watch('thyroidDisorder');
  const kidneyDisorder = form.watch('kidneyDisorder');
  const numbness = form.watch('numbness');
  const anxietyStress = form.watch('anxietyStress');
  const earEyeDisorder = form.watch('earEyeDisorder');
  const lumpGrowth = form.watch('lumpGrowth');
  const hospitalAttendance = form.watch('hospitalAttendance');
  const criticalIllness = form.watch('criticalIllness');
  const sti = form.watch('sti');
  const presentSymptoms = form.watch('presentSymptoms');
  const familyMedicalHistory = form.watch('familyMedicalHistory');
  const flownAsPilot = form.watch('flownAsPilot');
  const hazardousSports = form.watch('hazardousSports');
  const travelOutsideCountry = form.watch('travelOutsideCountry');


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
    if (height && weight && height > 0 && weight > 0) {
      let heightInMeters: number;
      switch (heightUnit) {
        case 'cm':
          heightInMeters = height / 100;
          break;
        case 'ft':
          heightInMeters = height * 0.3048;
          break;
        case 'm':
        default:
          heightInMeters = height;
          break;
      }

      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi);

      if (calculatedBmi < 18.5) {
        setBmiStatus({ text: 'Underweight', color: 'bg-blue-500' });
      } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
        setBmiStatus({ text: 'Healthy Weight', color: 'bg-green-500' });
      } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
        setBmiStatus({ text: 'Overweight', color: 'bg-yellow-500' });
      } else {
        setBmiStatus({ text: 'Obesity', color: 'bg-red-500' });
      }
    } else {
      setBmi(null);
      setBmiStatus(null);
    }
  }, [height, heightUnit, weight]);

  const handleTabChange = (direction: 'next' | 'prev') => {
    const currentIndex = tabSequence.indexOf(activeTab);
    if (direction === 'next') {
        if (currentIndex < tabSequence.length - 1) {
            setActiveTab(tabSequence[currentIndex + 1]);
        }
    } else {
        if (currentIndex > 0) {
            setActiveTab(tabSequence[currentIndex - 1]);
        }
    }
  };

  const handleSaveLifeInsuredSignature = (dataUrl: string) => {
    setLifeInsuredSignatureDataUrl(dataUrl);
    form.setValue('lifeInsuredSignature', dataUrl);
    toast({
        title: "Signature Saved",
        description: "The life insured's signature has been captured. Please proceed to verify identity.",
    });
  };

  const handleSavePolicyOwnerSignature = (dataUrl: string) => {
    setPolicyOwnerSignatureDataUrl(dataUrl);
    form.setValue('policyOwnerSignature', dataUrl);
    toast({
        title: "Signature Saved",
        description: "The policy owner's signature has been captured.",
    });
  };
  
  const handleSendCode = () => {
    // Placeholder function
    setIsCodeSent(true);
    toast({
      title: "Verification Code Sent",
      description: `A verification code has been sent to ${form.getValues('email')}. (This is a simulation).`,
    });
  };
  
  const handleVerifyCode = () => {
    // Placeholder function
    if (verificationCode === "123456") { // Simulate correct code
      setIsSignatureVerified(true);
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


  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.lifeInsuredSignature || !isSignatureVerified) {
        toast({
            variant: "destructive",
            title: "Submission Error",
            description: "Please ensure the Life Insured has signed and verified their identity before submitting.",
        });
        setActiveTab('declaration');
        return;
    }
    if (!isPolicyHolderPayer && !values.policyOwnerSignature) {
        toast({
            variant: "destructive",
            title: "Submission Error",
            description: "The Policy Owner must also sign the declaration.",
        });
        setActiveTab('declaration');
        return;
    }

    try {
        const lifeAssuredName = [values.title, values.lifeAssuredFirstName, values.lifeAssuredMiddleName, values.lifeAssuredSurname].filter(Boolean).join(' ');
        
        let finalPayerName: string;
        if (values.isPolicyHolderPayer) {
            finalPayerName = lifeAssuredName;
            values.premiumPayerOccupation = values.occupation;
        } else {
            finalPayerName = [values.premiumPayerOtherNames, values.premiumPayerSurname].filter(Boolean).join(' ');
        }


        if (isEditMode && businessId) {
            const policyId = parseInt(businessId, 10);
            const currentPolicy = getPolicyById(policyId);
            if (currentPolicy) {
                let newStatus = currentPolicy.onboardingStatus;
                if (currentPolicy.onboardingStatus === 'Rework Required') {
                    newStatus = 'Pending Vetting';
                } else if (currentPolicy.onboardingStatus === 'Mandate Rework Required') {
                    newStatus = 'Pending Mandate';
                }

                updatePolicy(policyId, {
                    client: lifeAssuredName,
                    product: values.contractType,
                    premium: values.premiumAmount,
                    sumAssured: values.sumAssured,
                    commencementDate: format(values.commencementDate, 'yyyy-MM-dd'),
                    phone: values.phone,
                    onboardingStatus: newStatus,
                    policyTerm: values.policyTerm,
                    premiumTerm: values.premiumTerm,
                    placeOfBirth: values.placeOfBirth,
                    payerName: finalPayerName,
                    bankName: values.bankName,
                    bankAccountNumber: values.bankAccountNumber,
                    sortCode: values.sortCode,
                    vettingNotes: newStatus === 'Pending Vetting' ? undefined : currentPolicy.vettingNotes,
                    mandateReworkNotes: newStatus === 'Pending Mandate' ? undefined : currentPolicy.mandateReworkNotes,
                });
                
                toast({
                    title: 'Form Updated',
                    description: 'Policy details have been successfully updated.',
                });
                router.push(`/business-development/clients/${businessId}?from=business-development`);
            } else {
                throw new Error("Policy not found for updating.");
            }
        } else {
            createPolicy({...values, payerName: finalPayerName});
            toast({
                title: 'Form Submitted',
                description: 'New client and policy details have been captured.',
            });
            router.push('/business-development/sales');
        }
    } catch (error) {
        console.error("Form submission error:", error);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: error instanceof Error ? error.message : "An unknown error occurred while submitting the form.",
        });
    }
  }
  
  const currentTabIndex = tabSequence.indexOf(activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabSequence.length - 1;


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto">
            <TabsTrigger value="policy-holder">Policy Holder & Coverage</TabsTrigger>
            <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="declaration">Declaration</TabsTrigger>
            <TabsTrigger value="payment-details">Payment Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="policy-holder" className="mt-6 space-y-8">
             <div>
              <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>Personal details of life insured</h3>
              <Separator className="my-0" />
            </div>
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
                    <Popover>
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
                          onSelect={field.onChange}
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
                    <Popover>
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
                          onSelect={field.onChange}
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
                    <Popover>
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
                          onSelect={field.onChange}
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

          <TabsContent value="beneficiaries" className="mt-6 space-y-6">
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Important Information</AlertTitle>
                <AlertDescription>
                    <p>The Policy Owner is the principal beneficiary. The Beneficiaries stated below will receive Policy proceeds at the death of the Policy Owner, unless otherwise specified, beneficiaries will share the proceeds equally. If a minor is named as a beneficiary, financial guardianship for the minor's estate will be required before policy proceeds can be released.</p>
                    <p className="mt-2">If you select an <strong>AN IRREVOCABLE BENEFICIARY (IB)</strong>, add a photocopy of a passport or driver's license as an ID.</p>
                </AlertDescription>
            </Alert>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <CardTitle>Primary Beneficiaries</CardTitle>
                         <Button type="button" size="sm" onClick={() => appendPrimary({ name: '', dob: new Date(), gender: 'Male', relationship: '', telephone: '', percentage: 0, isIrrevocable: false })}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Primary
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Relationship</TableHead>
                                    <TableHead>Telephone</TableHead>
                                    <TableHead>Percentage (%)</TableHead>
                                    <TableHead>IB</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {primaryFields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`primaryBeneficiaries.${index}.name`}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Beneficiary Name" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                             <FormField
                                                control={form.control}
                                                name={`primaryBeneficiaries.${index}.dob`}
                                                render={({ field }) => (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                            <Button
                                                                variant={'outline'}
                                                                className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                                                            >
                                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
                                                                captionLayout="dropdown-buttons"
                                                                fromYear={1900}
                                                                toYear={new Date().getFullYear()}
                                                                disabled={(date) => date > new Date()}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`primaryBeneficiaries.${index}.gender`}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                        <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`primaryBeneficiaries.${index}.relationship`}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="e.g., Spouse" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`primaryBeneficiaries.${index}.telephone`}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="e.g., 024..." />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`primaryBeneficiaries.${index}.percentage`}
                                                render={({ field }) => (
                                                    <Input type="number" {...field} placeholder="e.g., 100" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                             <FormField
                                                control={form.control}
                                                name={`primaryBeneficiaries.${index}.isIrrevocable`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-center h-full">
                                                        <FormControl>
                                                            <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removePrimary(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Contingent Beneficiaries</CardTitle>
                        <Button type="button" size="sm" onClick={() => appendContingent({ name: '', dob: new Date(), gender: 'Male', relationship: '', telephone: '', percentage: 0 })}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Contingent
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                     <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Relationship</TableHead>
                                    <TableHead>Telephone</TableHead>
                                    <TableHead>Percentage (%)</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contingentFields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`contingentBeneficiaries.${index}.name`}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Beneficiary Name" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                             <FormField
                                                control={form.control}
                                                name={`contingentBeneficiaries.${index}.dob`}
                                                render={({ field }) => (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                            <Button
                                                                variant={'outline'}
                                                                className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                                                            >
                                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
                                                                captionLayout="dropdown-buttons"
                                                                fromYear={1900}
                                                                toYear={new Date().getFullYear()}
                                                                disabled={(date) => date > new Date()}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`contingentBeneficiaries.${index}.gender`}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                        <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`contingentBeneficiaries.${index}.relationship`}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="e.g., Child" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`contingentBeneficiaries.${index}.telephone`}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="e.g., 024..." />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`contingentBeneficiaries.${index}.percentage`}
                                                render={({ field }) => (
                                                    <Input type="number" {...field} placeholder="e.g., 100" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeContingent(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="mt-6 space-y-6">
            <div>
                <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>HEALTH DETAILS</h3>
                <Separator className="my-0" />
            </div>
            <div className="p-4 space-y-8">
                <Alert variant="destructive">
                    <AlertTitle className="font-black">WARNING</AlertTitle>
                    <AlertDescription>
                        The answers you give to these questions are material. If you fail to give accurate answers, it may affect the terms of your contract and we may decline a claim. In some cases the Company may check these answers by obtaining a report from your doctor/hospital.
                    </AlertDescription>
                </Alert>
                <div className="space-y-2">
                    <h3 className="font-bold">1. Alcohol use</h3>
                    <p className="text-sm text-muted-foreground">1.1 Which of the following best describes your drinking habits (please tick one)</p>
                </div>
                <FormField
                    control={form.control}
                    name="alcoholHabits"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                 <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2"
                                >
                                    {alcoholHabitsOptions.map((option) => (
                                        <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value={option} />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {alcoholHabitsLabels[option]}
                                            </FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                { (alcoholHabits === 'occasional_socially' || alcoholHabits === 'current_regular_drinker') && (
                    <div className="space-y-4 pt-4">
                        <p className="text-sm text-muted-foreground">1.2 If you have confirmed that you "drink occasionally or socially only" or you are a "current regular drinker", please confirm the type and amount you drink in the table below.</p>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">Tick</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Average per week</TableHead>
                                        <TableHead>Notes (if any)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="alcoholBeer.consumed"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-center h-full"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>Beer</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="alcoholBeer.averagePerWeek"
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="e.g., 3 bottles" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="alcoholBeer.notes"
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Notes" />
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="alcoholWine.consumed"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-center h-full"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>Wine</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="alcoholWine.averagePerWeek"
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="e.g., 2 glasses" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="alcoholWine.notes"
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Notes" />
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="alcoholSpirits.consumed"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-center h-full"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>Spirits</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="alcoholSpirits.averagePerWeek"
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="e.g., 1 shot" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="alcoholSpirits.notes"
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Notes" />
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
                
                <div className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">1.3 In the last 5 years, have you ever reduced the amount of alcohol you drink for any of the following reasons</p>
                    <div className="rounded-md border">
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reason</TableHead>
                                    <TableHead className="w-48">Tick yes/no</TableHead>
                                    <TableHead>Notes (if any)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">You were advised by a medical professional</TableCell>
                                    <TableCell>
                                        <FormField
                                            control={form.control}
                                            name="reducedAlcoholMedicalAdvice.reduced"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                         <FormField
                                            control={form.control}
                                            name="reducedAlcoholMedicalAdvice.notes"
                                            render={({ field }) => (
                                                <Input {...field} placeholder="Notes" />
                                            )}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Alcohol was causing or contributing to health problems</TableCell>
                                    <TableCell>
                                        <FormField
                                            control={form.control}
                                            name="reducedAlcoholHealthProblems.reduced"
                                            render={({ field }) => (
                                                 <FormItem>
                                                    <FormControl>
                                                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                         <FormField
                                            control={form.control}
                                            name="reducedAlcoholHealthProblems.notes"
                                            render={({ field }) => (
                                                <Input {...field} placeholder="Notes" />
                                            )}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <Separator />
                 <div className="space-y-2">
                    <h3 className="font-bold">2. Tobacco and nicotine use</h3>
                    <p className="text-sm text-muted-foreground">2.1 Which of the following best describes your smoking habits (Please tick one)</p>
                </div>
                 <FormField
                    control={form.control}
                    name="tobaccoHabits"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                 <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2"
                                >
                                    {tobaccoHabitsOptions.map((option) => (
                                        <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value={option} />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {tobaccoHabitsLabels[option]}
                                            </FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="usedNicotineLast12Months"
                  render={({ field }) => (
                    <FormItem className="rounded-lg border p-4 space-y-3">
                      <FormLabel>
                        2.2 Have you used any tobacco or nicotine products including cigarettes, cigarillos, colts, cigars, pipes, chewing tobacco, snuff, nicotine gum or patches, or any form of nicotine substitute in the last 12 months?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                { (usedNicotineLast12Months === 'yes' || tobaccoHabits === 'current_regular_smoker') && (
                    <div className="space-y-4 pt-4">
                        <p className="text-sm text-muted-foreground">2.3 If you answered "yes" to questions 2.2 above or have confirmed that you are a "Current regular smoker", please confirm the type and amount you smoke below.</p>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">Tick</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Average per day</TableHead>
                                        <TableHead>Average per week</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><FormField control={form.control} name="tobaccoCigarettes.smoked" render={({ field }) => (<FormItem className="flex items-center justify-center h-full"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} /></TableCell>
                                        <TableCell>Cigarettes</TableCell>
                                        <TableCell><FormField control={form.control} name="tobaccoCigarettes.avgPerDay" render={({ field }) => (<Input {...field} />)} /></TableCell>
                                        <TableCell><FormField control={form.control} name="tobaccoCigarettes.avgPerWeek" render={({ field }) => (<Input {...field} />)} /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><FormField control={form.control} name="tobaccoCigars.smoked" render={({ field }) => (<FormItem className="flex items-center justify-center h-full"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} /></TableCell>
                                        <TableCell>Cigars</TableCell>
                                        <TableCell><FormField control={form.control} name="tobaccoCigars.avgPerDay" render={({ field }) => (<Input {...field} />)} /></TableCell>
                                        <TableCell><FormField control={form.control} name="tobaccoCigars.avgPerWeek" render={({ field }) => (<Input {...field} />)} /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><FormField control={form.control} name="tobaccoPipe.smoked" render={({ field }) => (<FormItem className="flex items-center justify-center h-full"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} /></TableCell>
                                        <TableCell>Pipe</TableCell>
                                        <TableCell><FormField control={form.control} name="tobaccoPipe.avgPerDay" render={({ field }) => (<Input {...field} />)} /></TableCell>
                                        <TableCell><FormField control={form.control} name="tobaccoPipe.avgPerWeek" render={({ field }) => (<Input {...field} />)} /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><FormField control={form.control} name="tobaccoNicotineReplacement.smoked" render={({ field }) => (<FormItem className="flex items-center justify-center h-full"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} /></TableCell>
                                        <TableCell>Nicotine replacement products</TableCell>
                                        <TableCell><FormField control={form.control} name="tobaccoNicotineReplacement.avgPerDay" render={({ field }) => (<Input {...field} />)} /></TableCell>
                                        <TableCell><FormField control={form.control} name="tobaccoNicotineReplacement.avgPerWeek" render={({ field }) => (<Input {...field} />)} /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><FormField control={form.control} name="tobaccoEcigarettes.smoked" render={({ field }) => (<FormItem className="flex items-center justify-center h-full"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} /></TableCell>
                                        <TableCell>E-cigarettes</TableCell>
                                        <TableCell><FormField control={form.control} name="tobaccoEcigarettes.avgPerDay" render={({ field }) => (<Input {...field} />)} /></TableCell>
                                        <TableCell><FormField control={form.control} name="tobaccoEcigarettes.avgPerWeek" render={({ field }) => (<Input {...field} />)} /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><FormField control={form.control} name="tobaccoOther.smoked" render={({ field }) => (<FormItem className="flex items-center justify-center h-full"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} /></TableCell>
                                        <TableCell><FormField control={form.control} name="tobaccoOther.otherType" render={({ field }) => (<Input {...field} placeholder="Other (specify)" />)} /></TableCell>
                                        <TableCell><FormField control={form.control} name="tobaccoOther.avgPerDay" render={({ field }) => (<Input {...field} />)} /></TableCell>
                                        <TableCell><FormField control={form.control} name="tobaccoOther.avgPerWeek" render={({ field }) => (<Input {...field} />)} /></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
                <Separator />
                <div className="space-y-4">
                    <h3 className="font-bold">Height and Weight</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="height"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>What is your height?</FormLabel>
                                <div className="flex items-center gap-2">
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 175" {...field} />
                                    </FormControl>
                                    <FormField
                                        control={form.control}
                                        name="heightUnit"
                                        render={({ field: unitField }) => (
                                            <Select onValueChange={unitField.onChange} value={unitField.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-[80px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="cm">cm</SelectItem>
                                                    <SelectItem value="m">m</SelectItem>
                                                    <SelectItem value="ft">ft</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>What is your weight? (KG)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 70" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {bmi && bmiStatus && (
                        <div className="mt-4 space-y-2">
                            <FormLabel>Body Mass Index (BMI)</FormLabel>
                            <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold">{bmi.toFixed(1)}</div>
                            <Badge className={cn('text-white', bmiStatus.color)}>{bmiStatus.text}</Badge>
                            </div>
                        </div>
                    )}
                </div>
                 <Separator />
                <div className="space-y-4">
                    <h3 className="font-bold">3. Recreational Drugs</h3>
                    <FormField
                        control={form.control}
                        name="usedRecreationalDrugs"
                        render={({ field }) => (
                            <FormItem className="rounded-lg border p-4 space-y-3">
                            <FormLabel>
                                3.1 Have you ever used recreational drugs (e.g. cocaine, heroin, weed) or taken drugs other than for medical purposes?
                            </FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="injectedNonPrescribedDrugs"
                        render={({ field }) => (
                            <FormItem className="rounded-lg border p-4 space-y-3">
                            <FormLabel>
                                3.2 Have you ever injected a non-prescribed drugs?
                            </FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Separator />
                 <div className="space-y-4">
                    <h3 className="font-bold">4. Viral Co-infections</h3>
                    <FormField
                        control={form.control}
                        name="testedPositiveViralInfection"
                        render={({ field }) => (
                            <FormItem className="rounded-lg border p-4 space-y-3">
                            <FormLabel>
                                4.1 Have you ever been tested positive for HIV, Hepatitis B or C, or are you awaiting the results of such a test?
                            </FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    {testedPositiveViralInfection === 'yes' && (
                        <div className="rounded-lg border p-4 space-y-4 bg-muted/50">
                            <p className="text-sm text-muted-foreground">If Yes please specify below:</p>
                            <div className="flex items-center gap-6">
                                <FormLabel className="min-w-[140px]">Tested positive for:</FormLabel>
                                <div className="flex flex-wrap gap-4">
                                    <FormField control={form.control} name="testedPositiveFor.hiv" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">HIV</FormLabel></FormItem>)} />
                                    <FormField control={form.control} name="testedPositiveFor.hepB" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Hepatitis B</FormLabel></FormItem>)} />
                                    <FormField control={form.control} name="testedPositiveFor.hepC" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Hepatitis C</FormLabel></FormItem>)} />
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <FormLabel className="min-w-[140px]">Awaiting results for:</FormLabel>
                                <div className="flex flex-wrap gap-4">
                                    <FormField control={form.control} name="awaitingResultsFor.hiv" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">HIV</FormLabel></FormItem>)} />
                                    <FormField control={form.control} name="awaitingResultsFor.hepB" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Hepatitis B</FormLabel></FormItem>)} />
                                    <FormField control={form.control} name="awaitingResultsFor.hepC" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Hepatitis C</FormLabel></FormItem>)} />
                                </div>
                            </div>
                        </div>
                    )}
                 </div>
                 <Separator />
                  <div className="space-y-4">
                    <h3 className="font-medium">Have you ever had, received or been diagnosed with any of the following:</h3>
                    <div className="space-y-3">
                       <FormField
                          control={form.control}
                          name="bloodTransfusionOrSurgery"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">5. Blood transfusion or surgery</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {bloodTransfusionOrSurgery === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="bloodTransfusionOrSurgeryDetails" illnessOptions={['Blood transfusion', 'Surgery']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="highBloodPressure"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">6. High blood pressure, angina, heart attack, stroke, coma or other diseases of the heart, arteries or circulation?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {highBloodPressure === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="highBloodPressureDetails" illnessOptions={['High blood pressure', 'Angina', 'Heart attack', 'Stroke', 'Coma', 'Other heart/artery/circulation disease']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />

                       <FormField
                          control={form.control}
                          name="cancer"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">7. Cancer, Leukemia, Hodgkin's disease, lymphoma or any other tumor?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {cancer === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="cancerDetails" illnessOptions={['Cancer', 'Leukemia', "Hodgkin's disease", 'Lymphoma', 'Other tumor']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="diabetes"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">8. Any form of diabetes?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {diabetes === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="diabetesDetails" illnessOptions={['Diabetes']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="colitisCrohns"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">9. Colitis, Crohn's disease</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {colitisCrohns === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="colitisCrohnsDetails" illnessOptions={['Colitis', "Crohn's disease"]} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="paralysisEpilepsy"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">10. Paralysis, multiple sclerosis, epilepsy, dementia or other disorder of the central nervous system?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {paralysisEpilepsy === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="paralysisEpilepsyDetails" illnessOptions={['Paralysis', 'Multiple sclerosis', 'Epilepsy', 'Dementia', 'Other central nervous system disorder']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="mentalIllness"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">11. Any mental illness that required Hospital or psychiatric treatment, depression and/or nevous breakdown?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {mentalIllness === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="mentalIllnessDetails" illnessOptions={['Hospital/psychiatric treatment for mental illness', 'Depression', 'Nervous breakdown']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <h3 className="font-medium">In the past 5 years have you ever had:</h3>
                    <div className="space-y-3">
                         <FormField
                          control={form.control}
                          name="arthritis"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">12. Arthritis, neck or back pain, gout or other muscle, joint or bone disorder</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {arthritis === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="arthritisDetails" illnessOptions={['Arthritis', 'Neck or back pain', 'Gout', 'Other muscle/joint/bone disorder']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="chestPain"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">13. Chest pain, irregular heart beat or raised cholesterol?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {chestPain === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="chestPainDetails" illnessOptions={['Chest pain', 'Irregular heart beat', 'Raised cholesterol']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                        <FormField
                            control={form.control}
                            name="asthma"
                            render={({ field }) => (
                                <FormItem className="flex flex-col rounded-lg border p-4">
                                    <div className="flex flex-row items-center justify-between">
                                        <FormLabel className="max-w-[80%]">14. Asthma, bronchitis, shortness of breath or other chest complaint?</FormLabel>
                                        <FormControl>
                                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                        </RadioGroup>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                    {asthma === 'yes' && (
                                        <div className="pt-4">
                                            <MedicalConditionDetailsTable form={form} fieldName="asthmaDetails" illnessOptions={['Asthma', 'Bronchitis', 'Shortness of breath', 'Other chest complaint']} />
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />
                         <FormField
                          control={form.control}
                          name="digestiveDisorder"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">15. Duodenal or gastric ulcer or any other disorder of the digestive system, liver or pancreases?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {digestiveDisorder === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="digestiveDisorderDetails" illnessOptions={['Duodenal Ulcer', 'Gastric Ulcer', 'Digestive System Disorder', 'Liver Disorder', 'Disorder of Pancreas']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                          <FormField
                          control={form.control}
                          name="bloodDisorder"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">16. Blood disorder or anemia?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {bloodDisorder === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="bloodDisorderDetails" illnessOptions={['Blood disorder', 'Anemia']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="thyroidDisorder"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">17. Thyroid disorder?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {thyroidDisorder === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="thyroidDisorderDetails" illnessOptions={['Thyroid disorder']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="kidneyDisorder"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">18. Kidney, renal failure or bladder disorder?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {kidneyDisorder === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="kidneyDisorderDetails" illnessOptions={['Kidney disorder', 'Renal failure', 'Bladder disorder']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="numbness"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">19. Numbness, loss of feelings or tingling of the limbs or face or temporary loss of muscle power?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {numbness === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="numbnessDetails" />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="anxietyStress"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">20. Any medical attention for anxiety, stress or depression?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {anxietyStress === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="anxietyStressDetails" illnessOptions={['Anxiety', 'Stress', 'Depression']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="earEyeDisorder"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">21. Disorder of the ear or eye, blindness (including blurred or double vision)? Please ignore sight problems corrected by lens.</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {earEyeDisorder === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="earEyeDisorderDetails" illnessOptions={['Ear disorder', 'Eye disorder', 'Blindness', 'Blurred vision', 'Double vision']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="lumpGrowth"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">22. A lump or growth of any kind, or any mole or freckle that has bled, become painful, changed colour or increased in size?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {lumpGrowth === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="lumpGrowthDetails" illnessOptions={['Lump', 'Growth', 'Mole', 'Freckle']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="hospitalAttendance"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">23. In the past 5 years have you attended, or been asked to attend, any hospital or clinic for investigation, x-ray, scan, checkup, or operation for any medical condition not already disclosed?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {hospitalAttendance === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="hospitalAttendanceDetails" illnessOptions={['X-ray', 'Scan', 'Checkup', 'Operation']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="criticalIllness"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">24. This policy also provides cover for critical illness, have you ever had heart attack, coronary artery disease requiring surgery, paraplegia, loss of speech, major organ transplant, coma, major burns, Alzheimer's disease and multiple sclerosis.</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {criticalIllness === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="criticalIllnessDetails" illnessOptions={['Heart Attack', 'Coronary Artery Disease', 'Paraplegia', 'Loss of Speech', 'Major Organ Transplant', 'Coma', 'Major Burns', "Alzheimer's Disease", 'Multiple Sclerosis']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="sti"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">25. Sexually transmitted infections (STI's) (e.g. urethral discharge, chancroid, gonorrhoea, syphilis, urethritis, genital sores, HIV infection, balanitis, genital warts, vaginal discharge or vaginal trush?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {sti === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="stiDetails" illnessOptions={['Urethral discharge', 'Chancroid', 'Gonorrhoea', 'Syphilis', 'Urethritis', 'Genital sores', 'HIV infection', 'Balanitis', 'Genital Warts', 'Vaginal discharge', 'Vaginal trush']} />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <h3 className="font-medium">Are you presently:</h3>
                    <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="presentSymptoms"
                          render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className="max-w-[80%]">26. Experiencing any symptom, condition or disability not mentioned above?</FormLabel>
                                <FormControl>
                                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </div>
                              <FormMessage />
                              {presentSymptoms === 'yes' && (
                                <div className="pt-4">
                                  <MedicalConditionDetailsTable form={form} fieldName="presentSymptomsDetails" />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                        {[
                            { name: 'presentWaitingConsultation', label: '27. Waiting to have any consultation, investigation, test or follow up on any condition not previously disclosed?' },
                            { name: 'presentTakingMedication', label: '28. Taking any medication or any other form of medical treatment for any condition not previously disclosed?' },
                        ].map(item => (
                            <FormField
                                key={item.name}
                                control={form.control}
                                name={item.name as any}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <FormLabel className="max-w-[80%]">{item.label}</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage className="col-span-full" />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </div>
                 <Separator />
                <div className="space-y-4">
                    <h3 className="font-bold">Family Medical History</h3>
                    <FormField
                        control={form.control}
                        name="familyMedicalHistory"
                        render={({ field }) => (
                            <FormItem className="flex flex-col rounded-lg border p-4">
                                <div className="flex flex-row items-center justify-between">
                                    <FormLabel className="max-w-[80%]">29. Has/Have any of your biological parents, brothers or sisters been diagnosed with or died from any of the following before the age 60; 
Heart disease, diabetes, cancer, Huntington's disease, polycystic kidney disease, multiple sclerosis, polyposis, Glaucoma, polyposis of colon or any form of hereditary disorder?</FormLabel>
                                    <FormControl>
                                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                                <FormMessage />
                                {familyMedicalHistory === 'yes' && (
                                    <div className="pt-4">
                                        <FamilyMedicalHistoryTable form={form} fieldName="familyMedicalHistoryDetails" />
                                    </div>
                                )}
                            </FormItem>
                        )}
                    />
                </div>
                 <div className="mt-8">
                    <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>DOCTOR'S DETAILS</h3>
                    <Separator className="my-0" />
                </div>
                <div className="p-4 space-y-6">
                    <h4 className="font-medium">Current doctor's details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="currentDoctorName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name of doctor</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="currentDoctorPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telephone Number</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="currentDoctorHospital"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hospital & Address</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <p className="font-bold">If you have changed your doctor in the last six months, please give your previous doctor's details below.</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="previousDoctorName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name of previous doctor</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="previousDoctorPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telephone number</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="previousDoctorHospital"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hospital & Address</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="lifestyle" className="mt-6 space-y-6">
            <div>
                <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>LIFESTYLE DETAILS</h3>
                <Separator className="my-0" />
            </div>
            <div className="p-4 space-y-8">
                 <FormField
                  control={form.control}
                  name="flownAsPilot"
                  render={({ field }) => (
                    <FormItem className="flex flex-col rounded-lg border p-4">
                      <div className="flex flex-row items-center justify-between">
                        <FormLabel className="max-w-[80%]">1. In the past 3 years have you flown as a pilot, student pilot, or crew member on any aircraft (other than commercial) or do you intend to do so in the future?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <FormMessage />
                      {flownAsPilot === 'yes' && (
                        <div className="pt-4">
                           <LifestyleDetailTable
                                form={form}
                                fieldName="flownAsPilotDetails"
                                itemOptions={['Pilot', 'Student Pilot', 'Crew Member', 'Intend to do']}
                            />
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="hazardousSports"
                  render={({ field }) => (
                    <FormItem className="flex flex-col rounded-lg border p-4">
                      <div className="flex flex-row items-center justify-between">
                        <FormLabel className="max-w-[80%]">2. Have you been engaging in any hazardous sports such as scuba diving, mountain climbing, parachuting, hang gliding, paragliding, or racing of automobiles, motorcycles, boat, or intend to do so in the future?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <FormMessage />
                      {hazardousSports === 'yes' && (
                        <div className="pt-4">
                           <LifestyleDetailTable
                                form={form}
                                fieldName="hazardousSportsDetails"
                                itemOptions={['Scuba diving', 'Mountain Climbing', 'Parachuting', 'Hang gliding', 'Paragliding', 'Automobile racing', 'Motorcycles Racing', 'Boat racing', 'Intend to do so']}
                            />
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="travelOutsideCountry"
                  render={({ field }) => (
                    <FormItem className="flex flex-col rounded-lg border p-4">
                      <div className="flex flex-row items-center justify-between">
                        <FormLabel className="max-w-[80%]">3. In the next 30 days, are you scheduled to live, work or go on holiday outside your country of residence?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <FormMessage />
                      {travelOutsideCountry === 'yes' && (
                        <div className="pt-4">
                           <LifestyleDetailTable
                                form={form}
                                fieldName="travelOutsideCountryDetails"
                                itemOptions={['Live Outside', 'Work outside', 'Go on Holiday']}
                            />
                        </div>
                      )}
                    </FormItem>
                  )}
                />
            </div>
          </TabsContent>
          <TabsContent value="declaration" className="mt-6 space-y-6">
             <div>
              <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>DECLARATION BY LIFE INSURED</h3>
              <Separator className="my-0" />
            </div>
            <Card>
                <CardContent className="pt-6 space-y-4 text-sm">
                    <p>1. I declare that the information provided by me in this application together with any additional statements or documents, whether in my own handwriting or not, are wholly true and accurate and shall form the basis of the life insurance contract between the Company and myself and shall be read together with the policy document.</p>
                    <p>2. I have read over my responses to the questions in this application and I declare that all the answers are true and correct.</p>
                    <p>3. I understand that if any information is found to be false, misleading or incorrect, this policy shall be rendered void and the position of any payments made shall be at the discretion of the Company.</p>
                    <div className="pt-4 space-y-4">
                        <h4 className="font-bold uppercase">INFORMED CONSENT BY LIFE INSURED</h4>
                        <p>4. I hereby consent and irrevocably authorize FIRST INSURANCE COMPANY LIMITED to elicit relevant and necessary information from any certified medical Officer who has attended to me, or any insurance office to which an application for insurance has been made on my life, or any other person who may be in possession or hereafter acquire information concerning my state or health up to the present time to disclose such information to the Company First Insurance and agree that this authority shall remain in force prior to or after my death.</p>
                        <p>5. I understand that i may be required to undergo medical examination and/or tests where necessary and I give consent to a certified Medical Officer or any other appointed health provider to take sample of my blood, urine or other bodily fluid for the purpose of conducting such test.</p>
                        <p>6. I understand that it is my responsibility to avail myself for any necessary re-testing and that, if i choose not to do so, the Company may consider my inaction as a request to withdraw this application.</p>
                    </div>
                    <Separator className="my-6" />
                    <div className="space-y-4">
                        <h4 className="font-bold">Signature of Life Insured</h4>
                        <SignaturePad onSave={handleSaveLifeInsuredSignature} />
                    </div>
                     {lifeInsuredSignatureDataUrl && (
                        <div className="space-y-4 pt-4">
                            <Separator />
                            <h4 className="font-bold">Identity Verification</h4>
                            {!isSignatureVerified ? (
                                <div className="p-4 border rounded-md bg-muted/50 space-y-4">
                                    <p className="text-sm text-muted-foreground">To verify your signature, a confirmation code will be sent to your email address on file. Please click the button below to receive your code.</p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button type="button" onClick={handleSendCode} disabled={isCodeSent}>
                                            <Send className="mr-2" />
                                            {isCodeSent ? 'Code Sent' : 'Send Verification Code'}
                                        </Button>
                                        {isCodeSent && (
                                            <div className="flex items-center gap-2">
                                                <Input 
                                                    placeholder="Enter 6-digit code" 
                                                    value={verificationCode}
                                                    onChange={(e) => setVerificationCode(e.target.value)}
                                                    maxLength={6}
                                                />
                                                <Button type="button" onClick={handleVerifyCode}>Verify</Button>
                                            </div>
                                        )}
                                    </div>
                                    {isCodeSent && <FormDescription>For this demo, please use the code: <strong>123456</strong></FormDescription>}
                                </div>
                            ) : (
                                <Alert variant="default" className="bg-green-100 dark:bg-green-900/30 border-green-500/50">
                                    <ShieldCheck className="h-4 w-4 text-green-600" />
                                    <AlertTitle className="text-green-700 dark:text-green-400">Signature Verified</AlertTitle>
                                    <AlertDescription className="text-green-700 dark:text-green-500">
                                        Your identity has been confirmed. You may now proceed to submit the application.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                     <Separator className="my-6" />
                    <div className="space-y-4">
                        <h4 className="font-bold uppercase">DECLARATION OF CONDITIONAL COVERAGE BY POLICY OWNER</h4>
                        <ol className="list-decimal list-outside space-y-2 pl-5">
                            <li>I submit this application with the intention of entering into a contract with FIRST INSURANCE COMPANY LIMITED for the benefit set out in its policy and on its terms and conditions.</li>
                            <li>
                                <p className="font-bold">I understand and agree that the insurance coverage I am applying for is subject to all the following conditions being met:</p>
                                <ul className="list-disc list-outside space-y-1 pl-6 mt-2">
                                    <li>All the information provided in this application together with any additional statement or documents are wholly true and accurate.</li>
                                    <li>All information concerning the insurability of the Life Insured (including but not limited to, the result of medical examinations or body fluid studies and certified Medical Officer's statements) is received by the Company.</li>
                                    <li>The Company's underwriters have accepted this application for life insurance.</li>
                                    <li>The Company has received the first premium in full.</li>
                                    <li>The final premium will be determined by the Company's underwriters.</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                     <div className="space-y-4 pt-4">
                        <Separator />
                        <h4 className="font-bold">Signature of Policy Owner</h4>
                        <SignaturePad onSave={handleSavePolicyOwnerSignature} />
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payment-details" className="mt-6 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>Payment Details</h3>
              <Separator className="my-0" />
            </div>
             <div className="p-4 space-y-6">
                <FormField
                    control={form.control}
                    name="isPolicyHolderPayer"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                Will you be paying for this policy by yourself?
                                </FormLabel>
                                <FormDescription>
                                If not, you will be required to provide the details of the person paying for the policy.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {!isPolicyHolderPayer && (
                    <div className="space-y-6">
                        <h4 className="font-medium p-2 rounded-t-md" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))' }}>
                            Premium Payer's Details
                        </h4>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 p-4 border rounded-md bg-muted/50">
                             <FormField
                                control={form.control}
                                name="premiumPayerSurname"
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
                                name="premiumPayerOtherNames"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Other Names</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jane" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="premiumPayerOccupation"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Occupation</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Teacher" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="premiumPayerRelationship"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Relationship to Insured</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Spouse, Parent" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="premiumPayerResidentialAddress"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Residential Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Payer Lane" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="premiumPayerPostalAddress"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Postal Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="P.O. Box 123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="premiumPayerDob"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of Birth</FormLabel>
                                    <Popover>
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
                                        onSelect={field.onChange}
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
                                name="premiumPayerBusinessName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Business Name (if applicable)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Payer Corp" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <h5 className="font-medium text-primary/90">For Owners who are individuals</h5>
                         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4 border rounded-md bg-muted/50">
                            <FormField
                                control={form.control}
                                name="premiumPayerIdType"
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
                                name="premiumPayerIdNumber"
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
                                name="premiumPayerPlaceOfIssue"
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
                                name="premiumPayerIssueDate"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Issue Date</FormLabel>
                                    <Popover>
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
                                        onSelect={field.onChange}
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
                                name="premiumPayerExpiryDate"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Expiry Date</FormLabel>
                                    <Popover>
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
                                        onSelect={field.onChange}
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
                    </div>
                )}
            
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="premiumAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Premium Amount (GHS)</FormLabel>
                          <FormControl>
                            <Input type="number" disabled value={premiumAmount} />
                          </FormControl>
                          <FormDescription>From Policy Details section.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amountInWords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount in Words</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Five Hundred Ghana Cedis" {...field} />
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
                            <FormLabel>Premium Deduction Frequency</FormLabel>
                            <FormControl>
                                <Input disabled value={paymentFrequency} />
                            </FormControl>
                            <FormDescription>From Policy Details section.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a bank" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bankNames.map((bank) => (
                                <SelectItem key={bank} value={bank}>
                                  {bank}
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
                      name="bankBranch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Branch</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Accra Main" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sortCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sort Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="accountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Account</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Current">Current</SelectItem>
                              <SelectItem value="Savings">Savings</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bankAccountName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Account Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., John K. Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bankAccountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Account Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 001122334455" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
             </div>
          </TabsContent>

        </Tabs>
        
        <div className="flex justify-between p-4">
            {!isFirstTab ? (
                 <Button type="button" variant="outline" onClick={() => handleTabChange('prev')}>
                    Previous
                </Button>
            ) : <div />}
           
            {activeTab !== 'declaration' && !isLastTab ? (
                 <Button type="button" onClick={() => handleTabChange('next')}>
                    Next
                </Button>
            ) : null}

            {activeTab === 'declaration' && (
                 <Button type="button" onClick={() => handleTabChange('next')} disabled={!isSignatureVerified}>
                    Proceed to Payment
                </Button>
            )}

            {isLastTab && (
                 <Button type="submit" disabled={!isSignatureVerified}>
                    {isEditMode ? 'Update Application' : 'Submit Application'}
                </Button>
            )}
        </div>
      </form>
    </Form>
  );
}



    

    

































    






    

    







