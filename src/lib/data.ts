







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
  bankName: string;
  payerName: string;
  bankAccountNumber: string;
  sortCode: string;
  narration: string;
};


export const newBusinessData: NewBusiness[] = [
  { 
    id: 1, 
    client: "Mr John K. Doe",
    placeOfBirth: "Accra", 
    policy: "T1166017", 
    product: "Buy Term and Invest in Mutual Fund", 
    premium: 150.00, 
    sumAssured: 50000,
    commencementDate: "2024-07-01", 
    expiryDate: "2034-07-01",
    policyTerm: 10,
    premiumTerm: 5,
    onboardingStatus: "Mandate Verified",
    billingStatus: 'Up to Date',
    policyStatus: 'Active',
    mandateVerified: true,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: true, completed: true },
    phone: "024 123 4567", 
    serial: "1234",
    bills: [],
    payments: [],
    activityLog: [],
    bankName: 'GCB Bank PLC',
    payerName: 'Mr John K. Doe',
    bankAccountNumber: '1234567890123',
    sortCode: '123456',
    narration: 'JULY 2024 PREMIUM',
  },
  { 
    id: 2,
    client: "Mrs Jane Smith",
    placeOfBirth: "Kumasi", 
    policy: "E1274718", 
    product: "The Education Policy", 
    premium: 220.50, 
    sumAssured: 75000,
    commencementDate: "2024-07-05", 
    expiryDate: "2044-07-05",
    policyTerm: 20,
    premiumTerm: 10,
    onboardingStatus: "Mandate Verified", 
    billingStatus: 'Up to Date',
    policyStatus: 'Active',
    mandateVerified: true,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: true, completed: true },
    phone: "024 123 4568", 
    serial: "1235",
    bills: [],
    payments: [],
    activityLog: [],
    bankName: 'Absa Bank Ghana Limited',
    payerName: 'Mrs Jane Smith',
    bankAccountNumber: '0987654321098',
    sortCode: '654321',
    narration: 'JULY 2024 PREMIUM',
  },
  { 
    id: 3, 
    client: "Acme Corp",
    placeOfBirth: "Tema", 
    policy: "T1166018",
    product: "Buy Term and Invest in Mutual Fund", 
    premium: 1200.00, 
    sumAssured: 1000000,
    commencementDate: "2024-06-20",
    expiryDate: "2054-06-20",
    policyTerm: 30,
    premiumTerm: 20,
    onboardingStatus: "Mandate Verified",
    billingStatus: 'Up to Date',
    policyStatus: 'Active',
    mandateVerified: true,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: true, completed: true },
    phone: "024 123 4569", 
    serial: "1236",
    bills: [],
    payments: [],
    activityLog: [
       { date: "2024-06-21T09:00:00Z", user: "System", action: "Onboarding status changed to Mandate Verified." },
       { date: "2024-06-21T09:00:01Z", user: "System", action: "Policy status changed to Active." }
    ],
    bankName: 'Stanbic Bank Ghana Limited',
    payerName: 'Acme Corp',
    bankAccountNumber: '1122334455667',
    sortCode: '112233',
    narration: 'JULY 2024 PREMIUM',
  },
  { 
    id: 4, 
    client: "Mr Mike Johnson",
    placeOfBirth: "Takoradi", 
    policy: "", 
    product: "The Education Policy", 
    premium: 85.75, 
    sumAssured: 30000,
    commencementDate: "2024-07-10", 
    expiryDate: "2039-07-10",
    policyTerm: 15,
    premiumTerm: 15,
    onboardingStatus: "Declined",
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: true, completed: true },
    phone: "024 123 4570", 
    serial: "1237",
    bills: [],
    payments: [],
    activityLog: [
       { date: "2024-07-11T15:00:00Z", user: "Underwriting", action: "Onboarding status changed to Declined.", details: "Risk profile too high." }
    ],
    bankName: 'Fidelity Bank Ghana Limited',
    payerName: 'Mr Mike Johnson',
    bankAccountNumber: '2233445566778',
    sortCode: '223344',
    narration: 'JULY 2024 PREMIUM',
  },
  { 
    id: 5, 
    client: "Miss Emily White",
    placeOfBirth: "Cape Coast", 
    policy: "T1166019", 
    product: "Buy Term and Invest in Mutual Fund", 
    premium: 300.00, 
    sumAssured: 150000,
    commencementDate: "2024-06-15", 
    expiryDate: "2034-06-15",
    policyTerm: 10,
    premiumTerm: 10,
    onboardingStatus: "Mandate Verified",
    billingStatus: 'Up to Date',
    policyStatus: 'Active',
    mandateVerified: true,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: true, completed: true },
    phone: "024 123 4571", 
    serial: "1238",
    bills: [],
    payments: [],
    activityLog: [
       { date: "2024-06-16T09:00:00Z", user: "System", action: "Onboarding status changed to Mandate Verified." },
       { date: "2024-06-16T09:00:01Z", user: "System", action: "Policy status changed to Active." }
    ],
    bankName: 'Ecobank Ghana PLC',
    payerName: 'Miss Emily White',
    bankAccountNumber: '3344556677889',
    sortCode: '334455',
    narration: 'JULY 2024 PREMIUM',
  },
  { 
    id: 6,
    client: "Dr Chris Brown",
    placeOfBirth: "Ho", 
    policy: "", 
    product: "The Education Policy", 
    premium: 175.00, 
    sumAssured: 60000,
    commencementDate: "2024-07-12", 
    expiryDate: "2044-07-12",
    policyTerm: 20,
    premiumTerm: 10,
    onboardingStatus: "First Premium Confirmed", 
    billingStatus: 'First Premium Paid',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "024 123 4572", 
    serial: "1239",
    bills: [
      { id: 1, policyId: 6, amount: 175.00, dueDate: "2024-07-12", status: 'Paid', paymentId: 1, description: 'First Premium' }
    ],
    payments: [
      { id: 1, policyId: 6, billId: 1, amount: 175.00, paymentDate: '2024-07-13', method: 'Mobile Money', transactionId: 'MM12345' }
    ],
    activityLog: [
      { date: "2024-07-13T10:00:00Z", user: "Premium Admin", action: "First Premium Confirmed", details: "Payment of GHS 175.00 received via Mobile Money." },
      { date: "2024-07-13T10:00:01Z", user: "System", action: "Status changed to Pending Vetting." }
    ],
    bankName: 'CalBank PLC',
    payerName: 'Dr Chris Brown',
    bankAccountNumber: '4455667788990',
    sortCode: '445566',
    narration: 'JULY 2024 PREMIUM',
  },
  { 
    id: 7, 
    client: "Prof Sarah Connor",
    placeOfBirth: "Sunyani", 
    policy: "", 
    product: "Buy Term and Invest in Mutual Fund", 
    premium: 250.00, 
    sumAssured: 100000,
    commencementDate: "2024-07-18", 
    expiryDate: "2044-07-18",
    policyTerm: 20,
    premiumTerm: 15,
    onboardingStatus: "NTU", 
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: true, startDate: "2024-07-20", completed: false },
    phone: "024 123 4573", serial: "1240",
    bills: [],
    payments: [],
    activityLog: [
      { date: "2024-07-22T12:00:00Z", user: "Underwriting", action: "Onboarding status changed to NTU.", details: "Not taken up by client." }
    ],
    bankName: 'United Bank for Africa (Ghana) Limited',
    payerName: 'Prof Sarah Connor',
    bankAccountNumber: '5566778899001',
    sortCode: '556677',
    narration: 'JULY 2024 PREMIUM',
  },
  {
    id: 8,
    client: 'Mr Kwabena A. Darko',
    placeOfBirth: "Accra",
    policy: 'T1166022',
    product: 'Buy Term and Invest in Mutual Fund',
    premium: 500.00,
    sumAssured: 200000,
    commencementDate: '2024-05-01',
    expiryDate: '2034-05-01',
    policyTerm: 10,
    premiumTerm: 10,
    onboardingStatus: 'Mandate Verified',
    billingStatus: 'Up to Date',
    policyStatus: 'Active',
    mandateVerified: true,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: true, completed: true },
    phone: '020 111 2222',
    serial: '1241',
    bills: [],
    payments: [],
    activityLog: [
      { date: '2024-05-02T09:00:00Z', user: 'System', action: 'Onboarding status changed to Mandate Verified.' },
      { date: '2024-05-02T09:00:01Z', user: 'System', action: 'Policy status changed to Active.' }
    ],
    bankName: 'Absa Bank Ghana Limited',
    payerName: 'Mr Kwabena A. Darko',
    bankAccountNumber: '1010101010101',
    sortCode: '101010',
    narration: 'JULY 2024 PREMIUM',
  },
  {
    id: 9,
    client: 'Ms. Adwoa P. Williams',
    placeOfBirth: "Accra",
    policy: 'E1274721',
    product: 'The Education Policy',
    premium: 350.00,
    sumAssured: 100000,
    commencementDate: '2024-04-15',
    expiryDate: '2044-04-15',
    policyTerm: 20,
    premiumTerm: 15,
    onboardingStatus: 'Mandate Verified',
    billingStatus: 'Up to Date',
    policyStatus: 'Active',
    mandateVerified: true,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: true, completed: true },
    phone: '055 333 4444',
    serial: '1242',
    bills: [],
    payments: [],
    activityLog: [
      { date: '2024-04-16T09:00:00Z', user: 'System', action: 'Onboarding status changed to Mandate Verified.' },
      { date: '2024-04-16T09:00:01Z', user: 'System', action: 'Policy status changed to Active.' }
    ],
    bankName: 'Republic Bank (Ghana) PLC',
    payerName: 'Ms. Adwoa P. Williams',
    bankAccountNumber: '2020202020202',
    sortCode: '202020',
    narration: 'JULY 2024 PREMIUM',
  },
  {
    id: 10,
    client: 'Alhaji Musa Ibrahim',
    placeOfBirth: "Accra",
    policy: 'T1166023',
    product: 'Buy Term and Invest in Mutual Fund',
    premium: 1000.00,
    sumAssured: 500000,
    commencementDate: '2024-03-01',
    expiryDate: '2044-03-01',
    policyTerm: 20,
    premiumTerm: 20,
    onboardingStatus: 'Mandate Verified',
    billingStatus: 'Up to Date',
    policyStatus: 'Active',
    mandateVerified: true,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: true, completed: true },
    phone: '027 555 6666',
    serial: '1243',
    bills: [],
    payments: [],
    activityLog: [
      { date: '2024-03-02T09:00:00Z', user: 'System', action: 'Onboarding status changed to Mandate Verified.' },
      { date: '2024-03-02T09:00:01Z', user: 'System', action: 'Policy status changed to Active.' }
    ],
    bankName: 'Zenith Bank (Ghana) Limited',
    payerName: 'Alhaji Musa Ibrahim',
    bankAccountNumber: '3030303030303',
    sortCode: '303030',
    narration: 'JULY 2024 PREMIUM',
  },
  {
    id: 11,
    client: 'Mrs. Grace Ofori-Atta',
    placeOfBirth: "Accra",
    policy: 'E1274722',
    product: 'The Education Policy',
    premium: 450.50,
    sumAssured: 150000,
    commencementDate: '2024-02-10',
    expiryDate: '2039-02-10',
    policyTerm: 15,
    premiumTerm: 10,
    onboardingStatus: 'Mandate Verified',
    billingStatus: 'Up to Date',
    policyStatus: 'Active',
    mandateVerified: true,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: true, completed: true },
    phone: '026 777 8888',
    serial: '1244',
    bills: [],
    payments: [],
    activityLog: [
      { date: '2024-02-11T09:00:00Z', user: 'System', action: 'Onboarding status changed to Mandate Verified.' },
      { date: '2024-02-11T09:00:01Z', user: 'System', action: 'Policy status changed to Active.' }
    ],
    bankName: 'Consolidated Bank Ghana Limited',
    payerName: 'Mrs. Grace Ofori-Atta',
    bankAccountNumber: '4040404040404',
    sortCode: '404040',
    narration: 'JULY 2024 PREMIUM',
  },
  { 
    id: 12, 
    client: "Mr David Ayer",
    placeOfBirth: "Koforidua", 
    policy: "", 
    product: "Buy Term and Invest in Mutual Fund", 
    premium: 100.00, 
    sumAssured: 40000,
    commencementDate: "2024-08-01", 
    expiryDate: "2034-08-01",
    policyTerm: 10,
    premiumTerm: 10,
    onboardingStatus: "Pending First Premium",
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "020 999 8877", 
    serial: "1245",
    bills: [],
    payments: [],
    activityLog: [{ date: new Date().toISOString(), user: "Sales Agent", action: "Policy Created" }],
    bankName: 'GCB Bank PLC',
    payerName: 'Mr David Ayer',
    bankAccountNumber: '5050505050505',
    sortCode: '505050',
    narration: 'AUG 2024 PREMIUM',
  },
  { 
    id: 13, 
    client: "Ms Fiona Shrek",
    placeOfBirth: "Aflao", 
    policy: "", 
    product: "The Education Policy", 
    premium: 250.00, 
    sumAssured: 80000,
    commencementDate: "2024-08-05", 
    expiryDate: "2044-08-05",
    policyTerm: 20,
    premiumTerm: 15,
    onboardingStatus: "Pending Vetting",
    billingStatus: 'First Premium Paid',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "050 111 2233", 
    serial: "1246",
    bills: [],
    payments: [],
    activityLog: [
        { date: "2024-08-04T10:00:00Z", user: "Sales Agent", action: "Policy Created" },
        { date: "2024-08-05T11:00:00Z", user: "Premium Admin", action: "First Premium Confirmed" },
        { date: "2024-08-05T11:00:01Z", user: "System", action: "Status changed to Pending Vetting" }
    ],
    bankName: 'Access Bank (Ghana) Plc',
    payerName: 'Ms Fiona Shrek',
    bankAccountNumber: '6060606060606',
    sortCode: '606060',
    narration: 'AUG 2024 PREMIUM',
  },
  { 
    id: 14, 
    client: "Hon. Peter Pan",
    placeOfBirth: "Tamale", 
    policy: "", 
    product: "Buy Term and Invest in Mutual Fund", 
    premium: 500.00, 
    sumAssured: 250000,
    commencementDate: "2024-08-10", 
    expiryDate: "2054-08-10",
    policyTerm: 30,
    premiumTerm: 20,
    onboardingStatus: "Vetting Completed",
    billingStatus: 'First Premium Paid',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "023 444 5566", 
    serial: "1247",
    bills: [],
    payments: [],
    activityLog: [
      { date: "2024-08-09T14:00:00Z", user: "Underwriting", action: "Vetting Completed" }
    ],
    bankName: 'FBNBank (Ghana) Limited',
    payerName: 'Hon. Peter Pan',
    bankAccountNumber: '7070707070707',
    sortCode: '707070',
    narration: 'AUG 2024 PREMIUM',
  },
  { 
    id: 15, 
    client: "Dr. Wendy Darling",
    placeOfBirth: "Bolgatanga", 
    policy: "", 
    product: "The Education Policy", 
    premium: 300.00, 
    sumAssured: 120000,
    commencementDate: "2024-08-15", 
    expiryDate: "2039-08-15",
    policyTerm: 15,
    premiumTerm: 15,
    onboardingStatus: "Pending Medicals",
    billingStatus: 'First Premium Paid',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: true, startDate: "2024-08-16T09:00:00Z", completed: false },
    phone: "028 987 6543", 
    serial: "1248",
    bills: [],
    payments: [],
    activityLog: [
      { date: "2024-08-16T09:00:00Z", user: "Underwriting", action: "Status changed to Pending Medicals" }
    ],
    bankName: 'Guaranty Trust Bank (Ghana) Limited',
    payerName: 'Dr. Wendy Darling',
    bankAccountNumber: '8080808080808',
    sortCode: '808080',
    narration: 'AUG 2024 PREMIUM',
  },
  { 
    id: 16, 
    client: "Captain James Hook",
    placeOfBirth: "Sekondi", 
    policy: "", 
    product: "Buy Term and Invest in Mutual Fund", 
    premium: 750.00, 
    sumAssured: 400000,
    commencementDate: "2024-08-20", 
    expiryDate: "2044-08-20",
    policyTerm: 20,
    premiumTerm: 20,
    onboardingStatus: "Rework Required",
    billingStatus: 'First Premium Paid',
    policyStatus: 'Inactive',
    vettingNotes: 'ID information is blurry. Please re-upload a clearer copy of the National ID.',
    mandateVerified: false,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "054 123 9876", 
    serial: "1249",
    bills: [],
    payments: [],
    activityLog: [
       { date: "2024-08-19T16:00:00Z", user: "Underwriting", action: "Status changed to Rework Required", details: "ID information is blurry." }
    ],
    bankName: 'Prudential Bank Limited',
    payerName: 'Captain James Hook',
    bankAccountNumber: '9090909090909',
    sortCode: '909090',
    narration: 'AUG 2024 PREMIUM',
  }
];

    

    




    


