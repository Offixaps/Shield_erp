import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import NewRoleForm from '@/components/roles/new-role-form';

export default function NewRolePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add New Role"
        description="Define a new user role and assign permissions."
      />
      <Card>
        <CardContent className="pt-6">
          <NewRoleForm />
        </CardContent>
      </Card>
    </div>
  );
}
