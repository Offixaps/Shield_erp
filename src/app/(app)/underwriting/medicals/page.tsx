import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function MedicalsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Medical Underwriting" />
       <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Features for managing medical reports and assessments will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
