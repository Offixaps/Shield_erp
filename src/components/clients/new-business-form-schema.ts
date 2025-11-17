
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

