
import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import NewBusinessTable from '@/components/sales/new-business-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Upload } from 'lucide-react';

export default function AllPoliciesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader title="All Policies" description="A comprehensive list of all policies." />
      </div>
      <Card>
        <CardContent className="pt-6">
          <NewBusinessTable />
        </CardContent>
      </Card>
    </div>
  );
}
