

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
  // Beneficiaries
  primaryBeneficiaries: Beneficiary[];
  contingentBeneficiaries: Beneficiary[];
  // Health
  height?: number;
  heightUnit?: 'm' | 'cm' | 'ft';
  weight?: number;
  bmi?: number;
  alcoholHabits: 'never_used' | 'occasional_socially' | 'ex_drinker_over_5_years' | 'ex_drinker_1_to_5_years' | 'ex_drinker_within_1_year' | 'current_regular_drinker';
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
    occupation: "Accountant",
    natureOfBusiness: "Finance",
    employer: "Deloitte Ghana",
    employerAddress: "12 Airport City, Accra",
    monthlyBasicIncome: 5000,
    otherIncome: 500,
    totalMonthlyIncome: 5500,
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
    tobaccoHabits: 'never_smoked',
    medicalHistory: [],
    familyMedicalHistory: 'no',
    familyMedicalHistoryDetails: [],
    lifestyleDetails: []
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
    occupation: "Lecturer",
    natureOfBusiness: "Education",
    employer: "KNUST",
    employerAddress: "KNUST Campus, Kumasi",
    monthlyBasicIncome: 7000,
    otherIncome: 1000,
    totalMonthlyIncome: 8000,
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
    lifestyleDetails: []
  },
];
