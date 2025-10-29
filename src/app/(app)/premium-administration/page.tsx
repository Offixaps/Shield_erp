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
import { dashboardStats } from '@/lib/data';
import PremiumsChart from '@/components/dashboard/premiums-chart';
import RecentActivity from '@/components/dashboard/recent-activity';

const iconMap = {
  premiumsCollected: Banknote,
  outstandingPremiums: CircleDollarSign,
  reconciledPayments: CheckCircle,
  pendingReconciliation: Receipt,
};

export default function PremiumAdministrationPage() {
  const stats = [
    {
      key: 'premiumsCollected',
      title: 'Premiums Collected (Month)',
      value: `GHS${(dashboardStats.premiumsCollected / 1000).toFixed(1)}k`,
      change: '+8.1% from last month',
    },
    {
      key: 'outstandingPremiums',
      title: 'Outstanding Premiums',
      value: `GHS${(dashboardStats.outstandingPremiums / 1000).toFixed(1)}k`,
      change: '-2.5% from last month',
    },
    {
      key: 'reconciledPayments',
      title: 'Reconciled Payments',
      value: '1,830',
      change: '+150 this week',
    },
    {
      key: 'pendingReconciliation',
      title: 'Pending Reconciliation',
      value: '215',
      change: '+20 new',
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
            <PremiumsChart />
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
