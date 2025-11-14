
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Banknote,
  CircleDollarSign,
  Receipt,
  CheckCircle,
} from 'lucide-react';
import PageHeader from '@/components/page-header';
import PremiumsChart from '@/components/dashboard/premiums-chart';
import RecentActivity from '@/components/dashboard/recent-activity';
import { getPolicies } from '@/lib/policy-service';
import { isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

const iconMap = {
  premiumsCollected: Banknote,
  outstandingPremiums: CircleDollarSign,
  reconciledPayments: CheckCircle,
  pendingReconciliation: Receipt,
};

export default function PremiumAdministrationPage() {
  const [dashboardData, setDashboardData] = React.useState({
    premiumsCollectedMonth: 0,
    outstandingPremiums: 0,
    reconciledPaymentsCount: 0,
    pendingReconciliationCount: 0,
    premiumsChartData: [],
  });

  React.useEffect(() => {
    async function fetchData() {
        const policies = await getPolicies();
        const now = new Date();
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);

        let premiumsCollectedMonth = 0;
        let outstandingPremiums = 0;
        let reconciledPaymentsCount = 0;
        let pendingReconciliationCount = 0;
        const monthlyData: { [key: string]: { collected: number; outstanding: number } } = {};

        if (policies) {
            policies.forEach(policy => {
            (policy.payments || []).forEach(payment => {
                reconciledPaymentsCount++;
                const paymentDate = new Date(payment.paymentDate);
                if (isWithinInterval(paymentDate, { start: monthStart, end: monthEnd })) {
                premiumsCollectedMonth += payment.amount;
                }
                const month = new Date(payment.paymentDate).toLocaleString('default', { month: 'short', year: '2-digit' });
                if (!monthlyData[month]) monthlyData[month] = { collected: 0, outstanding: 0 };
                monthlyData[month].collected += payment.amount;
            });

            (policy.bills || []).forEach(bill => {
                if (bill.status === 'Unpaid') {
                outstandingPremiums += bill.amount;
                pendingReconciliationCount++;
                
                const month = new Date(bill.dueDate).toLocaleString('default', { month: 'short', year: '2-digit' });
                if (!monthlyData[month]) monthlyData[month] = { collected: 0, outstanding: 0 };
                monthlyData[month].outstanding += bill.amount;
                }
            });
            });
        }

        const premiumsChartData = Object.entries(monthlyData)
        .map(([month, data]) => ({
            month: month.split(' ')[0],
            collected: data.collected,
            outstanding: data.outstanding
        }))
        .sort((a,b) => new Date(`1 ${a.month} 2000`).getMonth() - new Date(`1 ${b.month} 2000`).getMonth())
        .slice(-7);

        setDashboardData({
        premiumsCollectedMonth,
        outstandingPremiums,
        reconciledPaymentsCount,
        pendingReconciliationCount,
        premiumsChartData: premiumsChartData as any,
        });
    }

    fetchData();
  }, []);

  const stats = [
    {
      key: 'premiumsCollected',
      title: 'Premiums Collected (Month)',
      value: `GHS ${dashboardData.premiumsCollectedMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: 'Current calendar month',
    },
    {
      key: 'outstandingPremiums',
      title: 'Outstanding Premiums',
      value: `GHS ${dashboardData.outstandingPremiums.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: 'All unpaid bills',
    },
    {
      key: 'reconciledPayments',
      title: 'Reconciled Payments',
      value: dashboardData.reconciledPaymentsCount.toLocaleString(),
      change: 'Total payments recorded',
    },
    {
      key: 'pendingReconciliation',
      title: 'Pending Reconciliation',
      value: dashboardData.pendingReconciliationCount.toLocaleString(),
      change: 'Total unpaid bills',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Premium Administration Dashboard" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = iconMap[stat.key as keyof typeof iconMap];
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Collections Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <PremiumsChart data={dashboardData.premiumsChartData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Recent Premium Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <RecentActivity />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
