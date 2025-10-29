import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function PoliciesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Policy Management" />
       <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Features for creating, updating, and tracking insurance policies will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
