









export type Beneficiary = {
  name: string;
  dob: string; // Storing as string in data, will be Date object in form
  gender: 'Male' | 'Female';
  relationship: string;
  telephone?: string;
  percentage: number;
  isIrrevocable?: boolean;
};

export const dashboardStats = {
  totalClients: 1256,
  premiumsCollected: 450320,
  activeClients: 1100,
  inactiveClients: 156,
  newBusiness: 75000,
  outstandingPremiums: 25890,
};

export const premiumsChartData = [
  { month: "Jan", collected: 42000, outstanding: 2400 },
  { month: "Feb", collected: 30000, outstanding: 1398 },
  { month: "Mar", collected: 38000, outstanding: 4800 },
  { month: "Apr", collected: 27800, outstanding: 3908 },
  { month: "May", collected: 48900, outstanding: 4800 },
  { month: "Jun", collected: 33900, outstanding: 3800 },
  { month: "Jul", collected: 44900, outstanding: 4300 },
];

export const policyDistributionData = [
    { name: "Auto Insurance", value: 400, fill: "var(--color-chart-1)" },
    { name: "Health Insurance", value: 300, fill: "var(--color-chart-2)" },
    { name: "Life Insurance", value: 300, fill: "var(--color-chart-3)" },
    { name: "Home Insurance", value: 200, fill: "var(--color-chart-4)" },
];

export const recentActivityData = [
    { id: 1, client: "John Doe", policy: "T1166017", amount: 150.00, status: "Paid" },
    { id: 2, client: "Jane Smith", policy: "E1274718", amount: 220.50, status: "Pending" },
    { id: 3, client: "Acme Corp", policy: "T1166018", amount: 1200.00, status: "Paid" },
    { id: 4, client: "Mike Johnson", policy: "E1274719", amount: 85.75, status: "Overdue" },
    { id: 5, client: "Emily White", policy: "T1166019", amount: 300.00, status: "Paid" },
];

export type Role = {
  id: number;
  name: string;
  permissions: string[];
};

export const rolesData: Role[] = [
  { id: 1, name: "Administrator", permissions: ["General.Staff Management.view", "General.Staff Management.create", "General.Staff Management.edit", "General.Staff Management.delete", "General.Role Management.view", "General.Role Management.create", "General.Role Management.edit", "General.Role Management.delete"] },
  { id: 2, name: "Sales Agent", permissions: ["Business Development.Sales.view", "Business Development.Sales.create", "Business Development.Clients.view", "Business Development.Clients.create"] },
  { id: 3, name: "Underwriter", permissions: ["Underwriting.New Business.view", "Underwriting.Mandates.view", "Underwriting.Mandates.edit"] },
  { id: 4, name: "Premium Administrator", permissions: ["Premium Administration.New Business.view", "Premium Administration.Premium Collection.view"] },
  { id: 5, name: "Claims Officer", permissions: ["Business Development.Claims.view"] },
  { id: 6, name: "Business Development Manager", permissions: ["Business Development.Sales.view", "Business Development.Clients.view", "Business Development.Reports.view"] },
];

export type StaffMember = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
};

export const staffData: StaffMember[] = [
    { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@shield.com', phone: '0200000001', role: 'Administrator' },
    { id: 2, firstName: 'John', lastName: 'Doe', email: 'john.doe@shield.com', phone: '0200000002', role: 'Sales Agent' },
    { id: 3, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@shield.com', phone: '0200000003', role: 'Underwriter' },
    { id: 4, firstName: 'Peter', lastName: 'Jones', email: 'peter.jones@shield.com', phone: '0200000004', role: 'Premium Administrator' },
];

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
};

export type ReducedAlcoholReason = {
    reduced: 'yes' | 'no';
    notes?: string;
};


export type NewBusiness = {
  id: number;
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


const initialActivity: ActivityLog[] = [
    {
        date: new Date().toISOString(),
        user: 'Sales Agent',
        action: 'Policy Created',
        details: 'Initial policy creation.'
    },
    {
        date: new Date().toISOString(),
        user: 'System',
        action: 'Status changed to Pending First Premium'
    }
];


export const newBusinessData: NewBusiness[] = [
  {
    id: 1,
    client: "Mr Kofi Mensah",
    lifeAssuredDob: "1984-05-20",
    placeOfBirth: "Accra",
    ageNextBirthday: 41,
    gender: "Male",
    maritalStatus: "Married",
    dependents: 2,
    nationality: "Ghanaian",
    country: "Ghana",
    religion: "Christian",
    languages: "English, Twi",
    email: "kofi.mensah@example.com",
    phone: "0244123456",
    postalAddress: "P.O. Box 123, Accra",
    nationalIdType: "Ghana Card",
    idNumber: "GHA-123456789-0",
    placeOfIssue: "NIA, Accra",
    issueDate: "2020-01-15",
    expiryDateId: "2030-01-14",
    policy: "",
    product: "The Education Policy",
    premium: 350,
    initialSumAssured: 150000,
    sumAssured: 150000,
    commencementDate: "2024-07-28",
    expiryDate: "2059-07-28",
    policyTerm: 35,
    premiumTerm: 25,
    serial: "1001",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 1, amount: 350, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Ama Mensah", dob: "1990-05-20", gender: "Female", relationship: "Spouse", telephone: "0244123457", percentage: 100, isIrrevocable: true }],
    contingentBeneficiaries: [],
    bankName: "GCB Bank PLC",
    bankBranch: "Accra Main",
    payerName: "Kofi Mensah",
    bankAccountNumber: "1234567890123",
    sortCode: "040101",
    narration: "JULY 2024 PREMIUM",
    accountType: "Savings",
    bankAccountName: "Kofi Mensah",
    amountInWords: "Three Hundred and Fifty Ghana Cedis",
    height: 180,
    heightUnit: "cm",
    weight: 85,
    bmi: 26.2,
    alcoholHabits: 'occasional_socially',
    alcoholBeer: { consumed: true, averagePerWeek: '2 bottles' },
    alcoholWine: { consumed: false },
    alcoholSpirits: { consumed: false },
    reducedAlcoholMedicalAdvice: { reduced: 'no' },
    reducedAlcoholHealthProblems: { reduced: 'no' },
    tobaccoHabits: 'never_smoked',
    medicalHistory: [],
    familyMedicalHistory: 'no',
    familyMedicalHistoryDetails: [],
    lifestyleDetails: [],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Accountant",
    natureOfBusiness: "Finance",
    employer: "Deloitte Ghana",
    employerAddress: "12 Airport City, Accra",
    monthlyBasicIncome: 5000,
    otherIncome: 500,
    totalMonthlyIncome: 5500,
  },
  {
    id: 2,
    client: "Mrs Adwoa Williams",
    lifeAssuredDob: "1982-11-10",
    placeOfBirth: "Kumasi",
    ageNextBirthday: 42,
    gender: "Female",
    maritalStatus: "Married",
    dependents: 3,
    nationality: "Ghanaian",
    country: "Ghana",
    religion: "Christian",
    languages: "English, Twi",
    email: "adwoa.williams@example.com",
    phone: "0208123456",
    postalAddress: "P.O. Box 456, Kumasi",
    nationalIdType: "Ghana Card",
    idNumber: "GHA-987654321-1",
    placeOfIssue: "NIA, Kumasi",
    issueDate: "2021-03-20",
    expiryDateId: "2031-03-19",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 500,
    initialSumAssured: 250000,
    sumAssured: 250000,
    commencementDate: "2024-07-28",
    expiryDate: "2054-07-28",
    policyTerm: 30,
    premiumTerm: 20,
    serial: "1002",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 2, amount: 500, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "David Williams", dob: "1982-11-10", gender: "Male", relationship: "Spouse", telephone: "0208123457", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Absa Bank Ghana Limited",
    bankBranch: "KNUST Branch",
    payerName: "Adwoa Williams",
    bankAccountNumber: "9876543210987",
    sortCode: "030101",
    narration: "JULY 2024 PREMIUM",
    accountType: "Current",
    bankAccountName: "Adwoa Williams",
    amountInWords: "Five Hundred Ghana Cedis",
    height: 165,
    heightUnit: "cm",
    weight: 70,
    bmi: 25.7,
    alcoholHabits: 'never_used',
    alcoholBeer: { consumed: false },
    alcoholWine: { consumed: false },
    alcoholSpirits: { consumed: false },
    reducedAlcoholMedicalAdvice: { reduced: 'no' },
    reducedAlcoholHealthProblems: { reduced: 'no' },
    tobaccoHabits: 'ex_smoker_over_5_years',
    medicalHistory: [
      {
        illness: "High blood pressure",
        date: "2020-01-15",
        hospital: "37 Military Hospital",
        duration: "Ongoing",
        status: "Controlled",
        diagnosisDate: "2020-01-15",
        bpReadingAtDiagnosis: "150/95 mmHg",
        causeOfHighBp: "Stress",
        prescribedTreatment: "Amlodipine 5mg daily",
        complications: "None",
        monitoringFrequency: "Monthly",
        lastMonitoredDate: "2024-07-01",
        lastBpReading: "130/85 mmHg",
        sugarCholesterolChecked: "Yes, results were normal in Jan 2024."
      }
    ],
    familyMedicalHistory: 'yes',
    familyMedicalHistoryDetails: [
        { condition: "Heart disease", relation: "Father", ageOfOccurrence: 58, currentAgeOrAgeAtDeath: 65 }
    ],
    lifestyleDetails: [],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Lecturer",
    natureOfBusiness: "Education",
    employer: "KNUST",
    employerAddress: "KNUST Campus, Kumasi",
    monthlyBasicIncome: 7000,
    otherIncome: 1000,
    totalMonthlyIncome: 8000,
  },
  {
    id: 3,
    client: "Mr. Yaw Asante",
    lifeAssuredDob: "1990-01-15",
    placeOfBirth: "Cape Coast",
    ageNextBirthday: 35,
    gender: "Male",
    maritalStatus: "Single",
    dependents: 0,
    nationality: "Ghanaian",
    country: "Ghana",
    religion: "Christian",
    languages: "English, Fante",
    email: "yaw.asante@example.com",
    phone: "0551234567",
    postalAddress: "P.O. Box CC100, Cape Coast",
    nationalIdType: "Voter ID",
    idNumber: "1234500001",
    placeOfIssue: "EC, Cape Coast",
    issueDate: "2020-11-01",
    expiryDateId: "2028-10-31",
    policy: "",
    product: "The Education Policy",
    premium: 200,
    initialSumAssured: 100000,
    sumAssured: 100000,
    commencementDate: "2024-08-01",
    expiryDate: "2064-08-01",
    policyTerm: 40,
    premiumTerm: 30,
    serial: "1003",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 3, amount: 200, dueDate: "2024-08-01", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Esi Asante", dob: "1965-03-10", gender: "Female", relationship: "Mother", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "GCB Bank PLC",
    bankBranch: "Cape Coast",
    payerName: "Yaw Asante",
    bankAccountNumber: "1122334455667",
    sortCode: "040401",
    narration: "AUG 2024 PREMIUM",
    accountType: "Savings",
    bankAccountName: "Yaw Asante",
    amountInWords: "Two Hundred Ghana Cedis",
    height: 175,
    heightUnit: "cm",
    weight: 78,
    bmi: 25.5,
    alcoholHabits: "never_used",
    tobaccoHabits: "never_smoked",
    medicalHistory: [],
    familyMedicalHistory: "no",
    familyMedicalHistoryDetails: [],
    lifestyleDetails: [],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Teacher",
    natureOfBusiness: "Education",
    employer: "Ghana Education Service",
    employerAddress: "Ministries, Accra",
    monthlyBasicIncome: 2500,
    otherIncome: 0,
    totalMonthlyIncome: 2500,
  },
  {
    id: 4,
    client: "Ms. Fatima Al-Hassan",
    lifeAssuredDob: "1988-09-05",
    placeOfBirth: "Tamale",
    ageNextBirthday: 36,
    gender: "Female",
    maritalStatus: "Single",
    dependents: 1,
    nationality: "Ghanaian",
    country: "Ghana",
    religion: "Muslim",
    languages: "English, Dagbani",
    email: "fatima.alhassan@example.com",
    phone: "0277654321",
    postalAddress: "P.O. Box TL50, Tamale",
    nationalIdType: "Passport",
    idNumber: "G1234567",
    placeOfIssue: "Passport Office, Accra",
    issueDate: "2022-01-20",
    expiryDateId: "2027-01-19",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 400,
    initialSumAssured: 200000,
    sumAssured: 200000,
    commencementDate: "2024-08-01",
    expiryDate: "2063-08-01",
    policyTerm: 39,
    premiumTerm: 29,
    serial: "1004",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 4, amount: 400, dueDate: "2024-08-01", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Ibrahim Al-Hassan", dob: "2015-06-20", gender: "Male", relationship: "Son", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Stanbic Bank Ghana Limited",
    bankBranch: "Tamale",
    payerName: "Fatima Al-Hassan",
    bankAccountNumber: "9040001234567",
    sortCode: "300405",
    narration: "AUG 2024 PREMIUM",
    accountType: "Current",
    bankAccountName: "Fatima Al-Hassan",
    amountInWords: "Four Hundred Ghana Cedis",
    height: 168,
    heightUnit: "cm",
    weight: 65,
    bmi: 23.0,
    alcoholHabits: "never_used",
    tobaccoHabits: "never_smoked",
    medicalHistory: [{ illness: "Asthma", date: "2010-05-10", hospital: "Tamale Teaching Hospital", duration: "Childhood", status: "Mild, infrequent", asthmaSeverity: "Mild" }],
    familyMedicalHistory: "no",
    familyMedicalHistoryDetails: [],
    lifestyleDetails: [],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Trader",
    natureOfBusiness: "Retail",
    employer: "Self-Employed",
    employerAddress: "Tamale Central Market",
    monthlyBasicIncome: 4000,
    otherIncome: 1500,
    totalMonthlyIncome: 5500,
  },
  {
    id: 5,
    client: "Dr. Charles Ofori",
    lifeAssuredDob: "1975-04-22",
    placeOfBirth: "Accra",
    ageNextBirthday: 50,
    gender: "Male",
    maritalStatus: "Married",
    dependents: 4,
    nationality: "Ghanaian",
    country: "Ghana",
    religion: "Christian",
    languages: "English",
    email: "charles.ofori@example.com",
    phone: "0201122334",
    postalAddress: "P.O. Box LG 1, Legon",
    nationalIdType: "Ghana Card",
    idNumber: "GHA-555444333-2",
    placeOfIssue: "NIA, Accra",
    issueDate: "2019-08-10",
    expiryDateId: "2029-08-09",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 1000,
    initialSumAssured: 500000,
    sumAssured: 500000,
    commencementDate: "2024-08-01",
    expiryDate: "2050-08-01",
    policyTerm: 25,
    premiumTerm: 15,
    serial: "1005",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 5, amount: 1000, dueDate: "2024-08-01", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Beatrice Ofori", dob: "1978-12-01", gender: "Female", relationship: "Spouse", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Fidelity Bank Ghana Limited",
    bankBranch: "Legon",
    payerName: "Charles Ofori",
    bankAccountNumber: "1050012345678",
    sortCode: "240105",
    narration: "AUG 2024 PREMIUM",
    accountType: "Current",
    bankAccountName: "Dr. Charles Ofori",
    amountInWords: "One Thousand Ghana Cedis",
    height: 182,
    heightUnit: "cm",
    weight: 90,
    bmi: 27.2,
    alcoholHabits: "occasional_socially",
    tobaccoHabits: "ex_smoker_over_5_years",
    medicalHistory: [],
    familyMedicalHistory: "yes",
    familyMedicalHistoryDetails: [{ condition: "Diabetes", relation: "Mother", ageOfOccurrence: 55, currentAgeOrAgeAtDeath: 75 }],
    lifestyleDetails: [],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Doctor",
    natureOfBusiness: "Healthcare",
    employer: "Korle Bu Teaching Hospital",
    employerAddress: "Korle Bu, Accra",
    monthlyBasicIncome: 12000,
    otherIncome: 3000,
    totalMonthlyIncome: 15000,
  },
  {
    id: 6,
    client: "Miss Angela Okoro",
    lifeAssuredDob: "1995-07-30",
    placeOfBirth: "Lagos",
    ageNextBirthday: 29,
    gender: "Female",
    maritalStatus: "Single",
    dependents: 0,
    nationality: "Nigerian",
    country: "Ghana",
    religion: "Christian",
    languages: "English, Yoruba",
    email: "angela.okoro@example.com",
    phone: "0549876543",
    postalAddress: "PMB, East Legon, Accra",
    nationalIdType: "Passport",
    idNumber: "NGA123456",
    placeOfIssue: "Nigerian High Commission",
    issueDate: "2023-01-15",
    expiryDateId: "2028-01-14",
    policy: "",
    product: "The Education Policy",
    premium: 300,
    initialSumAssured: 150000,
    sumAssured: 150000,
    commencementDate: "2024-08-01",
    expiryDate: "2071-08-01",
    policyTerm: 46,
    premiumTerm: 36,
    serial: "1006",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 6, amount: 300, dueDate: "2024-08-01", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Grace Okoro", dob: "1970-02-25", gender: "Female", relationship: "Mother", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Access Bank (Ghana) Plc",
    bankBranch: "East Legon",
    payerName: "Angela Okoro",
    bankAccountNumber: "0210100123456",
    sortCode: "280102",
    narration: "AUG 2024 PREMIUM",
    accountType: "Savings",
    bankAccountName: "Angela Okoro",
    amountInWords: "Three Hundred Ghana Cedis",
    height: 170,
    heightUnit: "cm",
    weight: 68,
    bmi: 23.5,
    alcoholHabits: "occasional_socially",
    tobaccoHabits: "never_smoked",
    medicalHistory: [],
    familyMedicalHistory: "no",
    familyMedicalHistoryDetails: [],
    lifestyleDetails: [{ item: "Work outside", details: "Travel to USA for 2 weeks quarterly" }],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Software Developer",
    natureOfBusiness: "Technology",
    employer: "Andela",
    employerAddress: "One Airport Square, Accra",
    monthlyBasicIncome: 8000,
    otherIncome: 0,
    totalMonthlyIncome: 8000,
  },
  {
    id: 7,
    client: "Mr. Emmanuel Agyei",
    lifeAssuredDob: "1980-03-12",
    placeOfBirth: "Koforidua",
    ageNextBirthday: 45,
    gender: "Male",
    maritalStatus: "Married",
    dependents: 2,
    nationality: "Ghanaian",
    country: "Ghana",
    religion: "Christian",
    languages: "English, Twi",
    email: "emmanuel.agyei@example.com",
    phone: "0264123789",
    postalAddress: "P.O. Box KF123, Koforidua",
    nationalIdType: "Ghana Card",
    idNumber: "GHA-789123456-3",
    placeOfIssue: "NIA, Koforidua",
    issueDate: "2020-05-20",
    expiryDateId: "2030-05-19",
    policy: "",
    product: "The Education Policy",
    premium: 450,
    initialSumAssured: 220000,
    sumAssured: 220000,
    commencementDate: "2024-08-01",
    expiryDate: "2055-08-01",
    policyTerm: 30,
    premiumTerm: 20,
    serial: "1007",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 7, amount: 450, dueDate: "2024-08-01", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Linda Agyei", dob: "1985-08-01", gender: "Female", relationship: "Spouse", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "GCB Bank PLC",
    bankBranch: "Koforidua Main",
    payerName: "Emmanuel Agyei",
    bankAccountNumber: "2233445566778",
    sortCode: "040701",
    narration: "AUG 2024 PREMIUM",
    accountType: "Current",
    bankAccountName: "Emmanuel Agyei",
    amountInWords: "Four Hundred and Fifty Ghana Cedis",
    height: 178,
    heightUnit: "cm",
    weight: 88,
    bmi: 27.8,
    alcoholHabits: "current_regular_drinker",
    tobaccoHabits: "never_smoked",
    medicalHistory: [{ illness: "Surgery", date: "2018-06-15", hospital: "St. Joseph Hospital", duration: "2 weeks", status: "Fully Recovered" }],
    familyMedicalHistory: "no",
    familyMedicalHistoryDetails: [],
    lifestyleDetails: [],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Civil Engineer",
    natureOfBusiness: "Construction",
    employer: "Ghana Highway Authority",
    employerAddress: "Pension Drive, Accra",
    monthlyBasicIncome: 6000,
    otherIncome: 2000,
    totalMonthlyIncome: 8000,
  },
  {
    id: 8,
    client: "Ms. Akua Boahen",
    lifeAssuredDob: "1992-12-01",
    placeOfBirth: "Sunyani",
    ageNextBirthday: 32,
    gender: "Female",
    maritalStatus: "Single",
    dependents: 0,
    nationality: "Ghanaian",
    country: "Ghana",
    religion: "Christian",
    languages: "English, Bono",
    email: "akua.boahen@example.com",
    phone: "0501239876",
    postalAddress: "P.O. Box SY50, Sunyani",
    nationalIdType: "Ghana Card",
    idNumber: "GHA-321654987-4",
    placeOfIssue: "NIA, Sunyani",
    issueDate: "2021-09-01",
    expiryDateId: "2031-08-31",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 250,
    initialSumAssured: 125000,
    sumAssured: 125000,
    commencementDate: "2024-08-01",
    expiryDate: "2067-08-01",
    policyTerm: 43,
    premiumTerm: 33,
    serial: "1008",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 8, amount: 250, dueDate: "2024-08-01", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Kwame Boahen", dob: "1960-01-01", gender: "Male", relationship: "Father", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Stanbic Bank Ghana Limited",
    bankBranch: "Sunyani",
    payerName: "Akua Boahen",
    bankAccountNumber: "9040007654321",
    sortCode: "300801",
    narration: "AUG 2024 PREMIUM",
    accountType: "Savings",
    bankAccountName: "Akua Boahen",
    amountInWords: "Two Hundred and Fifty Ghana Cedis",
    height: 165,
    heightUnit: "cm",
    weight: 60,
    bmi: 22.0,
    alcoholHabits: "occasional_socially",
    tobaccoHabits: "never_smoked",
    medicalHistory: [],
    familyMedicalHistory: "no",
    familyMedicalHistoryDetails: [],
    lifestyleDetails: [],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Journalist",
    natureOfBusiness: "Media",
    employer: "Multimedia Group",
    employerAddress: "Faanofa Road, Accra",
    monthlyBasicIncome: 3500,
    otherIncome: 500,
    totalMonthlyIncome: 4000,
  },
  {
    id: 9,
    client: "Mr. Femi Adebayo",
    lifeAssuredDob: "1978-06-25",
    placeOfBirth: "Ibadan",
    ageNextBirthday: 47,
    gender: "Male",
    maritalStatus: "Married",
    dependents: 3,
    nationality: "Nigerian",
    country: "Ghana",
    religion: "Christian",
    languages: "English, Yoruba",
    email: "femi.adebayo@example.com",
    phone: "0235001122",
    postalAddress: "P.O. Box AD 45, Adabraka, Accra",
    nationalIdType: "Passport",
    idNumber: "NGA7654321",
    placeOfIssue: "Nigerian High Commission",
    issueDate: "2022-08-11",
    expiryDateId: "2027-08-10",
    policy: "",
    product: "The Education Policy",
    premium: 700,
    initialSumAssured: 350000,
    sumAssured: 350000,
    commencementDate: "2024-08-01",
    expiryDate: "2052-08-01",
    policyTerm: 28,
    premiumTerm: 18,
    serial: "1009",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 9, amount: 700, dueDate: "2024-08-01", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Sade Adebayo", dob: "1982-01-20", gender: "Female", relationship: "Spouse", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Access Bank (Ghana) Plc",
    bankBranch: "Head Office",
    payerName: "Femi Adebayo",
    bankAccountNumber: "0010100987654",
    sortCode: "280101",
    narration: "AUG 2024 PREMIUM",
    accountType: "Current",
    bankAccountName: "Femi Adebayo",
    amountInWords: "Seven Hundred Ghana Cedis",
    height: 185,
    heightUnit: "cm",
    weight: 95,
    bmi: 27.8,
    alcoholHabits: "ex_drinker_1_to_5_years",
    tobaccoHabits: "never_smoked",
    medicalHistory: [{ illness: "High blood pressure", date: "2021-03-20", hospital: "Trust Hospital", duration: "Ongoing", status: "Controlled" }],
    familyMedicalHistory: "yes",
    familyMedicalHistoryDetails: [{ condition: "High blood pressure", relation: "Father", ageOfOccurrence: 45, currentAgeOrAgeAtDeath: 70 }],
    lifestyleDetails: [],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Banker",
    natureOfBusiness: "Finance",
    employer: "Access Bank (Ghana) Plc",
    employerAddress: "Starlets 91 Road, Accra",
    monthlyBasicIncome: 9000,
    otherIncome: 1000,
    totalMonthlyIncome: 10000,
  },
  {
    id: 10,
    client: "Mrs. Evelyn Mensah",
    lifeAssuredDob: "1985-02-18",
    placeOfBirth: "Ho",
    ageNextBirthday: 40,
    gender: "Female",
    maritalStatus: "Married",
    dependents: 1,
    nationality: "Ghanaian",
    country: "Ghana",
    religion: "Christian",
    languages: "English, Ewe",
    email: "evelyn.mensah@example.com",
    phone: "0245678123",
    postalAddress: "P.O. Box VH 200, Ho",
    nationalIdType: "Ghana Card",
    idNumber: "GHA-111222333-5",
    placeOfIssue: "NIA, Ho",
    issueDate: "2020-02-28",
    expiryDateId: "2030-02-27",
    policy: "",
    product: "The Education Policy",
    premium: 300,
    initialSumAssured: 150000,
    sumAssured: 150000,
    commencementDate: "2024-08-01",
    expiryDate: "2059-08-01",
    policyTerm: 35,
    premiumTerm: 25,
    serial: "1010",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 10, amount: 300, dueDate: "2024-08-01", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Frank Mensah", dob: "1980-10-10", gender: "Male", relationship: "Spouse", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Fidelity Bank Ghana Limited",
    bankBranch: "Ho",
    payerName: "Evelyn Mensah",
    bankAccountNumber: "1050098765432",
    sortCode: "240801",
    narration: "AUG 2024 PREMIUM",
    accountType: "Savings",
    bankAccountName: "Evelyn Mensah",
    amountInWords: "Three Hundred Ghana Cedis",
    height: 160,
    heightUnit: "cm",
    weight: 75,
    bmi: 29.3,
    alcoholHabits: "never_used",
    tobaccoHabits: "never_smoked",
    medicalHistory: [],
    familyMedicalHistory: "no",
    familyMedicalHistoryDetails: [],
    lifestyleDetails: [],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Nurse",
    natureOfBusiness: "Healthcare",
    employer: "Ho Teaching Hospital",
    employerAddress: "Ho, Volta Region",
    monthlyBasicIncome: 3000,
    otherIncome: 200,
    totalMonthlyIncome: 3200,
  },
  {
    id: 11,
    client: "Mr. Richard Peprah",
    lifeAssuredDob: "1998-11-20",
    placeOfBirth: "Obuasi",
    ageNextBirthday: 26,
    gender: "Male",
    maritalStatus: "Single",
    dependents: 0,
    nationality: "Ghanaian",
    country: "Ghana",
    religion: "Christian",
    languages: "English, Twi",
    email: "richard.peprah@example.com",
    phone: "0557891234",
    postalAddress: "P.O. Box OB 10, Obuasi",
    nationalIdType: "Ghana Card",
    idNumber: "GHA-998877665-6",
    placeOfIssue: "NIA, Obuasi",
    issueDate: "2022-04-15",
    expiryDateId: "2032-04-14",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 150,
    initialSumAssured: 75000,
    sumAssured: 75000,
    commencementDate: "2024-08-01",
    expiryDate: "2073-08-01",
    policyTerm: 49,
    premiumTerm: 39,
    serial: "1011",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 11, amount: 150, dueDate: "2024-08-01", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Abena Peprah", dob: "1975-01-01", gender: "Female", relationship: "Mother", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "GCB Bank PLC",
    bankBranch: "Obuasi",
    payerName: "Richard Peprah",
    bankAccountNumber: "3344556677889",
    sortCode: "041201",
    narration: "AUG 2024 PREMIUM",
    accountType: "Savings",
    bankAccountName: "Richard Peprah",
    amountInWords: "One Hundred and Fifty Ghana Cedis",
    height: 179,
    heightUnit: "cm",
    weight: 80,
    bmi: 25.0,
    alcoholHabits: "occasional_socially",
    tobaccoHabits: "never_smoked",
    medicalHistory: [],
    familyMedicalHistory: "no",
    familyMedicalHistoryDetails: [],
    lifestyleDetails: [{ item: "Motorcycles Racing", details: "Amateur weekend racing" }],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Mining Engineer",
    natureOfBusiness: "Mining",
    employer: "AngloGold Ashanti",
    employerAddress: "Obuasi Gold Mine, Obuasi",
    monthlyBasicIncome: 5500,
    otherIncome: 0,
    totalMonthlyIncome: 5500,
  },
  {
    id: 12,
    client: "Ms. Sandra Owusu",
    lifeAssuredDob: "1983-08-08",
    placeOfBirth: "Takoradi",
    ageNextBirthday: 42,
    gender: "Female",
    maritalStatus: "Divorced",
    dependents: 2,
    nationality: "Ghanaian",
    country: "Ghana",
    religion: "Christian",
    languages: "English, Fante",
    email: "sandra.owusu@example.com",
    phone: "0209871234",
    postalAddress: "P.O. Box TD 500, Takoradi",
    nationalIdType: "Ghana Card",
    idNumber: "GHA-777888999-7",
    placeOfIssue: "NIA, Takoradi",
    issueDate: "2019-12-10",
    expiryDateId: "2029-12-09",
    policy: "",
    product: "The Education Policy",
    premium: 600,
    initialSumAssured: 300000,
    sumAssured: 300000,
    commencementDate: "2024-08-01",
    expiryDate: "2056-08-01",
    policyTerm: 33,
    premiumTerm: 23,
    serial: "1012",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 12, amount: 600, dueDate: "2024-08-01", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Junior Owusu", dob: "2010-10-10", gender: "Male", relationship: "Son", percentage: 50 }, { name: "Adjoa Owusu", dob: "2012-12-12", gender: "Female", relationship: "Daughter", percentage: 50 }],
    contingentBeneficiaries: [],
    bankName: "Stanbic Bank Ghana Limited",
    bankBranch: "Takoradi",
    payerName: "Sandra Owusu",
    bankAccountNumber: "9040001122334",
    sortCode: "301101",
    narration: "AUG 2024 PREMIUM",
    accountType: "Current",
    bankAccountName: "Sandra Owusu",
    amountInWords: "Six Hundred Ghana Cedis",
    height: 172,
    heightUnit: "cm",
    weight: 72,
    bmi: 24.3,
    alcoholHabits: "ex_drinker_1_to_5_years",
    tobaccoHabits: "ex_smoker_over_5_years",
    medicalHistory: [],
    familyMedicalHistory: "yes",
    familyMedicalHistoryDetails: [{ condition: "Cancer", relation: "Mother", ageOfOccurrence: 59, currentAgeOrAgeAtDeath: 59 }],
    lifestyleDetails: [],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Lawyer",
    natureOfBusiness: "Legal",
    employer: "Owusu & Associates",
    employerAddress: "Liberation Road, Takoradi",
    monthlyBasicIncome: 10000,
    otherIncome: 2000,
    totalMonthlyIncome: 12000,
  },
  {
    id: 13,
    client: "Mr. Ahmed Bello",
    lifeAssuredDob: "1993-04-14",
    placeOfBirth: "Kano",
    ageNextBirthday: 32,
    gender: "Male",
    maritalStatus: "Single",
    dependents: 0,
    nationality: "Nigerian",
    country: "Ghana",
    religion: "Muslim",
    languages: "English, Hausa",
    email: "ahmed.bello@example.com",
    phone: "0531234567",
    postalAddress: "P.O. Box AC 99, Accra",
    nationalIdType: "Passport",
    idNumber: "NGA987654",
    placeOfIssue: "Nigerian High Commission",
    issueDate: "2023-05-01",
    expiryDateId: "2028-04-30",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 350,
    initialSumAssured: 180000,
    sumAssured: 180000,
    commencementDate: "2024-08-01",
    expiryDate: "2066-08-01",
    policyTerm: 43,
    premiumTerm: 33,
    serial: "1013",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 13, amount: 350, dueDate: "2024-08-01", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Aisha Bello", dob: "1995-01-01", gender: "Female", relationship: "Sister", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Fidelity Bank Ghana Limited",
    bankBranch: "Ridge Towers",
    payerName: "Ahmed Bello",
    bankAccountNumber: "1050023456789",
    sortCode: "240101",
    narration: "AUG 2024 PREMIUM",
    accountType: "Current",
    bankAccountName: "Ahmed Bello",
    amountInWords: "Three Hundred and Fifty Ghana Cedis",
    height: 180,
    heightUnit: "cm",
    weight: 82,
    bmi: 25.3,
    alcoholHabits: "never_used",
    tobaccoHabits: "never_smoked",
    medicalHistory: [],
    familyMedicalHistory: "no",
    familyMedicalHistoryDetails: [],
    lifestyleDetails: [],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "IT Consultant",
    natureOfBusiness: "Technology",
    employer: "Self-Employed",
    employerAddress: "Home Office",
    monthlyBasicIncome: 7000,
    otherIncome: 0,
    totalMonthlyIncome: 7000,
  },
  {
    id: 14,
    client: "Ms. Brenda Tetteh",
    lifeAssuredDob: "1979-09-09",
    placeOfBirth: "Somanya",
    ageNextBirthday: 45,
    gender: "Female",
    maritalStatus: "Widowed",
    dependents: 2,
    nationality: "Ghanaian",
    country: "Ghana",
    religion: "Christian",
    languages: "English, Krobo",
    email: "brenda.tetteh@example.com",
    phone: "0281234500",
    postalAddress: "P.O. Box SA 12, Somanya",
    nationalIdType: "Ghana Card",
    idNumber: "GHA-444555666-8",
    placeOfIssue: "NIA, Somanya",
    issueDate: "2020-10-10",
    expiryDateId: "2030-10-09",
    policy: "",
    product: "The Education Policy",
    premium: 550,
    initialSumAssured: 275000,
    sumAssured: 275000,
    commencementDate: "2024-08-01",
    expiryDate: "2054-08-01",
    policyTerm: 30,
    premiumTerm: 20,
    serial: "1014",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 14, amount: 550, dueDate: "2024-08-01", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Mawuena Tetteh", dob: "2005-01-20", gender: "Female", relationship: "Daughter", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Access Bank (Ghana) Plc",
    bankBranch: "Somanya",
    payerName: "Brenda Tetteh",
    bankAccountNumber: "0210100987123",
    sortCode: "280115",
    narration: "AUG 2024 PREMIUM",
    accountType: "Current",
    bankAccountName: "Brenda Tetteh",
    amountInWords: "Five Hundred and Fifty Ghana Cedis",
    height: 169,
    heightUnit: "cm",
    weight: 78,
    bmi: 27.3,
    alcoholHabits: "occasional_socially",
    tobaccoHabits: "never_smoked",
    medicalHistory: [{ illness: "Diabetes", date: "2019-11-01", hospital: "Atua Government Hospital", duration: "Ongoing", status: "Controlled with diet" }],
    familyMedicalHistory: "yes",
    familyMedicalHistoryDetails: [{ condition: "Diabetes", relation: "Mother", ageOfOccurrence: 50, currentAgeOrAgeAtDeath: 68 }],
    lifestyleDetails: [],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Business Owner",
    natureOfBusiness: "Retail - Boutique",
    employer: "Brenda's Fashions",
    employerAddress: "Main Street, Somanya",
    monthlyBasicIncome: 8000,
    otherIncome: 0,
    totalMonthlyIncome: 8000,
  },
  {
    id: 15,
    client: "Mr. Samuel Cudjoe",
    lifeAssuredDob: "1986-07-07",
    placeOfBirth: "Axim",
    ageNextBirthday: 39,
    gender: "Male",
    maritalStatus: "Married",
    dependents: 1,
    nationality: "Ghanaian",
    country: "Ghana",
    religion: "Christian",
    languages: "English, Nzema",
    email: "samuel.cudjoe@example.com",
    phone: "0200555666",
    postalAddress: "P.O. Box AX 77, Axim",
    nationalIdType: "Ghana Card",
    idNumber: "GHA-121212121-9",
    placeOfIssue: "NIA, Axim",
    issueDate: "2021-01-01",
    expiryDateId: "2030-12-31",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 420,
    initialSumAssured: 210000,
    sumAssured: 210000,
    commencementDate: "2024-08-01",
    expiryDate: "2062-08-01",
    policyTerm: 36,
    premiumTerm: 26,
    serial: "1015",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 15, amount: 420, dueDate: "2024-08-01", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Mary Cudjoe", dob: "1990-01-01", gender: "Female", relationship: "Spouse", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "GCB Bank PLC",
    bankBranch: "Axim",
    payerName: "Samuel Cudjoe",
    bankAccountNumber: "4455667788990",
    sortCode: "042201",
    narration: "AUG 2024 PREMIUM",
    accountType: "Savings",
    bankAccountName: "Samuel Cudjoe",
    amountInWords: "Four Hundred and Twenty Ghana Cedis",
    height: 175,
    heightUnit: "cm",
    weight: 85,
    bmi: 27.8,
    alcoholHabits: "current_regular_drinker",
    tobaccoHabits: "current_regular_smoker",
    medicalHistory: [],
    familyMedicalHistory: "no",
    familyMedicalHistoryDetails: [],
    lifestyleDetails: [{ item: "Scuba diving", details: "Recreational diving, max 20m" }],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Fisherman",
    natureOfBusiness: "Fishing",
    employer: "Self-Employed",
    employerAddress: "Axim Harbour",
    monthlyBasicIncome: 3000,
    otherIncome: 1000,
    totalMonthlyIncome: 4000,
  },
  {
    id: 16,
    client: "Ms. Victoria Nortey",
    lifeAssuredDob: "1991-05-25",
    placeOfBirth: "Tema",
    ageNextBirthday: 34,
    gender: "Female",
    maritalStatus: "Single",
    dependents: 0,
    nationality: "Ghanaian",
    country: "Ghana",
    religion: "Christian",
    languages: "English, Ga",
    email: "victoria.nortey@example.com",
    phone: "0241112233",
    postalAddress: "P.O. Box TM 1, Tema",
    nationalIdType: "Ghana Card",
    idNumber: "GHA-333222111-0",
    placeOfIssue: "NIA, Tema",
    issueDate: "2022-03-03",
    expiryDateId: "2032-03-02",
    policy: "",
    product: "The Education Policy",
    premium: 280,
    initialSumAssured: 140000,
    sumAssured: 140000,
    commencementDate: "2024-08-01",
    expiryDate: "2065-08-01",
    policyTerm: 41,
    premiumTerm: 31,
    serial: "1016",
    paymentFrequency: "Monthly",
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    bills: [{ id: 1, policyId: 16, amount: 280, dueDate: "2024-08-01", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Nii Nortey", dob: "1960-01-01", gender: "Male", relationship: "Father", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Fidelity Bank Ghana Limited",
    bankBranch: "Tema",
    payerName: "Victoria Nortey",
    bankAccountNumber: "1050034567890",
    sortCode: "240102",
    narration: "AUG 2024 PREMIUM",
    accountType: "Savings",
    bankAccountName: "Victoria Nortey",
    amountInWords: "Two Hundred and Eighty Ghana Cedis",
    height: 168,
    heightUnit: "cm",
    weight: 64,
    bmi: 22.7,
    alcoholHabits: "occasional_socially",
    tobaccoHabits: "never_smoked",
    medicalHistory: [],
    familyMedicalHistory: "no",
    familyMedicalHistoryDetails: [],
    lifestyleDetails: [],
    existingPoliciesDetails: [],
    declinedPolicyDetails: [],
    occupation: "Shipping Agent",
    natureOfBusiness: "Logistics",
    employer: "Maersk Ghana",
    employerAddress: "Tema Port",
    monthlyBasicIncome: 4500,
    otherIncome: 0,
    totalMonthlyIncome: 4500,
  }
];

    




    
