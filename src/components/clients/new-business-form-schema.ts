
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
    name: z.string().default(''),
    dob: z.date({ required_error: 'Date of birth is required.' }),
    gender: z.enum(['Male', 'Female']).default('Male'),
    relationship: z.string().default(''),
    telephone: z.string().regex(phoneRegex, phoneError).optional().or(z.literal('')).default(''),
    percentage: z.coerce.number().min(0).max(100, "Percentage must be between 0 and 100.").default(100),
    isIrrevocable: z.boolean().optional().default(false),
});

const existingPolicySchema = z.object({
  companyName: z.string().default(''),
  personCovered: z.string().default(''),
  policyType: z.string().default(''),
  issueDate: z.date({ required_error: 'Issue date is required.' }),
  premiumAmount: z.coerce.number().default(0),
  faceAmount: z.coerce.number().default(0),
  changedGrpOrInd: z.enum(['yes', 'no']).default('no'),
});

const declinedPolicySchema = z.object({
    companyName: z.string().default(''),
    details: z.string().default(''),
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
    reduced: z.enum(['yes', 'no']).optional().default('no'),
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
  date: z.date({ required_error: 'Date is required.' }),
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
    workTelephone: z.string().regex(phoneRegex, phoneError).optional().or(z.literal('')).default(''),
    homeTelephone: z.string().regex(phoneRegex, phoneError).optional().or(z.literal('')).default(''),
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
    country: z.string().min(2, 'Country is required.').default('Ghana'),
    region: z.string().optional().default(''),
    religion: z.enum(['Christian', 'Muslim', 'Traditional', 'Other']),
    nationality: z.string().min(2, 'Nationality is required.').default('Ghanaian'),
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
    increaseMonth: z.string().default(''),

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
    hasExistingPolicies: z.enum(['yes', 'no']).optional().default('no'),
    existingPoliciesDetails: z.array(existingPolicySchema).optional().default([]),
    declinedPolicy: z.enum(['yes', 'no']).optional().default('no'),
    declinedPolicyDetails: z.array(declinedPolicySchema).optional().default([]),
    
    // Health
    height: z.coerce.number().positive('Height must be a positive number.').optional(),
    heightUnit: z.enum(['m', 'cm', 'ft']).default('cm'),
    weight: z.coerce.number().positive('Weight must be a positive number.').optional(),
    bmi: z.coerce.number().optional(),
    alcoholHabits: z.enum(alcoholHabitsOptions).optional().default('never_used'),
    alcoholBeer: alcoholDetailSchema.optional(),
    alcoholWine: alcoholDetailSchema.optional(),
    alcoholSpirits: alcoholDetailSchema.optional(),
    reducedAlcoholMedicalAdvice: reducedAlcoholReasonSchema.optional(),
    reducedAlcoholHealthProblems: reducedAlcoholReasonSchema.optional(),
    tobaccoHabits: z.enum(tobaccoHabitsOptions).optional().default('never_smoked'),
    usedNicotineLast12Months: z.enum(['yes', 'no']).optional().default('no'),
    tobaccoCigarettes: tobaccoDetailSchema.optional(),
    tobaccoCigars: tobaccoDetailSchema.optional(),
    tobaccoPipe: tobaccoDetailSchema.optional(),
    tobaccoNicotineReplacement: tobaccoDetailSchema.optional(),
    tobaccoEcigarettes: tobaccoDetailSchema.optional(),
    tobaccoOther: tobaccoDetailSchema.optional(),
    usedRecreationalDrugs: z.enum(['yes', 'no']).optional().default('no'),
    injectedNonPrescribedDrugs: z.enum(['yes', 'no']).optional().default('no'),
    testedPositiveViralInfection: z.enum(['yes', 'no']).optional().default('no'),
    testedPositiveFor: viralInfectionDetailSchema.optional(),
    awaitingResultsFor: viralInfectionDetailSchema.optional(),

    // Medical History
    bloodTransfusionOrSurgery: z.enum(['yes', 'no']).optional().default('no'),
    bloodTransfusionOrSurgeryDetails: z.array(illnessDetailSchema).optional().default([]),
    highBloodPressure: z.enum(['yes', 'no']).optional().default('no'),
    highBloodPressureDetails: z.array(illnessDetailSchema).optional().default([]),
    cancer: z.enum(['yes', 'no']).optional().default('no'),
    cancerDetails: z.array(illnessDetailSchema).optional().default([]),
    diabetes: z.enum(['yes', 'no']).optional().default('no'),
    diabetesDetails: z.array(illnessDetailSchema).optional().default([]),
    colitisCrohns: z.enum(['yes', 'no']).optional().default('no'),
    colitisCrohnsDetails: z.array(illnessDetailSchema).optional().default([]),
    paralysisEpilepsy: z.enum(['yes', 'no']).optional().default('no'),
    paralysisEpilepsyDetails: z.array(illnessDetailSchema).optional().default([]),
    mentalIllness: z.enum(['yes', 'no']).optional().default('no'),
    mentalIllnessDetails: z.array(illnessDetailSchema).optional().default([]),
    arthritis: z.enum(['yes', 'no']).optional().default('no'),
    arthritisDetails: z.array(illnessDetailSchema).optional().default([]),
    chestPain: z.enum(['yes', 'no']).optional().default('no'),
    chestPainDetails: z.array(illnessDetailSchema).optional().default([]),
    asthma: z.enum(['yes', 'no']).optional().default('no'),
    asthmaDetails: z.array(illnessDetailSchema).optional().default([]),
    digestiveDisorder: z.enum(['yes', 'no']).optional().default('no'),
    digestiveDisorderDetails: z.array(illnessDetailSchema).optional().default([]),
    bloodDisorder: z.enum(['yes', 'no']).optional().default('no'),
    bloodDisorderDetails: z.array(illnessDetailSchema).optional().default([]),
    thyroidDisorder: z.enum(['yes', 'no']).optional().default('no'),
    thyroidDisorderDetails: z.array(illnessDetailSchema).optional().default([]),
    kidneyDisorder: z.enum(['yes', 'no']).optional().default('no'),
    kidneyDisorderDetails: z.array(illnessDetailSchema).optional().default([]),
    numbness: z.enum(['yes', 'no']).optional().default('no'),
    numbnessDetails: z.array(illnessDetailSchema).optional().default([]),
    anxietyStress: z.enum(['yes', 'no']).optional().default('no'),
    anxietyStressDetails: z.array(illnessDetailSchema).optional().default([]),
    earEyeDisorder: z.enum(['yes', 'no']).optional().default('no'),
    earEyeDisorderDetails: z.array(illnessDetailSchema).optional().default([]),
    lumpGrowth: z.enum(['yes', 'no']).optional().default('no'),
    lumpGrowthDetails: z.array(illnessDetailSchema).optional().default([]),
    hospitalAttendance: z.enum(['yes', 'no']).optional().default('no'),
    hospitalAttendanceDetails: z.array(illnessDetailSchema).optional().default([]),
    criticalIllness: z.enum(['yes', 'no']).optional().default('no'),
    criticalIllnessDetails: z.array(illnessDetailSchema).optional().default([]),
    sti: z.enum(['yes', 'no']).optional().default('no'),
    stiDetails: z.array(illnessDetailSchema).optional().default([]),
    presentSymptoms: z.enum(['yes', 'no']).optional().default('no'),
    presentSymptomsDetails: z.array(illnessDetailSchema).optional().default([]),
    presentWaitingConsultation: z.enum(['yes', 'no']).optional(),
    presentTakingMedication: z.enum(['yes', 'no']).optional(),
    familyMedicalHistory: z.enum(['yes', 'no']).optional().default('no'),
    familyMedicalHistoryDetails: z.array(familyMedicalHistoryDetailSchema).optional().default([]),

    // Doctor's Details
    currentDoctorName: z.string().optional().default(''),
    currentDoctorPhone: z.string().regex(phoneRegex, phoneError).optional().or(z.literal('')).default(''),
    currentDoctorHospital: z.string().optional().default(''),
    previousDoctorName: z.string().optional().default(''),
    previousDoctorPhone: z.string().regex(phoneRegex, phoneError).optional().or(z.literal('')).default(''),
    previousDoctorHospital: z.string().optional().default(''),

    // Lifestyle
    flownAsPilot: z.enum(['yes', 'no']).optional().default('no'),
    flownAsPilotDetails: z.array(lifestyleDetailSchema).optional().default([]),
    hazardousSports: z.enum(['yes', 'no']).optional().default('no'),
    hazardousSportsDetails: z.array(lifestyleDetailSchema).optional().default([]),
    travelOutsideCountry: z.enum(['yes', 'no']).optional().default('no'),
    travelOutsideCountryDetails: z.array(lifestyleDetailSchema).optional().default([]),
    
  })
  .superRefine((data, ctx) => {
    // Helper function to add issue
    const addIssue = (path: (string | number)[], message: string) => {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });
    };

    // Conditional validation for Premium Payer
    if (!data.isPolicyHolderPayer) {
        if (!data.premiumPayerOtherNames) addIssue(['premiumPayerOtherNames'], "Payer's first name is required.");
        if (!data.premiumPayerSurname) addIssue(['premiumPayerSurname'], "Payer's surname is required.");
        if (!data.premiumPayerIdType) addIssue(['premiumPayerIdType'], "Payer's ID type is required.");
        if (!data.premiumPayerIdNumber) addIssue(['premiumPayerIdNumber'], "Payer's ID number is required.");
    }
    
    // Conditional validation for Alcohol Consumption
    if (data.alcoholHabits === 'current_regular_drinker' || data.alcoholHabits === 'occasional_socially') {
        if (!data.alcoholBeer?.consumed && !data.alcoholWine?.consumed && !data.alcoholSpirits?.consumed) {
            addIssue(['alcoholHabits'], 'Please specify at least one type of alcohol consumed.');
        }
    }

    // Conditional validation for Tobacco/Nicotine Usage
    if (data.usedNicotineLast12Months === 'yes') {
        if (!data.tobaccoCigarettes?.smoked && !data.tobaccoCigars?.smoked && !data.tobaccoPipe?.smoked && !data.tobaccoNicotineReplacement?.smoked && !data.tobaccoEcigarettes?.smoked && !data.tobaccoOther?.smoked) {
             addIssue(['usedNicotineLast12Months'], 'Please specify which tobacco/nicotine products have been used.');
        }
    }

    // Conditional validation for Viral Co-infections
    if (data.testedPositiveViralInfection === 'yes') {
        const testedPositive = data.testedPositiveFor;
        const awaitingResults = data.awaitingResultsFor;
        if (
            (!testedPositive || (!testedPositive.hiv && !testedPositive.hepB && !testedPositive.hepC)) &&
            (!awaitingResults || (!awaitingResults.hiv && !awaitingResults.hepB && !awaitingResults.hepC))
        ) {
            addIssue(['testedPositiveViralInfection'], 'Please specify the infection details.');
        }
    }

    // Conditional validation for medical history questions
    const medicalChecks = [
        { flag: data.bloodTransfusionOrSurgery, details: data.bloodTransfusionOrSurgeryDetails, path: 'bloodTransfusionOrSurgery' },
        { flag: data.highBloodPressure, details: data.highBloodPressureDetails, path: 'highBloodPressure' },
        { flag: data.cancer, details: data.cancerDetails, path: 'cancer' },
        { flag: data.diabetes, details: data.diabetesDetails, path: 'diabetes' },
        { flag: data.colitisCrohns, details: data.colitisCrohnsDetails, path: 'colitisCrohns' },
        { flag: data.paralysisEpilepsy, details: data.paralysisEpilepsyDetails, path: 'paralysisEpilepsy' },
        { flag: data.mentalIllness, details: data.mentalIllnessDetails, path: 'mentalIllness' },
        { flag: data.arthritis, details: data.arthritisDetails, path: 'arthritis' },
        { flag: data.chestPain, details: data.chestPainDetails, path: 'chestPain' },
        { flag: data.asthma, details: data.asthmaDetails, path: 'asthma' },
        { flag: data.digestiveDisorder, details: data.digestiveDisorderDetails, path: 'digestiveDisorder' },
        { flag: data.bloodDisorder, details: data.bloodDisorderDetails, path: 'bloodDisorder' },
        { flag: data.thyroidDisorder, details: data.thyroidDisorderDetails, path: 'thyroidDisorder' },
        { flag: data.kidneyDisorder, details: data.kidneyDisorderDetails, path: 'kidneyDisorder' },
        { flag: data.numbness, details: data.numbnessDetails, path: 'numbness' },
        { flag: data.anxietyStress, details: data.anxietyStressDetails, path: 'anxietyStress' },
        { flag: data.earEyeDisorder, details: data.earEyeDisorderDetails, path: 'earEyeDisorder' },
        { flag: data.lumpGrowth, details: data.lumpGrowthDetails, path: 'lumpGrowth' },
        { flag: data.hospitalAttendance, details: data.hospitalAttendanceDetails, path: 'hospitalAttendance' },
        { flag: data.criticalIllness, details: data.criticalIllnessDetails, path: 'criticalIllness' },
        { flag: data.sti, details: data.stiDetails, path: 'sti' },
        { flag: data.presentSymptoms, details: data.presentSymptomsDetails, path: 'presentSymptoms' },
        { flag: data.familyMedicalHistory, details: data.familyMedicalHistoryDetails, path: 'familyMedicalHistory' },
        { flag: data.hasExistingPolicies, details: data.existingPoliciesDetails, path: 'hasExistingPolicies' },
        { flag: data.declinedPolicy, details: data.declinedPolicyDetails, path: 'declinedPolicy' },
        { flag: data.flownAsPilot, details: data.flownAsPilotDetails, path: 'flownAsPilot' },
        { flag: data.hazardousSports, details: data.hazardousSportsDetails, path: 'hazardousSports' },
        { flag: data.travelOutsideCountry, details: data.travelOutsideCountryDetails, path: 'travelOutsideCountry' },
    ];

    medicalChecks.forEach(check => {
        if (check.flag === 'yes' && (!check.details || check.details.length === 0)) {
            addIssue([check.path], 'Please provide details for the selected condition.');
        }
    });
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
  coverage: ['title', 'lifeAssuredFirstName', 'lifeAssuredSurname', 'lifeAssuredDob', 'placeOfBirth', 'email', 'phone', 'postalAddress', 'nationalIdType', 'idNumber', 'issueDate', 'placeOfIssue', 'country', 'nationality', 'languages', 'maritalStatus', 'gender', 'religion', 'contractType', 'policyTerm', 'premiumTerm', 'sumAssured', 'premiumAmount', 'paymentFrequency', 'occupation', 'natureOfBusiness', 'employer', 'employerAddress', 'monthlyBasicIncome'],
  beneficiaries: ['primaryBeneficiaries', 'contingentBeneficiaries'],
  'existing-policies': ['hasExistingPolicies', 'declinedPolicy'],
  health: ['height', 'weight', 'alcoholHabits', 'usedNicotineLast12Months', 'tobaccoHabits', 'usedRecreationalDrugs', 'injectedNonPrescribedDrugs', 'testedPositiveViralInfection', 'bloodTransfusionOrSurgery', 'highBloodPressure', 'cancer', 'diabetes', 'colitisCrohns', 'paralysisEpilepsy', 'mentalIllness', 'arthritis', 'chestPain', 'asthma', 'digestiveDisorder', 'bloodDisorder', 'thyroidDisorder', 'kidneyDisorder', 'numbness', 'anxietyStress', 'earEyeDisorder', 'lumpGrowth', 'hospitalAttendance', 'criticalIllness', 'sti', 'presentSymptoms', 'familyMedicalHistory'],
  lifestyle: ['flownAsPilot', 'hazardousSports', 'travelOutsideCountry'],
  'payment-details': ['isPolicyHolderPayer', 'bankName', 'bankBranch', 'sortCode', 'accountType', 'bankAccountName', 'bankAccountNumber', 'amountInWords', 'premiumPayerOtherNames', 'premiumPayerSurname', 'premiumPayerIdType', 'premiumPayerIdNumber'],
  agent: ['agentName', 'agentCode'],
  declaration: ['lifeInsuredSignature', 'policyOwnerSignature'],
};
