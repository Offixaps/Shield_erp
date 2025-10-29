import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function ClaimsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Claims Review" />
       <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Features for reviewing claims from an underwriting perspective will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
