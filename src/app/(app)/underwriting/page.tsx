
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { FileClock, FileCheck, FileX, Clock } from 'lucide-react';
import PageHeader from '@/components/page-header';
import NewBusinessTable from '@/components/sales/new-business-table';
import { getPolicies } from '@/lib/policy-service';
import type { NewBusiness } from '@/lib/data';
import { differenceInDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const iconMap = {
  pending: FileClock,
  approved: FileCheck,
  declined: FileX,
  turnaround: Clock,
};

type UnderwritingStats = {
    pending: number;
    approvedMonth: number;
    declinedMonth: number;
    avgTurnaroundTime: string;
};

export default function UnderwritingPage() {
  const [stats, setStats] = React.useState<UnderwritingStats>({
    pending: 0,
    approvedMonth: 0,
    declinedMonth: 0,
    avgTurnaroundTime: 'N/A',
  });
  const [pendingPolicies, setPendingPolicies] = React.useState<NewBusiness[]>([]);


  React.useEffect(() => {
    const policies = getPolicies();
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    const pendingStatuses: NewBusiness['onboardingStatus'][] = ['Pending Vetting', 'Pending Medicals', 'Pending Decision'];
    const pending = policies.filter(p => pendingStatuses.includes(p.onboardingStatus)).length;
    setPendingPolicies(policies.filter(p => pendingStatuses.includes(p.onboardingStatus)));

    let approvedMonth = 0;
    let declinedMonth = 0;
    const turnaroundTimes: number[] = [];

    policies.forEach(policy => {
      const acceptedLog = policy.activityLog.find(log => log.action === 'Status changed to Accepted');
      const declinedLog = policy.activityLog.find(log => log.action === 'Status changed to Declined');
      const creationLog = policy.activityLog.find(log => log.action === 'Policy Created');

      if (acceptedLog) {
        const acceptedDate = new Date(acceptedLog.date);
        if (isWithinInterval(acceptedDate, { start: monthStart, end: monthEnd })) {
          approvedMonth++;
        }
        if (creationLog) {
            turnaroundTimes.push(differenceInDays(acceptedDate, new Date(creationLog.date)));
        }
      }

      if (declinedLog) {
        const declinedDate = new Date(declinedLog.date);
        if (isWithinInterval(declinedDate, { start: monthStart, end: monthEnd })) {
          declinedMonth++;
        }
        if (creationLog) {
            turnaroundTimes.push(differenceInDays(declinedDate, new Date(creationLog.date)));
        }
      }
    });
    
    const avgTurnaroundTime = turnaroundTimes.length > 0
      ? (turnaroundTimes.reduce((a, b) => a + b, 0) / turnaroundTimes.length).toFixed(1) + ' days'
      : 'N/A';

    setStats({
      pending,
      approvedMonth,
      declinedMonth,
      avgTurnaroundTime,
    });
  }, []);

  const statsCards = [
    {
      key: 'pending',
      title: 'Applications Pending',
      value: stats.pending.toString(),
      change: 'Awaiting underwriting action',
    },
    {
      key: 'approved',
      title: 'Applications Approved (Month)',
      value: stats.approvedMonth.toString(),
      change: 'Policies accepted this month',
    },
    {
      key: 'declined',
      title: 'Applications Declined (Month)',
      value: stats.declinedMonth.toString(),
      change: 'Policies declined this month',
    },
    {
      key: 'turnaround',
      title: 'Avg. Turnaround Time',
      value: stats.avgTurnaroundTime,
      change: 'From creation to decision',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Underwriting Dashboard" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
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
           <CardDescription>
            A table of applications awaiting underwriting review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewBusinessTable />
        </CardContent>
      </Card>
    </div>
  );
}
