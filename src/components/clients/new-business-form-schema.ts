

import { z } from 'zod';
import { format } from 'date-fns';

const idTypes = [
  "Driver's License",
  'Passport',
  'Voter ID',
  'National ID',
  'SSNIT',
  'NHIS',
  'TIN',
] as const;

const phoneRegex = /^[0-9]{9}$/;
const phoneError = "Phone number must be a 9-digit number (e.g., 558009876)";

const beneficiarySchema = z.object({
    name: z.string().min(1, "Name is required.").default(''),
    dob: z.date({ required_error: 'Date of birth is required.' }),
    gender: z.enum(['Male', 'Female']),
    relationship: z.string().min(1, "Relationship is required.").default(''),
    telephone: z.string().regex(phoneRegex, phoneError).optional().or(z.literal('')),
    percentage: z.coerce.number().min(0).max(100, "Percentage must be between 0 and 100."),
    isIrrevocable: z.boolean().optional().default(false),
});

const existingPolicySchema = z.object({
  companyName: z.string().min(1, "Company name is required.").default(''),
  personCovered: z.string().min(1, "Name of person covered is required.").default(''),
  policyType: z.string().min(1, "Type of policy is required.").default(''),
  issueDate: z.date({ required_error: 'Issue date is required.' }),
  premiumAmount: z.coerce.number().positive(),
  faceAmount: z.coerce.number().positive(),
  changedGrpOrInd: z.enum(['yes', 'no'], { required_error: "This field is required."}).default('no'),
});

const declinedPolicySchema = z.object({
    companyName: z.string().min(1, "Company name is required.").default(''),
    details: z.string().min(1, "Details are required.").default(''),
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
    averagePerWeek: z.string().optional().default(''),
    notes: z.string().optional().default(''),
});

const reducedAlcoholReasonSchema = z.object({
    reduced: z.enum(['yes', 'no']).default('no'),
    notes: z.string().optional().default(''),
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
    avgPerDay: z.string().optional().default(''),
    avgPerWeek: z.string().optional().default(''),
    otherType: z.string().optional().default(''),
});

const viralInfectionDetailSchema = z.object({
    hiv: z.boolean().default(false),
    hepB: z.boolean().default(false),
    hepC: z.boolean().default(false),
});

export const illnessDetailSchema = z.object({
  illness: z.string().min(1, 'Illness/Injury is required.').default(''),
  date: z.date({ required_error: 'Date is required.' }).optional(),
  hospital: z.string().optional().default(''),
  duration: z.string().optional().default(''),
  status: z.string().optional().default(''),
  // High Blood Pressure
  diagnosisDate: z.date().optional(),
  bpReadingAtDiagnosis: z.string().optional().default(''),
  causeOfHighBp: z.string().optional().default(''),
  prescribedTreatment: z.string().optional().default(''),
  complications: z.string().optional().default(''),
  monitoringFrequency: z.string().optional().default(''),
  lastMonitoredDate: z.date().optional(),
  lastBpReading: z.string().optional().default(''),
  sugarCholesterolChecked: z.string().optional().default(''),
  // Diabetes
  diabetesFirstSignsDate: z.date().optional(),
  diabetesSymptoms: z.string().optional().default(''),
  diabetesConsulted: z.enum(['yes', 'no']).optional(),
  diabetesDiagnosisDate: z.date().optional(),
  diabetesHospitalized: z.string().optional().default(''),
  diabetesTakingInsulin: z.string().optional().default(''),
  diabetesOralTreatment: z.string().optional().default(''),
  diabetesDosageVaried: z.string().optional().default(''),
  diabetesRegularTests: z.string().optional().default(''),
  diabetesLatestBloodSugar: z.string().optional().default(''),
  diabetesDiabeticComa: z.string().optional().default(''),
  diabetesComplications: z.string().optional().default(''),
  diabetesOtherExams: z.string().optional().default(''),
  diabetesOtherConsultations: z.string().optional().default(''),
  // Asthma
  asthmaFirstSignsAge: z.coerce.number().optional(),
  asthmaSymptomDuration: z.string().optional().default(''),
  asthmaSymptomFrequency: z.string().optional().default(''),
  asthmaTrigger: z.string().optional().default(''),
  asthmaLastAttackDate: z.date().optional(),
  asthmaSeverity: z.enum(['Mild', 'Moderate', 'Severe']).optional(),
  asthmaMedication: z.string().optional().default(''),
  asthmaSteroidTherapy: z.string().optional().default(''),
  asthmaHospitalization: z.string().optional().default(''),
  asthmaWorkAbsence: z.string().optional().default(''),
  asthmaFunctionalLimitation: z.string().optional().default(''),
  asthmaChestXRay: z.string().optional().default(''),
  asthmaComplicatingFeatures: z.string().optional().default(''),
  // Digestive Disorders
  digestiveSymptoms: z.string().optional().default(''),
  digestiveSymptomFrequency: z.string().optional().default(''),
  digestiveConditionStartDate: z.date().optional(),
  digestivePreciseDiagnosis: z.string().optional().default(''),
  digestiveMedication: z.string().optional().default(''),
  hadEndoscopy: z.enum(['yes', 'no']).optional(),
  endoscopyDetails: z.string().optional().default(''),
  hadDigestiveSurgery: z.enum(['yes', 'no']).optional(),
  problemsAfterSurgery: z.enum(['yes', 'no']).optional(),
  problemsAfterSurgeryDetails: z.string().optional().default(''),
  isReceivingTreatmentNow: z.enum(['yes', 'no']).optional(),
  treatmentDetails: z.string().optional().default(''),
  dischargeDate: z.date().optional(),
});

const familyMedicalHistoryDetailSchema = z.object({
  condition: z.string().min(1, 'Condition is required.').default(''),
  relation: z.string().min(1, 'Relation is required.').default(''),
  ageOfOccurrence: z.coerce.number().positive('Age must be a positive number.').optional(),
  currentAgeOrAgeAtDeath: z.coerce.number().positive('Age must be a positive number.').optional(),
});

const lifestyleDetailSchema = z.object({
    item: z.string().min(1, "Item selection is required.").default(''),
    details: z.string().optional().default(''),
});


export const newBusinessFormSchema = z
  .object({
    onboardingStatus: z.string().optional().default('Incomplete Policy'),
    // Client Details
    title: z.enum(['Mr', 'Mrs', 'Miss', 'Dr', 'Prof', 'Hon']),
    lifeAssuredFirstName: z.string().min(2, 'First name must be at least 2 characters.').default(''),
    lifeAssuredMiddleName: z.string().optional().default(''),
    lifeAssuredSurname: z.string().min(2, 'Surname must be at least 2 characters.').default(''),
    lifeAssuredDob: z.date({ required_error: 'Date of birth is required.' }),
    placeOfBirth: z.string().min(2, 'Place of birth is required.').default(''),
    email: z.string().email('Invalid email address.').default(''),
    phone: z.string().regex(phoneRegex, phoneError).default(''),
    postalAddress: z.string().min(5, 'Postal address is required.').default(''),
    workTelephone: z.string().regex(phoneRegex, phoneError).optional().or(z.literal('')),
    homeTelephone: z.string().regex(phoneRegex, phoneError).optional().or(z.literal('')),
    residentialAddress: z.string().optional().default(''),
    gpsAddress: z.string().optional().default(''),
    ageNextBirthday: z.coerce.number().optional().default(0),
    maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
    dependents: z.coerce.number().min(0, 'Number of dependents cannot be negative.').default(0),
    gender: z.enum(['Male', 'Female']),
    nationalIdType: z.enum(idTypes),
    idNumber: z.string().min(2, 'ID Number is required.').default(''),
    issueDate: z.date({ required_error: 'Issue date is required.' }),
    expiryDate: z.date().optional(),
    placeOfIssue: z.string().min(2, 'Place of issue is required.').default(''),
    country: z.string().min(2, 'Country is required.').default(''),
    region: z.string().optional().default(''),
    religion: z.enum(['Christian', 'Muslim', 'Traditional', 'Other']),
    nationality: z.string().min(2, 'Nationality is required.').default(''),
    languages: z.string().min(2, 'Languages spoken is required.').default(''),

    // Coverage Details
    contractType: z.enum([
      'Buy Term and Invest in Mutual Fund',
      'The Education Policy',
    ]),
    serial: z.string().optional().default(''),
    policy: z.string().optional().default(''),
    commencementDate: z.date({ required_error: 'A start date is required.' }),
    policyTerm: z.coerce.number().positive('Policy term must be a positive number.').default(0),
    premiumTerm: z.coerce.number().positive('Premium term must be a positive number.').default(0),
    sumAssured: z.coerce
      .number()
      .positive('Sum assured must be a positive number.').default(0),
    premiumAmount: z.coerce
      .number()
      .positive('Premium amount must be a positive number.').default(0),
    paymentFrequency: z.enum(['Monthly', 'Annually', 'Quarterly', 'Bi-Annually']),
    increaseMonth: z.string().min(1, 'Increase month is required.').default(''),

    // Agent Details
    agentName: z.string().optional().default(''),
    agentCode: z.string().optional().default(''),
    uplineName: z.string().optional().default(''),
    uplineCode: z.string().optional().default(''),
    introducerCode: z.string().optional().default(''),

    // Employment Details
    occupation: z.string().min(2, 'Occupation is required.').default(''),
    natureOfBusiness: z.string().min(2, 'Nature of business/work is required.').default(''),
    employer: z.string().min(2, 'Employer is required.').default(''),
    employerAddress: z.string().min(5, 'Employer address is required.').default(''),
    monthlyBasicIncome: z.coerce.number().positive('Monthly basic income must be a positive number.').default(0),
    otherIncome: z.coerce.number().min(0, 'Other income cannot be negative.').default(0),
    totalMonthlyIncome: z.coerce.number().optional().default(0),

    // Payment Details
    isPolicyHolderPayer: z.boolean().default(true),
    premiumPayerSurname: z.string().optional().default(''),
    premiumPayerOtherNames: z.string().optional().default(''),
    premiumPayerOccupation: z.string().optional().default(''),
    premiumPayerRelationship: z.string().optional().default(''),
    premiumPayerResidentialAddress: z.string().optional().default(''),
    premiumPayerPostalAddress: z.string().optional().default(''),
    premiumPayerDob: z.date().optional(),
    premiumPayerBusinessName: z.string().optional().default(''),
    premiumPayerIdType: z.enum(idTypes).optional(),
    premiumPayerIdNumber: z.string().optional().default(''),
    premiumPayerIssueDate: z.date().optional(),
    premiumPayerExpiryDate: z.date().optional(),
    premiumPayerPlaceOfIssue: z.string().optional().default(''),
    bankName: z.string().min(2, 'Bank name is required.').default(''),
    bankBranch: z.string().min(2, 'Bank branch is required.').default(''),
    amountInWords: z.string().min(3, 'Amount in words is required.').default(''),
    sortCode: z.string().min(6, 'Sort code must be at least 6 characters.').default(''),
    accountType: z.enum(['Current', 'Savings', 'Other']),
    bankAccountName: z.string().min(2, 'Bank account name is required.').default(''),
    bankAccountNumber: z.string().min(10, 'Bank account number must be at least 10 digits.').default(''),
    paymentAuthoritySignature: z.string().optional().default(''),
    lifeInsuredSignature: z.string().optional().default(''),
    policyOwnerSignature: z.string().optional().default(''),

    // Beneficiaries
    primaryBeneficiaries: z.array(beneficiarySchema).optional().default([]),
    contingentBeneficiaries: z.array(beneficiarySchema).optional().default([]),
    
    // Existing Policies
    hasExistingPolicies: z.enum(['yes', 'no']).default('no'),
    existingPoliciesDetails: z.array(existingPolicySchema).optional().default([]),
    declinedPolicy: z.enum(['yes', 'no']).default('no'),
    declinedPolicyDetails: z.array(declinedPolicySchema).optional().default([]),
    
    // Health
    height: z.coerce.number().positive('Height must be a positive number.').optional(),
    heightUnit: z.enum(['m', 'cm', 'ft']).default('cm'),
    weight: z.coerce.number().positive('Weight must be a positive number.').optional(),
    bmi: z.coerce.number().optional(),
    alcoholHabits: z.enum(alcoholHabitsOptions).default('never_used'),
    alcoholBeer: alcoholDetailSchema.optional(),
    alcoholWine: alcoholDetailSchema.optional(),
    alcoholSpirits: alcoholDetailSchema.optional(),
    reducedAlcoholMedicalAdvice: reducedAlcoholReasonSchema.optional(),
    reducedAlcoholHealthProblems: reducedAlcoholReasonSchema.optional(),
    tobaccoHabits: z.enum(tobaccoHabitsOptions).default('never_smoked'),
    usedNicotineLast12Months: z.enum(['yes', 'no']).default('no'),
    tobaccoCigarettes: tobaccoDetailSchema.optional(),
    tobaccoCigars: tobaccoDetailSchema.optional(),
    tobaccoPipe: tobaccoDetailSchema.optional(),
    tobaccoNicotineReplacement: tobaccoDetailSchema.optional(),
    tobaccoEcigarettes: tobaccoDetailSchema.optional(),
    tobaccoOther: tobaccoDetailSchema.optional(),
    usedRecreationalDrugs: z.enum(['yes', 'no']).default('no'),
    injectedNonPrescribedDrugs: z.enum(['yes', 'no']).default('no'),
    testedPositiveViralInfection: z.enum(['yes', 'no']).default('no'),
    testedPositiveFor: viralInfectionDetailSchema.optional(),
    awaitingResultsFor: viralInfectionDetailSchema.optional(),

    // Medical History
    bloodTransfusionOrSurgery: z.enum(['yes', 'no']).default('no'),
    bloodTransfusionOrSurgeryDetails: z.array(illnessDetailSchema).optional().default([]),
    highBloodPressure: z.enum(['yes', 'no']).default('no'),
    highBloodPressureDetails: z.array(illnessDetailSchema).optional().default([]),
    cancer: z.enum(['yes', 'no']).default('no'),
    cancerDetails: z.array(illnessDetailSchema).optional().default([]),
    diabetes: z.enum(['yes', 'no']).default('no'),
    diabetesDetails: z.array(illnessDetailSchema).optional().default([]),
    colitisCrohns: z.enum(['yes', 'no']).default('no'),
    colitisCrohnsDetails: z.array(illnessDetailSchema).optional().default([]),
    paralysisEpilepsy: z.enum(['yes', 'no']).default('no'),
    paralysisEpilepsyDetails: z.array(illnessDetailSchema).optional().default([]),
    mentalIllness: z.enum(['yes', 'no']).default('no'),
    mentalIllnessDetails: z.array(illnessDetailSchema).optional().default([]),
    arthritis: z.enum(['yes', 'no']).default('no'),
    arthritisDetails: z.array(illnessDetailSchema).optional().default([]),
    chestPain: z.enum(['yes', 'no']).default('no'),
    chestPainDetails: z.array(illnessDetailSchema).optional().default([]),
    asthma: z.enum(['yes', 'no']).default('no'),
    asthmaDetails: z.array(illnessDetailSchema).optional().default([]),
    digestiveDisorder: z.enum(['yes', 'no']).default('no'),
    digestiveDisorderDetails: z.array(illnessDetailSchema).optional().default([]),
    bloodDisorder: z.enum(['yes', 'no']).default('no'),
    bloodDisorderDetails: z.array(illnessDetailSchema).optional().default([]),
    thyroidDisorder: z.enum(['yes', 'no']).default('no'),
    thyroidDisorderDetails: z.array(illnessDetailSchema).optional().default([]),
    kidneyDisorder: z.enum(['yes', 'no']).default('no'),
    kidneyDisorderDetails: z.array(illnessDetailSchema).optional().default([]),
    numbness: z.enum(['yes', 'no']).default('no'),
    numbnessDetails: z.array(illnessDetailSchema).optional().default([]),
    anxietyStress: z.enum(['yes', 'no']).default('no'),
    anxietyStressDetails: z.array(illnessDetailSchema).optional().default([]),
    earEyeDisorder: z.enum(['yes', 'no']).default('no'),
    earEyeDisorderDetails: z.array(illnessDetailSchema).optional().default([]),
    lumpGrowth: z.enum(['yes', 'no']).default('no'),
    lumpGrowthDetails: z.array(illnessDetailSchema).optional().default([]),
    hospitalAttendance: z.enum(['yes', 'no']).default('no'),
    hospitalAttendanceDetails: z.array(illnessDetailSchema).optional().default([]),
    criticalIllness: z.enum(['yes', 'no']).default('no'),
    criticalIllnessDetails: z.array(illnessDetailSchema).optional().default([]),
    sti: z.enum(['yes', 'no']).default('no'),
    stiDetails: z.array(illnessDetailSchema).optional().default([]),
    presentSymptoms: z.enum(['yes', 'no']).default('no'),
    presentSymptomsDetails: z.array(illnessDetailSchema).optional().default([]),
    presentWaitingConsultation: z.enum(['yes', 'no']).optional(),
    presentTakingMedication: z.enum(['yes', 'no']).optional(),
    familyMedicalHistory: z.enum(['yes', 'no']).default('no'),
    familyMedicalHistoryDetails: z.array(familyMedicalHistoryDetailSchema).optional().default([]),

    // Doctor's Details
    currentDoctorName: z.string().optional().default(''),
    currentDoctorPhone: z.string().regex(phoneRegex, phoneError).optional().or(z.literal('')),
    currentDoctorHospital: z.string().optional().default(''),
    previousDoctorName: z.string().optional().default(''),
    previousDoctorPhone: z.string().regex(phoneRegex, phoneError).optional().or(z.literal('')),
    previousDoctorHospital: z.string().optional().default(''),

    // Lifestyle
    flownAsPilot: z.enum(['yes', 'no']).default('no'),
    flownAsPilotDetails: z.array(lifestyleDetailSchema).optional().default([]),
    hazardousSports: z.enum(['yes', 'no']).default('no'),
    hazardousSportsDetails: z.array(lifestyleDetailSchema).optional().default([]),
    travelOutsideCountry: z.enum(['yes', 'no']).default('no'),
    travelOutsideCountryDetails: z.array(lifestyleDetailSchema).optional().default([]),
    
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


export type TabName =
  | 'coverage'
  | 'beneficiaries'
  | 'existing-policies'
  | 'health'
  | 'lifestyle'
  | 'payment-details'
  | 'agent'
  | 'declaration';

export const tabFields: Record<TabName, (keyof z.infer<typeof newBusinessFormSchema>)[]> = {
  coverage: ['lifeAssuredFirstName', 'lifeAssuredSurname', 'lifeAssuredDob', 'email', 'phone', 'postalAddress', 'idNumber', 'contractType', 'sumAssured', 'premiumAmount'],
  beneficiaries: ['primaryBeneficiaries'],
  'existing-policies': ['hasExistingPolicies', 'declinedPolicy'],
  health: ['height', 'weight', 'alcoholHabits', 'tobaccoHabits', 'usedRecreationalDrugs', 'injectedNonPrescribedDrugs', 'testedPositiveViralInfection'],
  lifestyle: ['flownAsPilot', 'hazardousSports', 'travelOutsideCountry'],
  'payment-details': ['bankName', 'bankBranch', 'sortCode', 'accountType', 'bankAccountName', 'bankAccountNumber'],
  agent: ['agentName', 'agentCode'],
  declaration: ['lifeInsuredSignature', 'policyOwnerSignature'],
};

    
