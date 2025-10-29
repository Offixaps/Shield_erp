import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import NewBusinessForm from '@/components/clients/new-business-form';

export default function NewBusinessPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New Business"
        description="Fill in the form to add a new client and their policy."
      />
      <Card>
        <CardContent className="pt-6">
          <NewBusinessForm />
        </CardContent>
      </Card>
    </div>
  );
}
