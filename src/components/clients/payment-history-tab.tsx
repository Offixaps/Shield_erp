
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
import type { NewBusiness, Bill } from '@/lib/data';

type PaymentHistoryTabProps = {
  client: NewBusiness;
};

export default function PaymentHistoryTab({ client }: PaymentHistoryTabProps) {
  const getStatusBadgeColor = (status: Bill['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-500/80';
      case 'Unpaid':
        return 'bg-yellow-500/80';
      default:
        return 'bg-gray-500/80';
    }
  };

  const getPaymentDate = (bill: Bill) => {
    if (bill.status === 'Paid' && bill.paymentId) {
      const payment = client.payments.find(p => p.id === bill.paymentId);
      return payment ? format(new Date(payment.paymentDate), 'PPP') : 'N/A';
    }
    return 'N/A';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        {client.bills && client.bills.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill Description</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount (GHS)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {client.bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>{bill.description}</TableCell>
                  <TableCell>{format(new Date(bill.dueDate), 'PPP')}</TableCell>
                  <TableCell className="text-right">{bill.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        'w-24 justify-center',
                        getStatusBadgeColor(bill.status),
                        'text-white'
                      )}
                    >
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{getPaymentDate(bill)}</TableCell>
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
