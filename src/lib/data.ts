
export type Beneficiary = {
  name: string;
  dob: string; // Storing as string in data, will be Date object in form
  gender: 'Male' | 'Female';
  relationship: string;
  telephone?: string;
  percentage: number;
  isIrrevocable?: boolean;
};

export type Role = {
  id: number;
  name: string;
  permissions: string[];
};

export type StaffMember = {
    id: number;
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    department: string;
};

export type OnboardingStatus =
  | 'Pending First Premium'
  | 'First Premium Confirmed'
  | 'Pending Vetting'
  | 'Vetting Completed'
  | 'Rework Required'
  | 'Pending Medicals'
  | 'Medicals Completed'
  | 'Pending Decision'
  | 'Accepted'
  | 'Pending Mandate'
  | 'Mandate Verified'
  | 'Policy Issued'
  | 'Mandate Rework Required'
  | 'Declined'
  | 'NTU'
  | 'Deferred';

export type BillingStatus = 'Outstanding' | 'Up to Date' | 'First Premium Paid';
export type PolicyStatus = 'Active' | 'Inactive' | 'In Force' | 'Lapsed' | 'Cancelled';

export type MedicalUnderwritingState = {
    started: boolean;
    startDate?: string;
    completed: boolean;
};

export type Bill = {
  id: number;
  policyId: number;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid';
  paymentId?: number;
  description: string;
};

export type Payment = {
  id: number;
  policyId: number;
  billId: number;
  amount: number;
  paymentDate: string;
  method: string;
  transactionId: string;
};

export type ActivityLog = {
  date: string;
  user: string;
  action: string;
  details?: string;
};

export type IllnessDetail = {
    illness: string;
    date: string;
    hospital?: string;
    duration?: string;
    status?: string;
    // High Blood Pressure
    diagnosisDate?: string;
    bpReadingAtDiagnosis?: string;
    causeOfHighBp?: string;
    prescribedTreatment?: string;
    complications?: string;
    monitoringFrequency?: string;
    lastMonitoredDate?: string;
    lastBpReading?: string;
    sugarCholesterolChecked?: string;
    // Diabetes
    diabetesFirstSignsDate?: string;
    diabetesSymptoms?: string;
    diabetesConsulted?: 'yes' | 'no';
    diabetesDiagnosisDate?: string;
    diabetesHospitalized?: string;
    diabetesTakingInsulin?: string;
    diabetesOralTreatment?: string;
    diabetesDosageVaried?: string;
    diabetesRegularTests?: string;
    diabetesLatestBloodSugar?: string;
    diabetesDiabeticComa?: string;
    diabetesComplications?: string;
    diabetesOtherExams?: string;
    diabetesOtherConsultations?: string;
    // Asthma
    asthmaFirstSignsAge?: number;
    asthmaSymptomDuration?: string;
    asthmaSymptomFrequency?: string;
    asthmaTrigger?: string;
    asthmaLastAttackDate?: string;
    asthmaSeverity?: 'Mild' | 'Moderate' | 'Severe';
    asthmaMedication?: string;
    asthmaSteroidTherapy?: string;
    asthmaHospitalization?: string;
    asthmaWorkAbsence?: string;
    asthmaFunctionalLimitation?: string;
    asthmaChestXRay?: string;
    asthmaComplicatingFeatures?: string;
    // Digestive Disorders
    digestiveSymptoms?: string;
    digestiveSymptomFrequency?: string;
    digestiveConditionStartDate?: string;
    digestivePreciseDiagnosis?: string;
    digestiveMedication?: string;
    hadEndoscopy?: 'yes' | 'no';
    endoscopyDetails?: string;
    hadDigestiveSurgery?: 'yes' | 'no';
    problemsAfterSurgery?: 'yes' | 'no';
    problemsAfterSurgeryDetails?: string;
    isReceivingTreatmentNow?: 'yes' | 'no';
    treatmentDetails?: string;
    dischargeDate?: string;
}

export type FamilyMedicalHistoryDetail = {
    condition: string;
    relation: string;
    ageOfOccurrence?: number;
    currentAgeOrAgeAtDeath?: number;
};

export type LifestyleDetail = {
    item: string;
    details?: string;
}

export type ExistingPolicyDetail = {
    companyName: string;
    personCovered: string;
    policyType: string;
    issueDate: string;
    premiumAmount: number;
    faceAmount: number;
    changedGrpOrInd: 'yes' | 'no';
};

export type DeclinedPolicyDetail = {
    companyName: string;
    details: string;
};

export type AlcoholDetail = {
    consumed: boolean;
    averagePerWeek?: string;
    notes?: string;
};

export type ReducedAlcoholReason = {
    reduced: 'yes' | 'no';
    notes?: string;
};


export type NewBusiness = {
  id: string;
  client: string;
  // Personal Details
  lifeAssuredDob: string;
  placeOfBirth: string;
  ageNextBirthday: number;
  gender: 'Male' | 'Female';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  dependents: number;
  nationality: string;
  country: string;
  religion: string;
  languages: string;
  // Contact Details
  email: string;
  phone: string;
  workTelephone?: string;
  homeTelephone?: string;
  postalAddress: string;
  residentialAddress?: string;
  gpsAddress?: string;
  // Identification
  nationalIdType: string;
  idNumber: string;
  placeOfIssue: string;
  issueDate: string;
  expiryDateId: string; // Renamed to avoid conflict
  // Policy Details
  policy: string;
  product: string;
  premium: number;
  initialSumAssured?: number;
  sumAssured: number;
  commencementDate: string;
  expiryDate: string;
  policyTerm: number;
  premiumTerm: number;
  serial: string;
  paymentFrequency: string;
  // Onboarding/Status
  onboardingStatus: OnboardingStatus;
  billingStatus: BillingStatus;
  policyStatus: PolicyStatus;
  vettingNotes?: string;
  mandateReworkNotes?: string;
  mandateVerificationTimestamp?: string;
  // Employment
  occupation: string;
  natureOfBusiness: string;
  employer: string;
  employerAddress: string;
  monthlyBasicIncome: number;
  otherIncome: number;
  totalMonthlyIncome: number;
  // Payment
  payerName: string;
  bankName: string;
  bankBranch: string;
  bankAccountNumber: string;
  sortCode: string;
  narration: string;
  accountType: 'Current' | 'Savings' | 'Other';
  bankAccountName: string;
  amountInWords: string;
  paymentAuthoritySignature?: string;
  // Beneficiaries
  primaryBeneficiaries: Beneficiary[];
  contingentBeneficiaries: Beneficiary[];
  // Existing & Declined Policies
  existingPoliciesDetails: ExistingPolicyDetail[];
  declinedPolicyDetails: DeclinedPolicyDetail[];
  // Health
  height?: number;
  heightUnit?: 'm' | 'cm' | 'ft';
  weight?: number;
  bmi?: number;
  alcoholHabits: 'never_used' | 'occasional_socially' | 'ex_drinker_over_5_years' | 'ex_drinker_1_to_5_years' | 'ex_drinker_within_1_year' | 'current_regular_drinker';
  alcoholBeer?: AlcoholDetail;
  alcoholWine?: AlcoholDetail;
  alcoholSpirits?: AlcoholDetail;
  reducedAlcoholMedicalAdvice?: ReducedAlcoholReason;
  reducedAlcoholHealthProblems?: ReducedAlcoholReason;
  tobaccoHabits: 'never_smoked' | 'ex_smoker_over_5_years' | 'ex_smoker_1_to_5_years' | 'ex_smoker_within_1_year' | 'smoke_occasionally_socially' | 'current_regular_smoker';
  medicalHistory: IllnessDetail[];
  familyMedicalHistory: 'yes' | 'no';
  familyMedicalHistoryDetails: FamilyMedicalHistoryDetail[];
  lifestyleDetails: LifestyleDetail[];
  // System Internals
  mandateVerified: boolean;
  firstPremiumPaid: boolean;
  medicalUnderwritingState: MedicalUnderwritingState;
  bills: Bill[];
  payments: Payment[];
  activityLog: ActivityLog[];
};
