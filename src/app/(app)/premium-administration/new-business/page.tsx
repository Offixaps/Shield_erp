import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import NewBusinessTable from '@/components/premium-administration/new-business-table';

export default function NewBusinessPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New Business Review"
        description="A list of new policies pending review and activation."
      />
      <Card>
        <CardContent className="pt-6">
          <NewBusinessTable />
        </CardContent>
      </Card>
    </div>
  );
}
