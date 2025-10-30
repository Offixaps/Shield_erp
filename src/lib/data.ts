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

export const newBusinessData = [
  { id: 1, client: "John Doe", policy: "T1166017", product: "Buy Term and Invest in Mutual Fund", premium: 150.00, commencementDate: "2024-07-01", status: "Pending", phone: "024 123 4567" },
  { id: 2, client: "Jane Smith", policy: "E1274718", product: "The Education Policy", premium: 220.50, commencementDate: "2024-07-05", status: "Pending", phone: "024 123 4568" },
  { id: 3, client: "Acme Corp", policy: "T1166018", product: "Buy Term and Invest in Mutual Fund", premium: 1200.00, commencementDate: "2024-06-20", status: "Approved", phone: "024 123 4569" },
  { id: 4, client: "Mike Johnson", policy: "E1274719", product: "The Education Policy", premium: 85.75, commencementDate: "2024-07-10", status: "Declined", phone: "024 123 4570" },
  { id: 5, client: "Emily White", policy: "T1166019", product: "Buy Term and Invest in Mutual Fund", premium: 300.00, commencementDate: "2024-06-15", status: "Approved", phone: "024 123 4571" },
  { id: 6, client: "Chris Brown", policy: "E1274720", product: "The Education Policy", premium: 175.00, commencementDate: "2024-07-12", status: "Pending", phone: "024 123 4572" },
];
