
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
import { recentActivityData } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function RecentActivity() {
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
            {recentActivityData.map((activity) => (
              <TableRow key={activity.id}>
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
                      activity.status === 'Pending' && 'bg-yellow-500/80',
                      activity.status === 'Overdue' && 'bg-red-500/80',
                      'text-white'
                    )}
                    variant={activity.status === 'Paid' ? 'default' : 'secondary'}
                  >
                    {activity.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
