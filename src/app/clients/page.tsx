import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Client Management" />
        <Link href="/clients/new" passHref>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Business
          </Button>
        </Link>
      </div>
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Client management features, including personal details, policy
            information, and payment history, will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
