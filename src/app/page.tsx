import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Users,
  Banknote,
  UserCheck,
  UserX,
  Briefcase,
  CircleDollarSign,
} from 'lucide-react';
import PageHeader from '@/components/page-header';
import { dashboardStats } from '@/lib/data';
import PremiumsChart from '@/components/dashboard/premiums-chart';
import PolicyDistributionChart from '@/components/dashboard/policy-distribution-chart';
import RecentActivity from '@/components/dashboard/recent-activity';

const iconMap = {
  totalClients: Users,
  premiumsCollected: Banknote,
  activeClients: UserCheck,
  inactiveClients: UserX,
  newBusiness: Briefcase,
  outstandingPremiums: CircleDollarSign,
};

export default function Home() {
  const stats = [
    {
      key: 'totalClients',
      title: 'Total Clients',
      value: dashboardStats.totalClients,
      change: '+2.5%',
    },
    {
      key: 'premiumsCollected',
      title: 'Premiums Collected',
      value: `\$${(dashboardStats.premiumsCollected / 1000).toFixed(1)}k`,
      change: '+10.2%',
    },
    {
      key: 'newBusiness',
      title: 'New Business',
      value: `\$${(dashboardStats.newBusiness / 1000).toFixed(1)}k`,
      change: '+5% this month',
    },
    {
      key: 'outstandingPremiums',
      title: 'Outstanding Premiums',
      value: `\$${(dashboardStats.outstandingPremiums / 1000).toFixed(1)}k`,
      change: '-3.1%',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" />
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
            <PremiumsChart />
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
