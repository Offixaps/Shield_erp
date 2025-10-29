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
    { id: 1, client: "John Doe", policy: "POL-00123", amount: 150.00, status: "Paid" },
    { id: 2, client: "Jane Smith", policy: "POL-00456", amount: 220.50, status: "Pending" },
    { id: 3, client: "Acme Corp", policy: "POL-00789", amount: 1200.00, status: "Paid" },
    { id: 4, client: "Mike Johnson", policy: "POL-00112", amount: 85.75, status: "Overdue" },
    { id: 5, client: "Emily White", policy: "POL-00334", amount: 300.00, status: "Paid" },
];
