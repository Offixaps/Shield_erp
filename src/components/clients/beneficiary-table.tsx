
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
import { Plus, Trash2, CalendarIcon } from 'lucide-react';
import { FormField, FormControl, FormItem } from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { TelephoneInput } from '@/components/ui/telephone-input';

type FormValues = any; // Replace with z.infer<typeof yourSchema>

type BeneficiaryTableProps = {
  form: UseFormReturn<FormValues>;
  fieldName: 'primaryBeneficiaries' | 'contingentBeneficiaries';
};

function BeneficiaryRow({ form, fieldName, field, index, remove }: { form: UseFormReturn<FormValues>, fieldName: BeneficiaryTableProps['fieldName'], field: any, index: number, remove: (index: number) => void }) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  return (
    <TableRow>
      <TableCell>
        <FormField
          control={form.control}
          name={`${fieldName}.${index}.name`}
          render={({ field }) => (
            <Input {...field} placeholder="e.g., Jane Doe" />
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`${fieldName}.${index}.dob`}
          render={({ field }) => (
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
                      format(new Date(field.value), 'PPP')
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
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    field.onChange(date);
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                   disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                  }
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`${fieldName}.${index}.gender`}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`${fieldName}.${index}.relationship`}
          render={({ field }) => (
            <Input {...field} placeholder="e.g., Spouse" />
          )}
        />
      </TableCell>
       <TableCell>
        <FormField
          control={form.control}
          name={`${fieldName}.${index}.telephone`}
          render={({ field }) => (
            <TelephoneInput {...field} placeholder="55..." />
          )}
        />
      </TableCell>
       <TableCell>
        <FormField
          control={form.control}
          name={`${fieldName}.${index}.percentage`}
          render={({ field }) => (
            <Input type="number" {...field} placeholder="e.g., 100" />
          )}
        />
      </TableCell>
      <TableCell className="text-center">
         <FormField
          control={form.control}
          name={`${fieldName}.${index}.isIrrevocable`}
          render={({ field }) => (
              <FormItem className="flex h-full items-center justify-center">
                   <FormControl>
                      <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                      />
                  </FormControl>
              </FormItem>
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
  );
}


export default function BeneficiaryTable({
  form,
  fieldName,
}: BeneficiaryTableProps) {
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
              <TableHead>Full Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Relationship</TableHead>
              <TableHead>Telephone</TableHead>
              <TableHead className="w-[100px]">% Share</TableHead>
              <TableHead>Irrevocable</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <BeneficiaryRow 
                key={field.id}
                form={form}
                fieldName={fieldName}
                field={field}
                index={index}
                remove={remove}
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
            name: '',
            dob: undefined,
            gender: 'Male',
            relationship: '',
            telephone: '',
            percentage: 100,
            isIrrevocable: false
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Beneficiary
      </Button>
    </div>
  );
}
