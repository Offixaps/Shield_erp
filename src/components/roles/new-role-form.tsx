
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { permissionsConfig } from '@/lib/permissions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { createRole, getRoleById, updateRole } from '@/lib/role-service';
import type { Role } from '@/lib/data';

const formSchema = z.object({
  roleName: z.string().min(2, 'Role name must be at least 2 characters.'),
  permissions: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one permission.',
  }),
});

type NewRoleFormProps = {
  roleId?: string;
};

export default function NewRoleForm({ roleId }: NewRoleFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditMode = !!roleId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleName: '',
      permissions: [],
    },
  });

  React.useEffect(() => {
    if (isEditMode && roleId) {
      const fetchRole = async () => {
          const roleData = await getRoleById(roleId);
          if (roleData) {
            form.reset({
                roleName: roleData.name,
                permissions: roleData.permissions,
            })
          }
      }
      fetchRole();
    }
  }, [isEditMode, roleId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEditMode && roleId) {
      await updateRole(roleId, values);
       toast({
        title: 'Role Updated',
        description: `The role "${values.roleName}" has been updated.`,
      });
    } else {
      await createRole(values);
      toast({
        title: 'Role Created',
        description: `The role "${values.roleName}" has been created with ${values.permissions.length} permissions.`,
      });
    }
    router.push('/roles');
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="roleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Junior Underwriter" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card>
            <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <FormDescription>Select the permissions for this role. These will determine what users with this role can see and do.</FormDescription>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="permissions"
                    render={() => (
                        <Accordion type="multiple" className="w-full">
                        {Object.entries(permissionsConfig).map(([department, modules]) => (
                            <AccordionItem value={department} key={department}>
                            <AccordionTrigger className="text-base font-medium">{department}</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                {Object.entries(modules).map(([moduleName, modulePermissions]) => (
                                <div key={moduleName} className="rounded-md border p-4">
                                    <h4 className="mb-4 text-sm font-medium">{moduleName}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {modulePermissions.map((permission) => (
                                        <FormField
                                        key={`${moduleName}-${permission.id}`}
                                        control={form.control}
                                        name="permissions"
                                        render={({ field }) => {
                                            return (
                                            <FormItem
                                                key={`${moduleName}-${permission.id}`}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(permission.id)}
                                                    onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...field.value, permission.id])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                            (value) => value !== permission.id
                                                            )
                                                        );
                                                    }}
                                                />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {permission.label}
                                                </FormLabel>
                                            </FormItem>
                                            );
                                        }}
                                        />
                                    ))}
                                    </div>
                                </div>
                                ))}
                            </AccordionContent>
                            </AccordionItem>
                        ))}
                        </Accordion>
                    )}
                    />
                 <FormMessage />
            </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Button type="submit">{isEditMode ? 'Update Role' : 'Create Role'}</Button>
          <Button type="button" variant="outline" onClick={() => router.push('/roles')}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
