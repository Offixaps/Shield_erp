
'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { getPolicies } from '@/lib/policy-service';
import type { Payment, NewBusiness } from '@/lib/data';

type RecentPayment = {
    client: string;
    policy: string;
    amount: number;
    status: 'Paid';
    date: Date;
}

export default function RecentActivity() {
    const [recentActivityData, setRecentActivityData] = React.useState<RecentPayment[]>([]);

    React.useEffect(() => {
        async function fetchRecentActivity() {
            const policies = await getPolicies();
            if (!policies) return;

            const allPayments: RecentPayment[] = [];
            policies.forEach((policy: NewBusiness) => {
                if (policy.payments) {
                    policy.payments.forEach((payment: Payment) => {
                        allPayments.push({
                            client: policy.client,
                            policy: policy.policy,
                            amount: payment.amount,
                            status: 'Paid',
                            date: new Date(payment.paymentDate),
                        });
                    });
                }
            });

            allPayments.sort((a, b) => b.date.getTime() - a.date.getTime());
            setRecentActivityData(allPayments.slice(0, 5));
        }

        fetchRecentActivity();
    }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Premium Activity</CardTitle>
        <CardDescription>
          A log of the most recent premium payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead className="hidden sm:table-cell">Policy #</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivityData.length > 0 ? (
                recentActivityData.map((activity, index) => (
                <TableRow key={index}>
                    <TableCell>
                    <div className="font-medium">{activity.client}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                    {activity.policy}
                    </TableCell>
                    <TableCell className="text-right">
                    GHS{activity.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                    <Badge
                        className={cn(
                        'w-24 justify-center',
                        activity.status === 'Paid' && 'bg-green-500/80',
                        'text-white'
                        )}
                        variant={'default'}
                    >
                        {activity.status}
                    </Badge>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                        No recent premium activity.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
