'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { newBusinessData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FilePenLine, Trash2 } from 'lucide-react';

export default function NewBusinessTable() {
  const [data, setData] = React.useState(newBusinessData);

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Serial #</TableHead>
          <TableHead>Telephone #</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Premium</TableHead>
          <TableHead>Commencement Date</TableHead>
          <TableHead>Approvals</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((business, index) => (
          <TableRow key={business.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <Link
                href={`/business-development/clients/${business.id}`}
                className="font-medium text-primary hover:underline"
              >
                {business.client}
              </Link>
            </TableCell>
            <TableCell>{business.serial}</TableCell>
            <TableCell>{business.phone}</TableCell>
            <TableCell>{business.product}</TableCell>
            <TableCell>GHS{business.premium.toFixed(2)}</TableCell>
            <TableCell>
              {format(new Date(business.commencementDate), 'PPP')}
            </TableCell>
            <TableCell>
              <Badge
                className={cn(
                  business.status === 'Approved' && 'bg-green-500/80',
                  business.status === 'Pending' && 'bg-yellow-500/80',
                  business.status === 'Declined' && 'bg-red-500/80',
                  'text-white'
                )}
                variant={
                  business.status === 'Approved' ? 'default' : 'secondary'
                }
              >
                {business.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/business-development/sales/${business.id}/edit`}>
                    <FilePenLine className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(business.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
