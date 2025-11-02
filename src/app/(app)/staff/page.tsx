
import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function StaffPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Staff Management" description="An overview of all staff members." />
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            A table of all staff members will be displayed here, with features for adding, editing, and managing roles.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
