
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
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

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

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="p-3">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-base font-semibold">{value}</p>
      </CardHeader>
    </Card>
  );
}

export default function PaymentHistoryTab({ client }: PaymentHistoryTabProps) {
  const { transactions, totalDebit, totalCredit, finalBalance, totalPaid, totalOutstanding, initialPremium } = React.useMemo(() => {
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

    const totalPaid = (client.payments || []).reduce((sum, p) => sum + p.amount, 0);
    const totalOutstanding = (client.bills || []).filter(b => b.status === 'Unpaid').reduce((sum, b) => sum + b.amount, 0);
    const firstBill = (client.bills || []).find(b => b.description === 'First Premium');
    const initialPremium = firstBill ? firstBill.amount : client.premium;

    return {
        transactions: processedTransactions,
        totalDebit,
        totalCredit,
        finalBalance: runningBalance,
        totalPaid,
        totalOutstanding,
        initialPremium,
    }

  }, [client.bills, client.payments, client.premium]);

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
    <div className="space-y-6">
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Total Premiums Paid" value={`GHS ${totalPaid.toFixed(2)}`} />
            <StatCard title="Outstanding Premium" value={`GHS ${totalOutstanding.toFixed(2)}`} />
            <StatCard title="Initial Premium" value={`GHS ${initialPremium.toFixed(2)}`} />
            <StatCard title="Current Premium" value={`GHS ${client.premium.toFixed(2)}`} />
            <StatCard title="Initial Sum Assured" value={`GHS ${(client.initialSumAssured || client.sumAssured).toFixed(2)}`} />
            <StatCard title="Current Sum Assured" value={`GHS ${client.sumAssured.toFixed(2)}`} />
       </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Financial History</CardTitle>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Generate Statement
          </Button>
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
    </div>
  );
}
