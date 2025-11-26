
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Users,
  Banknote,
  Briefcase,
  CircleDollarSign,
} from 'lucide-react';
import PageHeader from '@/components/page-header';
import PremiumsChart from '@/components/dashboard/premiums-chart';
import PolicyDistributionChart from '@/components/dashboard/policy-distribution-chart';
import RecentActivity from '@/components/dashboard/recent-activity';
import { getPolicies } from '@/lib/policy-service';
import type { NewBusiness, OnboardingStatus } from '@/lib/data';

const iconMap = {
  totalClients: Users,
  premiumsCollected: Banknote,
  newBusiness: Briefcase,
  outstandingPremiums: CircleDollarSign,
};

export default function BusinessDevelopmentPage() {
  const [dashboardData, setDashboardData] = React.useState({
    totalClients: 0,
    premiumsCollected: 0,
    newBusiness: 0,
    outstandingPremiums: 0,
    premiumsChartData: [],
  });

  React.useEffect(() => {
    async function fetchData() {
        const policies = await getPolicies();
        if (!policies) return;

        const totalClients = policies.length;

        const premiumsCollected = policies.reduce((acc, policy) => {
        return acc + (policy.payments || []).reduce((sum, payment) => sum + payment.amount, 0);
        }, 0);

        const onboardingStatuses: OnboardingStatus[] = [
          'Pending First Premium',
          'First Premium Confirmed',
          'Pending Vetting',
          'Vetting Completed',
          'Rework Required',
          'Pending Medicals',
          'Medicals Completed',
          'Pending Decision',
          'Accepted',
          'Pending Mandate',
          'Mandate Rework Required',
        ];

        const newBusiness = policies
          .filter(p => onboardingStatuses.includes(p.onboardingStatus))
          .reduce((acc, policy) => Number(acc) + Number(policy.premium || 0), 0);
        
        const outstandingPremiums = policies.reduce((acc, policy) => {
            return acc + (policy.bills || [])
                .filter(bill => bill.status === 'Unpaid')
                .reduce((sum, bill) => sum + bill.amount, 0);
        }, 0);

        const monthlyData: { [key: string]: { collected: number; outstanding: number } } = {};
        
        policies.forEach(policy => {
        (policy.payments || []).forEach(payment => {
            const month = new Date(payment.paymentDate).toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!monthlyData[month]) monthlyData[month] = { collected: 0, outstanding: 0 };
            monthlyData[month].collected += payment.amount;
        });

        (policy.bills || []).filter(b => b.status === 'Unpaid').forEach(bill => {
            const month = new Date(bill.dueDate).toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!monthlyData[month]) monthlyData[month] = { collected: 0, outstanding: 0 };
            monthlyData[month].outstanding += bill.amount;
        });
        });

        const premiumsChartData = Object.entries(monthlyData)
        .map(([month, data]) => ({
            month: month.split(' ')[0], // Keep only month abbreviation
            collected: data.collected,
            outstanding: data.outstanding
        }))
        .sort((a,b) => new Date(`1 ${a.month} 2000`).getMonth() - new Date(`1 ${b.month} 2000`).getMonth())
        .slice(-7);


        setDashboardData({
        totalClients,
        premiumsCollected,
        newBusiness,
        outstandingPremiums,
        premiumsChartData: premiumsChartData as any,
        });
    }
    
    fetchData();
  }, []);

  const stats = [
    {
      key: 'totalClients',
      title: 'Total Clients',
      value: dashboardData.totalClients.toLocaleString(),
      change: 'All policies on book',
    },
    {
      key: 'premiumsCollected',
      title: 'Premiums Collected',
      value: `GHS ${dashboardData.premiumsCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: 'All-time collected',
    },
    {
      key: 'newBusiness',
      title: 'New Business (Pending)',
      value: `GHS ${dashboardData.newBusiness.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: 'Value of policies in onboarding',
    },
    {
      key: 'outstandingPremiums',
      title: 'Outstanding Premiums',
      value: `GHS ${dashboardData.outstandingPremiums.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: 'All unpaid bills',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Business Development Dashboard" />
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
            <CardTitle>Premiums Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <PremiumsChart data={dashboardData.premiumsChartData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Policy Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PolicyDistributionChart />
          </CardContent>
        </Card>
      </div>
      <RecentActivity />
    </div>
  );
}
