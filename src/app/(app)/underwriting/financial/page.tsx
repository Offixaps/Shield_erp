import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function FinancialPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Financial Underwriting" />
       <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Features for financial risk assessment and underwriting will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
