import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function OccupationalPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Occupational Risk Assessment" />
       <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Features for assessing occupational risk will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
