
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { FormField, FormControl } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type FormValues = any;

type MedicalConditionDetailsTableProps = {
  form: UseFormReturn<FormValues>;
  fieldName: any;
  illnessOptions?: string[];
};

export default function MedicalConditionDetailsTable({
  form,
  fieldName,
  illnessOptions,
}: MedicalConditionDetailsTableProps) {
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
              <TableHead>Injury/Illness</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Hospital/Doctor</TableHead>
              <TableHead>Duration of Treatment</TableHead>
              <TableHead>Current Health Status/Condition</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.illness`}
                    render={({ field }) => (
                      illnessOptions ? (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select illness" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {illnessOptions.map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      ) : (
                        <Input {...field} placeholder="e.g., Surgery" />
                      )
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.date`}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => date > new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.hospital`}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g., Korle Bu" />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.duration`}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g., 2 weeks" />
                    )}
                  />
                </TableCell>
                 <TableCell>
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.status`}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g., Fully Recovered" />
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
            illness: '',
            date: new Date(),
            hospital: '',
            duration: '',
            status: '',
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Detail
      </Button>
    </div>
  );
}
