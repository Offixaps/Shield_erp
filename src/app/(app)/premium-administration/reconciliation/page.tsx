import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function ReconciliationPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Payment Reconciliation" />
       <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Tools and workflows for reconciling premium payments with bank statements will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
