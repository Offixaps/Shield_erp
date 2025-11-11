
'use client';

import * as React from 'react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { FormField, FormControl } from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type FormValues = any;

type DeclinedPoliciesTableProps = {
  form: UseFormReturn<FormValues>;
  fieldName: any;
};

const insuranceCompanyOptions = [
    'Beige Assure Company',
    'Enterprise Life Assurance LTD',
    'Esich Life Assurance Company Ltd.',
    'Exceed Life Assurance Company Limited',
    'First Insurance Company Limited',
    'Ghana Life Insurance Company',
    'GLICO Life Insurance LTD',
    'Aster Life Ghana Limited (formally GN Life Assurance Ltd.)',
    'Hollard Life Assurance Ghana LTD',
    'Impact Life Insurance Limited',
    'Metropolitan Life Insurance Ghana LTD',
    'MiLife Company Company Limited',
    'Old Mutual Life Assurance Company (Ghana) Limited',
    'Pinnacle Life Insurance Company Limited (formally Donewell Life Company)',
    'Prudential Life Insurance Ghana',
    'Quality Life Assurance Company Limited',
    'Sanlam Allianz Life Insurance Ghana LTD',
    'SIC Life Company LTD',
    'Starlife Assurance Company Limited',
    'Vanguard Life Assurance Company Limited',
];

export default function DeclinedPoliciesTable({
  form,
  fieldName,
}: DeclinedPoliciesTableProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-background/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Insurance Company</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.companyName`}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {insuranceCompanyOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.details`}
                    render={({ field }) => (
                      <Input {...field} placeholder="Provide details of the decline" />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        type="button"
        size="sm"
        onClick={() =>
          append({
            companyName: '',
            details: '',
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Declined Policy
      </Button>
    </div>
  );
}
