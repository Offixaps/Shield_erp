

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
  placeOfBirth: string;
  policy: string;
  product: string;
  premium: number;
  sumAssured: number;
  commencementDate: string;
  expiryDate: string;
  policyTerm: number;
  premiumTerm: number;
  onboardingStatus: OnboardingStatus;
  billingStatus: BillingStatus;
  policyStatus: PolicyStatus;
  mandateVerified: boolean;
  firstPremiumPaid: boolean;
  medicalUnderwritingState: MedicalUnderwritingState;
  phone: string;
  serial: string;
  vettingNotes?: string;
  mandateReworkNotes?: string;
  bills: Bill[];
  payments: Payment[];
  activityLog: ActivityLog[];
  primaryBeneficiaries: Beneficiary[];
  contingentBeneficiaries: Beneficiary[];
  bankName: string;
  payerName: string;
  bankAccountNumber: string;
  sortCode: string;
  narration: string;
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
    placeOfBirth: "Accra",
    policy: "",
    product: "The Education Policy",
    premium: 350,
    sumAssured: 150000,
    commencementDate: "2024-07-28",
    expiryDate: "2059-07-28",
    policyTerm: 35,
    premiumTerm: 25,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0244123456",
    serial: "1001",
    bills: [{ id: 1, policyId: 1, amount: 350, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Ama Mensah", dob: "1990-05-20", gender: "Female", relationship: "Spouse", telephone: "0244123457", percentage: 100, isIrrevocable: true }],
    contingentBeneficiaries: [],
    bankName: "GCB Bank PLC",
    payerName: "Kofi Mensah",
    bankAccountNumber: "1234567890123",
    sortCode: "040101",
    narration: "JULY 2024 PREMIUM",
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
    placeOfBirth: "Kumasi",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 500,
    sumAssured: 250000,
    commencementDate: "2024-07-28",
    expiryDate: "2054-07-28",
    policyTerm: 30,
    premiumTerm: 20,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0208123456",
    serial: "1002",
    bills: [{ id: 1, policyId: 2, amount: 500, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "David Williams", dob: "1982-11-10", gender: "Male", relationship: "Spouse", telephone: "0208123457", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Absa Bank Ghana Limited",
    payerName: "Adwoa Williams",
    bankAccountNumber: "9876543210987",
    sortCode: "030101",
    narration: "JULY 2024 PREMIUM",
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
  {
    id: 3,
    client: "Dr. Esi Badu",
    placeOfBirth: "Cape Coast",
    policy: "",
    product: "The Education Policy",
    premium: 1000,
    sumAssured: 500000,
    commencementDate: "2024-07-28",
    expiryDate: "2049-07-28",
    policyTerm: 25,
    premiumTerm: 15,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0555123456",
    serial: "1003",
    bills: [{ id: 1, policyId: 3, amount: 1000, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Fiifi Badu", dob: "2015-01-15", gender: "Male", relationship: "Son", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "CalBank PLC",
    payerName: "Esi Badu",
    bankAccountNumber: "2468013579246",
    sortCode: "140101",
    narration: "JULY 2024 PREMIUM",
    height: 170,
    heightUnit: "cm",
    weight: 65,
    bmi: 22.5,
    alcoholHabits: 'never_used',
    tobaccoHabits: 'never_smoked',
    medicalHistory: [],
    familyMedicalHistory: 'no',
    familyMedicalHistoryDetails: [],
    lifestyleDetails: []
  },
  {
    id: 4,
    client: "Mr. Yaw Asante",
    placeOfBirth: "Sunyani",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 250,
    sumAssured: 100000,
    commencementDate: "2024-07-28",
    expiryDate: "2064-07-28",
    policyTerm: 40,
    premiumTerm: 30,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0277123456",
    serial: "1004",
    bills: [{ id: 1, policyId: 4, amount: 250, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Yaa Asante", dob: "1988-08-08", gender: "Female", relationship: "Sister", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Fidelity Bank Ghana Limited",
    payerName: "Yaw Asante",
    bankAccountNumber: "1357924680135",
    sortCode: "200102",
    narration: "JULY 2024 PREMIUM",
    height: 175,
    heightUnit: "cm",
    weight: 90,
    bmi: 29.4,
    alcoholHabits: 'current_regular_drinker',
    tobaccoHabits: 'current_regular_smoker',
     medicalHistory: [
      {
        illness: "Diabetes",
        date: "2021-06-10",
        hospital: "Ridge Hospital",
        duration: "Ongoing",
        status: "Managed",
        diabetesFirstSignsDate: "2021-05-01",
        diabetesSymptoms: "Increased thirst and urination",
        diabetesConsulted: 'yes',
        diabetesDiagnosisDate: "2021-06-10",
        diabetesOralTreatment: "Metformin 500mg twice daily",
        diabetesLatestBloodSugar: "6.5 mmol/L (fasting)"
      }
    ],
    familyMedicalHistory: 'yes',
    familyMedicalHistoryDetails: [
        { condition: "Diabetes", relation: "Mother", ageOfOccurrence: 55, currentAgeOrAgeAtDeath: 70 }
    ],
    lifestyleDetails: []
  },
  {
    id: 5,
    client: "Miss Abena Owusu",
    placeOfBirth: "Takoradi",
    policy: "",
    product: "The Education Policy",
    premium: 400,
    sumAssured: 200000,
    commencementDate: "2024-07-28",
    expiryDate: "2054-07-28",
    policyTerm: 30,
    premiumTerm: 20,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0266123456",
    serial: "1005",
    bills: [{ id: 1, policyId: 5, amount: 400, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Kwame Owusu", dob: "1960-03-25", gender: "Male", relationship: "Father", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "GCB Bank PLC",
    payerName: "Abena Owusu",
    bankAccountNumber: "3692581470369",
    sortCode: "040101",
    narration: "JULY 2024 PREMIUM",
    height: 168,
    heightUnit: "cm",
    weight: 62,
    bmi: 22.0,
    alcoholHabits: 'never_used',
    tobaccoHabits: 'never_smoked',
    medicalHistory: [],
    familyMedicalHistory: 'no',
    familyMedicalHistoryDetails: [],
    lifestyleDetails: []
  },
   {
    id: 6,
    client: "Prof. Kwabena Darko",
    placeOfBirth: "Ho",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 750,
    sumAssured: 400000,
    commencementDate: "2024-07-28",
    expiryDate: "2044-07-28",
    policyTerm: 20,
    premiumTerm: 10,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0233123456",
    serial: "1006",
    bills: [{ id: 1, policyId: 6, amount: 750, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Darko Foundation", dob: "2010-01-01", gender: "Female", relationship: "Charity", percentage: 100, isIrrevocable: true }],
    contingentBeneficiaries: [],
    bankName: "Stanbic Bank Ghana Limited",
    payerName: "Kwabena Darko",
    bankAccountNumber: "1122334455667",
    sortCode: "300101",
    narration: "JULY 2024 PREMIUM",
    height: 178,
    heightUnit: "cm",
    weight: 88,
    bmi: 27.8,
    alcoholHabits: 'ex_drinker_over_5_years',
    tobaccoHabits: 'never_smoked',
    medicalHistory: [
        {
            illness: "Asthma",
            date: "2010-09-01",
            hospital: "Korle Bu",
            duration: "Childhood",
            status: "Resolved",
            asthmaFirstSignsAge: 8,
            asthmaSymptomFrequency: "Rarely, only with dust",
            asthmaLastAttackDate: "2015-01-01",
            asthmaSeverity: "Mild",
            asthmaMedication: "Ventolin as needed (not used in 5+ years)"
        }
    ],
    familyMedicalHistory: 'no',
    familyMedicalHistoryDetails: [],
    lifestyleDetails: []
  },
  {
    id: 7,
    client: "Mrs. Fatima Ibrahim",
    placeOfBirth: "Tamale",
    policy: "",
    product: "The Education Policy",
    premium: 300,
    sumAssured: 120000,
    commencementDate: "2024-07-28",
    expiryDate: "2059-07-28",
    policyTerm: 35,
    premiumTerm: 25,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0501123456",
    serial: "1007",
    bills: [{ id: 1, policyId: 7, amount: 300, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Ali Ibrahim", dob: "2018-06-20", gender: "Male", relationship: "Son", percentage: 50 }, { name: "Aisha Ibrahim", dob: "2020-07-22", gender: "Female", relationship: "Daughter", percentage: 50 }],
    contingentBeneficiaries: [],
    bankName: "Agricultural Development Bank Plc",
    payerName: "Fatima Ibrahim",
    bankAccountNumber: "2233445566778",
    sortCode: "070101",
    narration: "JULY 2024 PREMIUM",
    height: 160,
    heightUnit: "cm",
    weight: 60,
    bmi: 23.4,
    alcoholHabits: 'never_used',
    tobaccoHabits: 'never_smoked',
    medicalHistory: [],
    familyMedicalHistory: 'no',
    familyMedicalHistoryDetails: [],
    lifestyleDetails: []
  },
  {
    id: 8,
    client: "Mr. Charles Ampofo",
    placeOfBirth: "Koforidua",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 600,
    sumAssured: 300000,
    commencementDate: "2024-07-28",
    expiryDate: "2049-07-28",
    policyTerm: 25,
    premiumTerm: 15,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0245123456",
    serial: "1008",
    bills: [{ id: 1, policyId: 8, amount: 600, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Brenda Ampofo", dob: "1985-09-12", gender: "Female", relationship: "Spouse", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Absa Bank Ghana Limited",
    payerName: "Charles Ampofo",
    bankAccountNumber: "3344556677889",
    sortCode: "030101",
    narration: "JULY 2024 PREMIUM",
    height: 182,
    heightUnit: "cm",
    weight: 95,
    bmi: 28.7,
    alcoholHabits: 'occasional_socially',
    tobaccoHabits: 'never_smoked',
    medicalHistory: [],
    familyMedicalHistory: 'no',
    familyMedicalHistoryDetails: [],
    lifestyleDetails: []
  },
  {
    id: 9,
    client: "Ms. Akua Agyapong",
    placeOfBirth: "Bolgatanga",
    policy: "",
    product: "The Education Policy",
    premium: 200,
    sumAssured: 80000,
    commencementDate: "2024-07-28",
    expiryDate: "2064-07-28",
    policyTerm: 40,
    premiumTerm: 30,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0209123456",
    serial: "1009",
    bills: [{ id: 1, policyId: 9, amount: 200, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Grace Agyapong", dob: "1965-02-18", gender: "Female", relationship: "Mother", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "GCB Bank PLC",
    payerName: "Akua Agyapong",
    bankAccountNumber: "4455667788990",
    sortCode: "040101",
    narration: "JULY 2024 PREMIUM",
    height: 162,
    heightUnit: "cm",
    weight: 58,
    bmi: 22.1,
    alcoholHabits: 'never_used',
    tobaccoHabits: 'never_smoked',
    medicalHistory: [],
    familyMedicalHistory: 'no',
    familyMedicalHistoryDetails: [],
    lifestyleDetails: []
  },
  {
    id: 10,
    client: "Hon. Nii Lante Lamptey",
    placeOfBirth: "Accra",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 1500,
    sumAssured: 800000,
    commencementDate: "2024-07-28",
    expiryDate: "2044-07-28",
    policyTerm: 20,
    premiumTerm: 10,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0242123456",
    serial: "1010",
    bills: [{ id: 1, policyId: 10, amount: 1500, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Naa Atswei Lamptey", dob: "1978-12-30", gender: "Female", relationship: "Spouse", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "CalBank PLC",
    payerName: "Nii Lante Lamptey",
    bankAccountNumber: "5566778899001",
    sortCode: "140101",
    narration: "JULY 2024 PREMIUM",
    height: 179,
    heightUnit: "cm",
    weight: 84,
    bmi: 26.2,
    alcoholHabits: 'occasional_socially',
    tobaccoHabits: 'never_smoked',
    medicalHistory: [],
    familyMedicalHistory: 'no',
    familyMedicalHistoryDetails: [],
    lifestyleDetails: []
  },
   {
    id: 11,
    client: "Mr. Samuel Alabi",
    placeOfBirth: "Accra",
    policy: "",
    product: "The Education Policy",
    premium: 450,
    sumAssured: 220000,
    commencementDate: "2024-07-28",
    expiryDate: "2054-07-28",
    policyTerm: 30,
    premiumTerm: 20,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0201234567",
    serial: "1011",
    bills: [{ id: 1, policyId: 11, amount: 450, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Junior Alabi", dob: "2019-01-01", gender: "Male", relationship: "Son", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "GCB Bank PLC",
    payerName: "Samuel Alabi",
    bankAccountNumber: "6677889900112",
    sortCode: "040101",
    narration: "JULY 2024 PREMIUM",
    height: 172,
    heightUnit: "cm",
    weight: 75,
    bmi: 25.4,
    alcoholHabits: 'never_used',
    tobaccoHabits: 'never_smoked',
    medicalHistory: [],
    familyMedicalHistory: 'no',
    familyMedicalHistoryDetails: [],
    lifestyleDetails: []
  },
  {
    id: 12,
    client: "Mrs. Beatrice Tetteh",
    placeOfBirth: "Tema",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 800,
    sumAssured: 450000,
    commencementDate: "2024-07-28",
    expiryDate: "2049-07-28",
    policyTerm: 25,
    premiumTerm: 15,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0249876543",
    serial: "1012",
    bills: [{ id: 1, policyId: 12, amount: 800, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Emmanuel Tetteh", dob: "1975-04-11", gender: "Male", relationship: "Spouse", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Absa Bank Ghana Limited",
    payerName: "Beatrice Tetteh",
    bankAccountNumber: "7788990011223",
    sortCode: "030101",
    narration: "JULY 2024 PREMIUM",
    height: 163,
    heightUnit: "cm",
    weight: 68,
    bmi: 25.6,
    alcoholHabits: 'never_used',
    tobaccoHabits: 'never_smoked',
    medicalHistory: [],
    familyMedicalHistory: 'no',
    familyMedicalHistoryDetails: [],
    lifestyleDetails: []
  },
  {
    id: 13,
    client: "Dr. Ken Ofori",
    placeOfBirth: "Kumasi",
    policy: "",
    product: "The Education Policy",
    premium: 1200,
    sumAssured: 600000,
    commencementDate: "2024-07-28",
    expiryDate: "2044-07-28",
    policyTerm: 20,
    premiumTerm: 10,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0508765432",
    serial: "1013",
    bills: [{ id: 1, policyId: 13, amount: 1200, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Ken Ofori Jnr", dob: "2022-03-03", gender: "Male", relationship: "Son", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "CalBank PLC",
    payerName: "Ken Ofori",
    bankAccountNumber: "8899001122334",
    sortCode: "140101",
    narration: "JULY 2024 PREMIUM",
    height: 185,
    heightUnit: "cm",
    weight: 92,
    bmi: 26.9,
    alcoholHabits: 'occasional_socially',
    tobaccoHabits: 'never_smoked',
    medicalHistory: [],
    familyMedicalHistory: 'no',
    familyMedicalHistoryDetails: [],
    lifestyleDetails: []
  },
  {
    id: 14,
    client: "Ms. Gifty Antwi",
    placeOfBirth: "Accra",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 320,
    sumAssured: 150000,
    commencementDate: "2024-07-28",
    expiryDate: "2059-07-28",
    policyTerm: 35,
    premiumTerm: 25,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0271234567",
    serial: "1014",
    bills: [{ id: 1, policyId: 14, amount: 320, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Evelyn Antwi", dob: "1968-01-20", gender: "Female", relationship: "Mother", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Fidelity Bank Ghana Limited",
    payerName: "Gifty Antwi",
    bankAccountNumber: "9900112233445",
    sortCode: "200102",
    narration: "JULY 2024 PREMIUM",
    height: 166,
    heightUnit: "cm",
    weight: 63,
    bmi: 22.8,
    alcoholHabits: 'never_used',
    tobaccoHabits: 'never_smoked',
    medicalHistory: [],
    familyMedicalHistory: 'no',
    familyMedicalHistoryDetails: [],
    lifestyleDetails: []
  },
  {
    id: 15,
    client: "Mr. David Annan",
    placeOfBirth: "Sekondi",
    policy: "",
    product: "The Education Policy",
    premium: 550,
    sumAssured: 275000,
    commencementDate: "2024-07-28",
    expiryDate: "2054-07-28",
    policyTerm: 30,
    premiumTerm: 20,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0267654321",
    serial: "1015",
    bills: [{ id: 1, policyId: 15, amount: 550, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Laura Annan", dob: "1992-10-10", gender: "Female", relationship: "Spouse", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "GCB Bank PLC",
    payerName: "David Annan",
    bankAccountNumber: "0011223344556",
    sortCode: "040101",
    narration: "JULY 2024 PREMIUM",
    height: 177,
    heightUnit: "cm",
    weight: 80,
    bmi: 25.5,
    alcoholHabits: 'occasional_socially',
    tobaccoHabits: 'never_smoked',
    medicalHistory: [],
    familyMedicalHistory: 'no',
    familyMedicalHistoryDetails: [],
    lifestyleDetails: []
  },
  {
    id: 16,
    client: "Mrs. Zainab Mohammed",
    placeOfBirth: "Wa",
    policy: "",
    product: "Buy Term and Invest in Mutual Fund",
    premium: 950,
    sumAssured: 500000,
    commencementDate: "2024-07-28",
    expiryDate: "2049-07-28",
    policyTerm: 25,
    premiumTerm: 15,
    onboardingStatus: "Pending First Premium",
    billingStatus: "Outstanding",
    policyStatus: "Inactive",
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "0234567890",
    serial: "1016",
    bills: [{ id: 1, policyId: 16, amount: 950, dueDate: "2024-07-28", status: 'Unpaid', description: 'First Premium' }],
    payments: [],
    activityLog: [...initialActivity],
    primaryBeneficiaries: [{ name: "Yusuf Mohammed", dob: "1979-11-25", gender: "Male", relationship: "Spouse", percentage: 100 }],
    contingentBeneficiaries: [],
    bankName: "Absa Bank Ghana Limited",
    payerName: "Zainab Mohammed",
    bankAccountNumber: "1122334455667",
    sortCode: "030101",
    narration: "JULY 2024 PREMIUM",
    height: 169,
    heightUnit: "cm",
    weight: 72,
    bmi: 25.2,
    alcoholHabits: 'never_used',
    tobaccoHabits: 'never_smoked',
    medicalHistory: [],
    familyMedicalHistory: 'yes',
    familyMedicalHistoryDetails: [
        { condition: "Diabetes", relation: "Father", ageOfOccurrence: 50, currentAgeOrAgeAtDeath: 62 }
    ],
    lifestyleDetails: []
  }
];
