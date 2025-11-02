import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import NewStaffForm from '@/components/staff/new-staff-form';

export default function NewStaffPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add New Staff Member"
        description="Fill in the form below to add a new member to the team."
      />
      <Card>
        <CardContent className="pt-6">
          <NewStaffForm />
        </CardContent>
      </Card>
    </div>
  );
}
