
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
  method?: string;
  debit: number;
  credit: number;
  balance: number;
};

export default function PaymentHistoryTab({ client }: PaymentHistoryTabProps) {
  const { transactions, totalDebit, totalCredit, finalBalance } = React.useMemo(() => {
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
    let totalDebit = 0;
    let totalCredit = 0;

    const processedTransactions = combined.map((item) => {
      if (item.type === 'bill') {
        runningBalance -= item.data.amount;
        totalDebit += item.data.amount;
        return {
          date: new Date(item.data.dueDate),
          description: item.data.description,
          method: 'Billed',
          debit: item.data.amount,
          credit: 0,
          balance: runningBalance,
        };
      } else {
        runningBalance += item.data.amount;
        totalCredit += item.data.amount;
        return {
          date: new Date(item.data.paymentDate),
          description: `Payment Received (ID: ${item.data.transactionId})`,
          method: item.data.method,
          debit: 0,
          credit: item.data.amount,
          balance: runningBalance,
        };
      }
    });

    return {
        transactions: processedTransactions,
        totalDebit,
        totalCredit,
        finalBalance: runningBalance
    }

  }, [client.bills, client.payments]);

  const getBalanceColor = (balance: number) => {
    if (balance < 0) return 'text-destructive';
    if (balance > 0) return 'text-green-600';
    return 'text-foreground';
  };

  const getMethodDisplayName = (method: string) => {
    const map: Record<string, string> = {
      'mobile-money': 'Mobile Money',
      'bank-transfer': 'Bank Transfer',
      'payment-slip': 'Pay-In-Slip',
      'debit-order': 'Debit Order',
      'standing-order': 'Standing Order',
      'stop-order': 'Stop Order',
      'controller': 'Controller',
      'Billed': 'Billed'
    };
    return map[method] || method;
  }

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
                <TableHead>Month</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Debit (GHS)</TableHead>
                <TableHead className="text-right">Credit (GHS)</TableHead>
                <TableHead className="text-right">Balance (GHS)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{format(transaction.date, 'PPP')}</TableCell>
                  <TableCell>{format(transaction.date, 'MMM yyyy')}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.method ? getMethodDisplayName(transaction.method) : 'N/A'}</TableCell>
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
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={4} className="font-bold">Totals</TableCell>
                    <TableCell className="text-right font-bold font-mono">{totalDebit.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-bold font-mono text-green-600">{totalCredit.toFixed(2)}</TableCell>
                    <TableCell className={cn("text-right font-extrabold font-mono", getBalanceColor(finalBalance))}>{finalBalance.toFixed(2)}</TableCell>
                </TableRow>
            </TableFooter>
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
