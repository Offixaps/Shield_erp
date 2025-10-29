import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function CollectionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Premium Collection" />
       <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Tools for tracking and managing premium collections, including generating payment reminders, will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
