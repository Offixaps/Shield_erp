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
      </div>
      <Card>
        <CardContent className="pt-6">
          <NewBusinessTable />
        </CardContent>
      </Card>
    </div>
  );
}
