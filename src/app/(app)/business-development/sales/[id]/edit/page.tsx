import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import NewBusinessForm from '@/components/clients/new-business-form';

export default function EditBusinessPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit Policy"
        description="Update the form below to edit the client and their policy."
      />
      <Card>
        <CardContent className="pt-6">
          <NewBusinessForm businessId={params.id} />
        </CardContent>
      </Card>
    </div>
  );
}
