import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function ClaimsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Claims Processing" />
       <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">The claims processing workflow, including submission, assessment, approval, and payout, will be managed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
