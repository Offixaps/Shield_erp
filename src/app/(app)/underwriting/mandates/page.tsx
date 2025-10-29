import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function MandatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Mandates" />
       <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Mandate management features for underwriting will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
