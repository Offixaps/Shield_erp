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
import { FilePenLine } from 'lucide-react';

export default function NewBusinessTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Policy #</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Premium</TableHead>
          <TableHead>Commencement Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {newBusinessData.map((business) => (
          <TableRow key={business.id}>
            <TableCell>
              <div className="font-medium">{business.client}</div>
            </TableCell>
            <TableCell>
              <Link href={`/business-development/clients/${business.id}`} className="text-primary hover:underline">
                {business.policy}
              </Link>
            </TableCell>
            <TableCell>
              {business.product}
            </TableCell>
            <TableCell>
              GHS{business.premium.toFixed(2)}
            </TableCell>
            <TableCell>
              {format(new Date(business.commencementDate), 'PPP')}
            </TableCell>
            <TableCell>
              <Badge
                className={cn(
                  business.status === 'Active' && 'bg-green-500/80',
                  business.status === 'Pending' && 'bg-yellow-500/80',
                  'text-white'
                )}
                variant={business.status === 'Active' ? 'default' : 'secondary'}
              >
                {business.status}
              </Badge>
            </TableCell>
             <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <FilePenLine className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
