





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

export type NewBusiness = {
  id: number;
  client: string;
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
};


export const newBusinessData: NewBusiness[] = [
  { 
    id: 1, 
    client: "Mr John K. Doe", 
    policy: "T1166017", 
    product: "Buy Term and Invest in Mutual Fund", 
    premium: 150.00, 
    sumAssured: 50000,
    commencementDate: "2024-07-01", 
    expiryDate: "2034-07-01",
    policyTerm: 10,
    premiumTerm: 5,
    onboardingStatus: "Pending First Premium",
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "024 123 4567", 
    serial: "1234",
    bills: [
      { id: 1, policyId: 1, amount: 150.00, dueDate: "2024-07-01", status: "Unpaid", description: "First Premium" }
    ],
    payments: []
  },
  { 
    id: 2,
    client: "Mrs Jane Smith", 
    policy: "E1274718", 
    product: "The Education Policy", 
    premium: 220.50, 
    sumAssured: 75000,
    commencementDate: "2024-07-05", 
    expiryDate: "2044-07-05",
    policyTerm: 20,
    premiumTerm: 10,
    onboardingStatus: "Pending Mandate", 
    billingStatus: 'Outstanding',
    policyStatus: 'Inactive',
    mandateVerified: false,
    firstPremiumPaid: false,
    medicalUnderwritingState: { started: false, completed: false },
    phone: "024 123 4568", 
    serial: "1235",
    bills: [],
    payments: []
  },
  { 
    id: 3, 
    client: "Acme Corp", 
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
    payments: []
  },
  { 
    id: 4, 
    client: "Mr Mike Johnson", 
    policy: "E1274719", 
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
    mandateVerified: true,
    firstPremiumPaid: true,
    medicalUnderwritingState: { started: true, completed: true },
    phone: "024 123 4570", 
    serial: "1237",
    bills: [],
    payments: []
  },
  { 
    id: 5, 
    client: "Miss Emily White", 
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
    payments: []
  },
  { 
    id: 6, 
    client: "Dr Chris Brown", 
    policy: "E1274720", 
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
    ]
  },
  { 
    id: 7, 
    client: "Prof Sarah Connor", 
    policy: "T1166021", 
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
    phone: "024 123 4573", 
    serial: "1240",
    bills: [],
    payments: []
  }
];

    