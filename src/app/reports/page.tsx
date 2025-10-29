import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Financial Reporting" />
       <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Generation of financial reports, such as revenue, outstanding premiums, and profitability, will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
