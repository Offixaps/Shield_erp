
'use client';

import * as React from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, List, Grid, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getStaff, deleteStaffMember } from '@/lib/staff-service';
import type { StaffMember } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import DeleteStaffDialog from '@/components/staff/delete-staff-dialog';
import { cn } from '@/lib/utils';

export default function StaffPage() {
  const [view, setView] = React.useState<'list' | 'grid'>('grid');
  const [staffList, setStaffList] = React.useState<StaffMember[]>([]);
  const userAvatar = PlaceHolderImages.find(
    (image) => image.id === 'user-avatar-1'
  );

  React.useEffect(() => {
    setStaffList(getStaff());
  }, []);

  const handleDelete = (id: number) => {
    if (deleteStaffMember(id)) {
      setStaffList(getStaff());
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'administrator':
        return 'bg-destructive text-destructive-foreground';
      case 'underwriter':
        return 'bg-purple-500 text-white';
      case 'premium administrator':
        return 'bg-green-500 text-white';
      case 'sales agent':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Staff Management" description="An overview of all staff members." />
        <div className="flex items-center gap-2">
          <Button variant={view === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setView('grid')}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={view === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setView('list')}>
            <List className="h-4 w-4" />
          </Button>
          <Link href="/staff/new" passHref>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </Link>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {staffList.map((staff) => (
            <Card key={staff.id} className="flex flex-col">
              <CardHeader className="flex flex-col items-center text-center p-4">
                 <Avatar className="h-20 w-20 mb-2">
                    {userAvatar && (
                        <AvatarImage src={userAvatar.imageUrl} alt={`${staff.firstName} ${staff.lastName}`} />
                    )}
                    <AvatarFallback>{staff.firstName[0]}{staff.lastName[0]}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{staff.firstName} {staff.lastName}</CardTitle>
                <CardDescription>{staff.email}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center justify-center p-4 pt-0">
                <Badge className={getRoleBadgeColor(staff.role)}>{staff.role}</Badge>
                <p className="text-sm text-muted-foreground mt-2">{staff.phone}</p>
              </CardContent>
              <div className="flex justify-center p-4 border-t">
                  <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
                    <Link href={`/staff/${staff.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <DeleteStaffDialog onConfirm={() => handleDelete(staff.id)}>
                   <Button variant="ghost" size="sm" className="w-full justify-center text-destructive hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                  </DeleteStaffDialog>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="pt-6">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {staffList.map((staff) => (
                            <TableRow key={staff.id}>
                            <TableCell className="font-medium">{staff.firstName} {staff.lastName}</TableCell>
                            <TableCell>{staff.email}</TableCell>
                            <TableCell>{staff.phone}</TableCell>
                            <TableCell>
                                <Badge className={cn('w-44 justify-center truncate', getRoleBadgeColor(staff.role))}>{staff.role}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/staff/${staff.id}/edit`}>
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <DeleteStaffDialog onConfirm={() => handleDelete(staff.id)}>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </DeleteStaffDialog>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
