
import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import NewBusinessTable from '@/components/sales/new-business-table';
import BulkBusinessDialog from '@/components/sales/bulk-business-dialog';

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Sales" description="An overview of new business policies." />
        <div className="flex items-center gap-2">
          <Link href="/business-development/sales/new" passHref>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Business
            </Button>
          </Link>
          <BulkBusinessDialog />
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <NewBusinessTable />
        </CardContent>
      </Card>
    </div>
  );
}
