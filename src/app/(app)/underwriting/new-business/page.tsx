import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import NewBusinessTable from '@/components/sales/new-business-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Upload } from 'lucide-react';

export default function NewBusinessUnderwritingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader title="New Business Review" description="An overview of new business policies for underwriting." />
        <div className="flex items-center gap-2">
          <Link href="/business-development/sales/new" passHref>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Business
            </Button>
          </Link>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Business
          </Button>
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
