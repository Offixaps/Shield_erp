import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Sales Reporting" />
       <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Generation of sales reports, such as agent performance, policy sales by type, and lead conversion rates, will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
