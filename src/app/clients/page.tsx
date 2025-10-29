import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Client Management" />
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Client management features, including personal details, policy information, and payment history, will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
