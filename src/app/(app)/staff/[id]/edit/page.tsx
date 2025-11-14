
'use client';

import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import NewStaffForm from '@/components/staff/new-staff-form';
import { useParams } from 'next/navigation';

export default function EditStaffPage() {
  const params = useParams();
  const staffId = typeof params.id === 'string' ? params.id : undefined;
  
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit Staff Member"
        description="Update the details for the staff member below."
      />
      <Card>
        <CardContent className="pt-6">
          <NewStaffForm staffId={staffId} />
        </CardContent>
      </Card>
    </div>
  );
}
