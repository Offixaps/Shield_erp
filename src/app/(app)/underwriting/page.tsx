import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function UnderwritingPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Underwriting Dashboard" />
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            The underwriting dashboard, including risk assessment, policy review, and approval workflows, will be managed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
