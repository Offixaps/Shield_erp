
import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import NewRoleForm from '@/components/roles/new-role-form';

export default function EditRolePage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit Role"
        description="Update the role name and assigned permissions."
      />
      <Card>
        <CardContent className="pt-6">
          <NewRoleForm roleId={params.id} />
        </CardContent>
      </Card>
    </div>
  );
}
