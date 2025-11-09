

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
};


export const newBusinessData: NewBusiness[] = [
  {
    id: 1,
    client: 'Mr. Kofi A. Mensah',
    placeOfBirth: 'Accra',
    policy: '',
    product: 'Buy Term and Invest in Mutual Fund',
    premium: 200,
    sumAssured: 100000,
    commencementDate: '2024-08-01',
    expiryDate: '2044-08-01',
    policyTerm: 20,
    premiumTerm: 15,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0244111111',
    serial: '2001',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [{ name: 'Ama Mensah', dob: '1990-05-15', gender: 'Female', relationship: 'Spouse', telephone: '0244111112', percentage: 100, isIrrevocable: true }],
    contingentBeneficiaries: [],
    bankName: 'GCB Bank PLC',
    payerName: 'Mr. Kofi A. Mensah',
    bankAccountNumber: '1111111111111',
    sortCode: '040101',
    narration: 'AUG 2024 PREMIUM',
  },
  {
    id: 2,
    client: 'Mrs. Fatima Z. Bello',
    placeOfBirth: 'Kumasi',
    policy: '',
    product: 'The Education Policy',
    premium: 350,
    sumAssured: 150000,
    commencementDate: '2024-08-02',
    expiryDate: '2044-08-02',
    policyTerm: 20,
    premiumTerm: 18,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0200222222',
    serial: '2002',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [
        { name: 'Musa Bello', dob: '2018-01-10', gender: 'Male', relationship: 'Son', telephone: '', percentage: 50, isIrrevocable: false },
        { name: 'Aisha Bello', dob: '2020-03-20', gender: 'Female', relationship: 'Daughter', telephone: '', percentage: 50, isIrrevocable: false }
    ],
    contingentBeneficiaries: [],
    bankName: 'Absa Bank Ghana Limited',
    payerName: 'Mrs. Fatima Z. Bello',
    bankAccountNumber: '2222222222222',
    sortCode: '030101',
    narration: 'AUG 2024 PREMIUM',
  },
  {
    id: 3,
    client: 'Dr. Ekow N. Ansah',
    placeOfBirth: 'Cape Coast',
    policy: '',
    product: 'Buy Term and Invest in Mutual Fund',
    premium: 500,
    sumAssured: 300000,
    commencementDate: '2024-08-03',
    expiryDate: '2054-08-03',
    policyTerm: 30,
    premiumTerm: 25,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0555333333',
    serial: '2003',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [{ name: 'Adwoa Ansah', dob: '1985-11-25', gender: 'Female', relationship: 'Spouse', telephone: '0555333334', percentage: 100, isIrrevocable: false }],
    contingentBeneficiaries: [],
    bankName: 'CalBank PLC',
    payerName: 'Dr. Ekow N. Ansah',
    bankAccountNumber: '3333333333333',
    sortCode: '140101',
    narration: 'AUG 2024 PREMIUM',
  },
  {
    id: 4,
    client: 'Ms. Akua G. Osei',
    placeOfBirth: 'Takoradi',
    policy: '',
    product: 'The Education Policy',
    premium: 250,
    sumAssured: 100000,
    commencementDate: '2024-08-04',
    expiryDate: '2039-08-04',
    policyTerm: 15,
    premiumTerm: 15,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0266444444',
    serial: '2004',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [{ name: 'Yaw Osei', dob: '2019-09-01', gender: 'Male', relationship: 'Son', telephone: '', percentage: 100, isIrrevocable: false }],
    contingentBeneficiaries: [],
    bankName: 'GCB Bank PLC',
    payerName: 'Ms. Akua G. Osei',
    bankAccountNumber: '4444444444444',
    sortCode: '040102',
    narration: 'AUG 2024 PREMIUM',
  },
  {
    id: 5,
    client: 'Prof. John Atta-Mills',
    placeOfBirth: 'Sunyani',
    policy: '',
    product: 'Buy Term and Invest in Mutual Fund',
    premium: 1000,
    sumAssured: 500000,
    commencementDate: '2024-08-05',
    expiryDate: '2044-08-05',
    policyTerm: 20,
    premiumTerm: 20,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0277555555',
    serial: '2005',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [{ name: 'Naadu Mills', dob: '1950-01-01', gender: 'Female', relationship: 'Spouse', telephone: '0277555556', percentage: 100, isIrrevocable: true }],
    contingentBeneficiaries: [],
    bankName: 'Absa Bank Ghana Limited',
    payerName: 'Prof. John Atta-Mills',
    bankAccountNumber: '5555555555555',
    sortCode: '030102',
    narration: 'AUG 2024 PREMIUM',
  },
  {
    id: 6,
    client: 'Alhaji Adamu I. Mohammed',
    placeOfBirth: 'Tamale',
    policy: '',
    product: 'The Education Policy',
    premium: 400,
    sumAssured: 200000,
    commencementDate: '2024-08-06',
    expiryDate: '2044-08-06',
    policyTerm: 20,
    premiumTerm: 18,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0244666666',
    serial: '2006',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [],
    contingentBeneficiaries: [],
    bankName: 'CalBank PLC',
    payerName: 'Alhaji Adamu I. Mohammed',
    bankAccountNumber: '6666666666666',
    sortCode: '140102',
    narration: 'AUG 2024 PREMIUM',
  },
  {
    id: 7,
    client: 'Ms. Grace T. Adjei',
    placeOfBirth: 'Ho',
    policy: '',
    product: 'Buy Term and Invest in Mutual Fund',
    premium: 150,
    sumAssured: 75000,
    commencementDate: '2024-08-07',
    expiryDate: '2034-08-07',
    policyTerm: 10,
    premiumTerm: 10,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0200777777',
    serial: '2007',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [],
    contingentBeneficiaries: [],
    bankName: 'GCB Bank PLC',
    payerName: 'Ms. Grace T. Adjei',
    bankAccountNumber: '7777777777777',
    sortCode: '040103',
    narration: 'AUG 2024 PREMIUM',
  },
  {
    id: 8,
    client: 'Mr. David K. Asante',
    placeOfBirth: 'Koforidua',
    policy: '',
    product: 'The Education Policy',
    premium: 300,
    sumAssured: 120000,
    commencementDate: '2024-08-08',
    expiryDate: '2039-08-08',
    policyTerm: 15,
    premiumTerm: 15,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0555888888',
    serial: '2008',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [],
    contingentBeneficiaries: [],
    bankName: 'Fidelity Bank Ghana Limited',
    payerName: 'Mr. David K. Asante',
    bankAccountNumber: '8888888888888',
    sortCode: '190101',
    narration: 'AUG 2024 PREMIUM',
  },
  {
    id: 9,
    client: 'Hon. Beatrice A. Lamptey',
    placeOfBirth: 'Tema',
    policy: '',
    product: 'Buy Term and Invest in Mutual Fund',
    premium: 800,
    sumAssured: 400000,
    commencementDate: '2024-08-09',
    expiryDate: '2049-08-09',
    policyTerm: 25,
    premiumTerm: 20,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0266999999',
    serial: '2009',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [],
    contingentBeneficiaries: [],
    bankName: 'Stanbic Bank Ghana Limited',
    payerName: 'Hon. Beatrice A. Lamptey',
    bankAccountNumber: '9999999999999',
    sortCode: '300101',
    narration: 'AUG 2024 PREMIUM',
  },
  {
    id: 10,
    client: 'Mr. Kwame Owusu',
    placeOfBirth: 'Accra',
    policy: '',
    product: 'Buy Term and Invest in Mutual Fund',
    premium: 180,
    sumAssured: 90000,
    commencementDate: '2024-08-10',
    expiryDate: '2034-08-10',
    policyTerm: 10,
    premiumTerm: 10,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0201234567',
    serial: '2010',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [],
    contingentBeneficiaries: [],
    bankName: 'GCB Bank PLC',
    payerName: 'Mr. Kwame Owusu',
    bankAccountNumber: '1011121314151',
    sortCode: '040104',
    narration: 'AUG 2024 PREMIUM',
  },
  {
    id: 11,
    client: 'Ms. Abena Y. Appiah',
    placeOfBirth: 'Kumasi',
    policy: '',
    product: 'The Education Policy',
    premium: 280,
    sumAssured: 110000,
    commencementDate: '2024-08-11',
    expiryDate: '2041-08-11',
    policyTerm: 17,
    premiumTerm: 15,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0509876543',
    serial: '2011',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [],
    contingentBeneficiaries: [],
    bankName: 'Absa Bank Ghana Limited',
    payerName: 'Ms. Abena Y. Appiah',
    bankAccountNumber: '1617181920212',
    sortCode: '030103',
    narration: 'AUG 2024 PREMIUM',
  },
  {
    id: 12,
    client: 'Mr. Samuel K. Boateng',
    placeOfBirth: 'Accra',
    policy: '',
    product: 'Buy Term and Invest in Mutual Fund',
    premium: 450,
    sumAssured: 250000,
    commencementDate: '2024-08-12',
    expiryDate: '2049-08-12',
    policyTerm: 25,
    premiumTerm: 20,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0241122334',
    serial: '2012',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [],
    contingentBeneficiaries: [],
    bankName: 'CalBank PLC',
    payerName: 'Mr. Samuel K. Boateng',
    bankAccountNumber: '2223242526272',
    sortCode: '140103',
    narration: 'AUG 2024 PREMIUM',
  },
  {
    id: 13,
    client: 'Mrs. Victoria A. Amponsah',
    placeOfBirth: 'Koforidua',
    policy: '',
    product: 'The Education Policy',
    premium: 320,
    sumAssured: 130000,
    commencementDate: '2024-08-13',
    expiryDate: '2042-08-13',
    policyTerm: 18,
    premiumTerm: 18,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0278899001',
    serial: '2013',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [],
    contingentBeneficiaries: [],
    bankName: 'GCB Bank PLC',
    payerName: 'Mrs. Victoria A. Amponsah',
    bankAccountNumber: '2829303132333',
    sortCode: '040105',
    narration: 'AUG 2024 PREMIUM',
  },
  {
    id: 14,
    client: 'Mr. Charles Danso',
    placeOfBirth: 'Accra',
    policy: '',
    product: 'Buy Term and Invest in Mutual Fund',
    premium: 600,
    sumAssured: 350000,
    commencementDate: '2024-08-14',
    expiryDate: '2054-08-14',
    policyTerm: 30,
    premiumTerm: 25,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0554433221',
    serial: '2014',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [],
    contingentBeneficiaries: [],
    bankName: 'Absa Bank Ghana Limited',
    payerName: 'Mr. Charles Danso',
    bankAccountNumber: '3435363738394',
    sortCode: '030104',
    narration: 'AUG 2024 PREMIUM',
  },
  {
    id: 15,
    client: 'Ms. Linda Acheampong',
    placeOfBirth: 'Kumasi',
    policy: '',
    product: 'The Education Policy',
    premium: 290,
    sumAssured: 115000,
    commencementDate: '2024-08-15',
    expiryDate: '2039-08-15',
    policyTerm: 15,
    premiumTerm: 15,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0243219876',
    serial: '2015',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [],
    contingentBeneficiaries: [],
    bankName: 'CalBank PLC',
    payerName: 'Ms. Linda Acheampong',
    bankAccountNumber: '4041424344455',
    sortCode: '140104',
    narration: 'AUG 2024 PREMIUM',
  },
   {
    id: 16,
    client: 'Mr. Benjamin Tetteh',
    placeOfBirth: 'Accra',
    policy: '',
    product: 'Buy Term and Invest in Mutual Fund',
    premium: 220,
    sumAssured: 120000,
    commencementDate: '2024-08-16',
    expiryDate: '2044-08-16',
    policyTerm: 20,
    premiumTerm: 15,
    onboardingStatus: 'Pending First Premium',
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: '0208765432',
    serial: '2016',
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created' }],
    primaryBeneficiaries: [],
    contingentBeneficiaries: [],
    bankName: 'GCB Bank PLC',
    payerName: 'Mr. Benjamin Tetteh',
    bankAccountNumber: '4647484950516',
    sortCode: '040106',
    narration: 'AUG 2024 PREMIUM',
  }
];
