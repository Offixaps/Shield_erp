import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import NewBusinessTable from '@/components/sales/new-business-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { newBusinessData } from '@/lib/data';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

export default function NewBusinessPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New Business Review"
        description="A list of new policies pending review and activation."
      />
      <Card>
        <CardContent className="pt-6">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Policy #</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Commencement Date</TableHead>
                <TableHead>Approval Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newBusinessData.map((business, index) => (
                <TableRow key={business.id}>
                  <TableCell>{index + 1}</TableCell>
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
                        business.status === 'Approved' && 'bg-green-500/80',
                        business.status === 'Pending' && 'bg-yellow-500/80',
                        business.status === 'Declined' && 'bg-red-500/80',
                        'text-white'
                      )}
                      variant={business.status === 'Approved' ? 'default' : 'secondary'}
                    >
                      {business.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {business.status === 'Pending' && (
                      <div className="flex gap-2 justify-end">
                        <Button size="sm">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="mr-2 h-4 w-4" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
