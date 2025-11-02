import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function RolesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Roles & Permissions" description="Manage user roles and their permissions." />
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/roles/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            A table of all roles will be displayed here, with features for adding, editing, and assigning permissions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
