

'use client';

import * as React from 'react';
import { useFieldArray, useWatch, type UseFormReturn } from 'react-hook-form';
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
import HighBloodPressureDetails from './form-tabs/health/high-blood-pressure-details';
import DiabetesDetails from './form-tabs/health/diabetes-details';
import AsthmaDetails from './form-tabs/health/asthma-details';
import DigestiveDisorderDetails from './form-tabs/health/digestive-disorder-details';

type FormValues = any;

type MedicalConditionDetailsTableProps = {
  form: UseFormReturn<FormValues>;
  fieldName: any;
  illnessOptions?: string[];
};

function DatePickerField({ field, fromYear = 1900, toYear = new Date().getFullYear() }: { field: any, fromYear?: number, toYear?: number }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const date = field.value ? new Date(field.value) : null;
  const isValidDate = date && !isNaN(date.getTime());

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
          >
            {isValidDate ? format(date, 'PPP') : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={isValidDate ? date : undefined}
          onSelect={(date) => {
            field.onChange(date);
            setIsOpen(false);
          }}
          initialFocus
          disabled={(date) => date > new Date()}
          captionLayout="dropdown-buttons"
          fromYear={fromYear}
          toYear={toYear}
        />
      </PopoverContent>
    </Popover>
  );
}

function MedicalConditionRow({ form, field, index, fieldName, remove, illnessOptions }: { form: UseFormReturn<FormValues>, field: any, index: number, fieldName: string, remove: (index: number) => void, illnessOptions?: string[] }) {
    const watchIllness = useWatch({
        control: form.control,
        name: `${fieldName}.${index}.illness`
    });

    const digestiveDisorders = ['Duodenal Ulcer', 'Gastric Ulcer', 'Digestive System Disorder', 'Liver Disorder', 'Disorder of Pancreas'];

    return (
        <>
            <TableRow>
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
                      <DatePickerField field={field} />
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
            {watchIllness === 'High blood pressure' && (
                <TableRow>
                    <TableCell colSpan={6}>
                        <HighBloodPressureDetails control={form.control} index={index} fieldName={fieldName} />
                    </TableCell>
                </TableRow>
            )}
            {watchIllness === 'Diabetes' && (
                <TableRow>
                    <TableCell colSpan={6}>
                        <DiabetesDetails control={form.control} index={index} fieldName={fieldName} />
                    </TableCell>
                </TableRow>
            )}
             {watchIllness === 'Asthma' && (
                <TableRow>
                    <TableCell colSpan={6}>
                        <AsthmaDetails control={form.control} index={index} fieldName={fieldName} />
                    </TableCell>
                </TableRow>
            )}
             {digestiveDisorders.includes(watchIllness) && (
                <TableRow>
                    <TableCell colSpan={6}>
                        <DigestiveDisorderDetails control={form.control} index={index} fieldName={fieldName} />
                    </TableCell>
                </TableRow>
            )}
        </>
    )
}

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
              <MedicalConditionRow 
                key={field.id}
                form={form} 
                field={field} 
                index={index} 
                fieldName={fieldName} 
                remove={remove} 
                illnessOptions={illnessOptions}
              />
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
            date: undefined,
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
