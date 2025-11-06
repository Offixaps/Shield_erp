

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

type FamilyMedicalHistoryTableProps = {
  form: UseFormReturn<FormValues>;
  fieldName: any;
};

const conditionOptions = [
  'Heart disease',
  'Diabetes',
  'Cancer',
  "Huntington's disease",
  'Polycystic kidney disease',
  'Multiple sclerosis',
  'Polyposis',
  'Glaucoma',
  'Polyposis of colon',
  'Hereditary disorder',
];

export default function FamilyMedicalHistoryTable({
  form,
  fieldName,
}: FamilyMedicalHistoryTableProps) {
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
              <TableHead>Condition and medical diagnosis</TableHead>
              <TableHead>Relation</TableHead>
              <TableHead>Age of occurrence</TableHead>
              <TableHead>Current age/age at death</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.condition`}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {conditionOptions.map((option) => (
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
                    name={`${fieldName}.${index}.relation`}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g., Father" />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.ageOfOccurrence`}
                    render={({ field }) => (
                      <Input type="number" {...field} placeholder="e.g., 55" />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.currentAgeOrAgeAtDeath`}
                    render={({ field }) => (
                      <Input type="number" {...field} placeholder="e.g., 58" />
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
            condition: '',
            relation: '',
            ageOfOccurrence: '',
            currentAgeOrAgeAtDeath: '',
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Family Member
      </Button>
    </div>
  );
}
