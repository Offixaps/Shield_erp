
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { NewBusiness, Bill, Payment } from '@/lib/data';

type PaymentHistoryTabProps = {
  client: NewBusiness;
};

type Transaction = {
  date: Date;
  description: string;
  debit: number;
  credit: number;
  balance: number;
};

export default function PaymentHistoryTab({ client }: PaymentHistoryTabProps) {
  const transactions = React.useMemo(() => {
    const combined: (
      | { type: 'bill'; data: Bill }
      | { type: 'payment'; data: Payment }
    )[] = [
      ...(client.bills || []).map((bill) => ({ type: 'bill' as const, data: bill })),
      ...(client.payments || []).map((payment) => ({ type: 'payment' as const, data: payment })),
    ];

    combined.sort((a, b) => {
      const dateA = new Date(a.type === 'bill' ? a.data.dueDate : a.data.paymentDate);
      const dateB = new Date(b.type === 'bill' ? b.data.dueDate : b.data.paymentDate);
      return dateA.getTime() - dateB.getTime();
    });

    let runningBalance = 0;
    return combined.map((item) => {
      if (item.type === 'bill') {
        runningBalance -= item.data.amount;
        return {
          date: new Date(item.data.dueDate),
          description: item.data.description,
          debit: item.data.amount,
          credit: 0,
          balance: runningBalance,
        };
      } else {
        runningBalance += item.data.amount;
        return {
          date: new Date(item.data.paymentDate),
          description: `Payment - ${item.data.method} (${item.data.transactionId})`,
          debit: 0,
          credit: item.data.amount,
          balance: runningBalance,
        };
      }
    });
  }, [client.bills, client.payments]);

  const getBalanceColor = (balance: number) => {
    if (balance < 0) return 'text-destructive';
    if (balance > 0) return 'text-green-600';
    return 'text-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions && transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit (GHS)</TableHead>
                <TableHead className="text-right">Credit (GHS)</TableHead>
                <TableHead className="text-right">Balance (GHS)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{format(transaction.date, 'PPP')}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="text-right font-mono">
                    {transaction.debit > 0 ? transaction.debit.toFixed(2) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-mono text-green-600">
                    {transaction.credit > 0 ? transaction.credit.toFixed(2) : '-'}
                  </TableCell>
                  <TableCell className={cn("text-right font-semibold font-mono", getBalanceColor(transaction.balance))}>
                    {transaction.balance.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">
            No billing or payment history found for this policy.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
