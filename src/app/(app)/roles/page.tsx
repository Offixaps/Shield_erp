
'use client';

import * as React from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { getRoles } from '@/lib/role-service';
import { getStaff } from '@/lib/staff-service';
import type { Role, StaffMember } from '@/lib/data';

export default function RolesPage() {
  const [allRoles, setAllRoles] = React.useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = React.useState<Role[]>([]);
  const [staff, setStaff] = React.useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    async function fetchData() {
        // Filter out the 'Super Admin' role from local data
        const rolesFromService = getRoles().filter(role => role.name !== 'Super Admin');
        
        // Fetch staff members asynchronously
        const staffMembers = await getStaff();

        setAllRoles(rolesFromService);
        setFilteredRoles(rolesFromService);
        setStaff(staffMembers);
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = allRoles.filter(role =>
      role.name.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredRoles(filtered);
  }, [searchTerm, allRoles]);

  const getStaffCountForRole = (roleName: string) => {
    return staff.filter(member => member.role === roleName).length;
  };

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
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by role name..."
              className="w-full pl-8 sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Permissions Count</TableHead>
                  <TableHead>Staff #</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.permissions.length}</TableCell>
                    <TableCell>{getStaffCountForRole(role.name)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/roles/${role.id}/edit`}>Edit</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
           {filteredRoles.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No roles found matching your search.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
