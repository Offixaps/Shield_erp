import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileClock, FileCheck, FileX, Clock } from 'lucide-react';
import PageHeader from '@/components/page-header';
import RecentActivity from '@/components/dashboard/recent-activity';

const iconMap = {
  pending: FileClock,
  approved: FileCheck,
  declined: FileX,
  turnaround: Clock,
};

export default function UnderwritingPage() {
  const stats = [
    {
      key: 'pending',
      title: 'Applications Pending',
      value: '78',
      change: '+5 from yesterday',
    },
    {
      key: 'approved',
      title: 'Applications Approved (Month)',
      value: '345',
      change: '+12% from last month',
    },
    {
      key: 'declined',
      title: 'Applications Declined (Month)',
      value: '32',
      change: '-5% from last month',
    },
    {
      key: 'turnaround',
      title: 'Avg. Turnaround Time',
      value: '2.5 days',
      change: 'Improving',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Underwriting Dashboard" />
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
       <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A table of applications awaiting underwriting review will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
