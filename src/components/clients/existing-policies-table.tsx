
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';


type FormValues = any;

type ExistingPoliciesTableProps = {
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

function ExistingPolicyRow({ form, field, index, fieldName, remove }: { form: UseFormReturn<FormValues>, field: any, index: number, fieldName: string, remove: (index: number) => void }) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  return (
    <TableRow>
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
          name={`${fieldName}.${index}.personCovered`}
          render={({ field }) => (
            <Input {...field} placeholder="e.g., John Doe" />
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`${fieldName}.${index}.policyType`}
          render={({ field }) => (
            <Input {...field} placeholder="e.g., Term Life" />
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`${fieldName}.${index}.issueDate`}
          render={({ field }) => (
             <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                  <FormControl>
                  <Button
                      variant={'outline'}
                      className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                  >
                      {field.value && (field.value instanceof Date && !isNaN(field.value.getTime())) ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                  </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                  <Calendar 
                      mode="single" 
                      selected={field.value} 
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsCalendarOpen(false);
                      }}
                      initialFocus 
                      captionLayout="dropdown-buttons"
                      fromYear={1950}
                      toYear={new Date().getFullYear()}
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
              name={`${fieldName}.${index}.premiumAmount`}
              render={({ field }) => (
                  <Input type="number" {...field} placeholder="e.g., 250" />
              )}
          />
      </TableCell>
      <TableCell>
           <FormField
              control={form.control}
              name={`${fieldName}.${index}.faceAmount`}
              render={({ field }) => (
                  <Input type="number" {...field} placeholder="e.g., 100000" />
              )}
          />
      </TableCell>
      <TableCell>
           <FormField
              control={form.control}
              name={`${fieldName}.${index}.changedGrpOrInd`}
              render={({ field }) => (
                 <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><Label className="font-normal">Yes</Label></FormItem>
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><Label className="font-normal">No</Label></FormItem>
                  </RadioGroup>
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

export default function ExistingPoliciesTable({
  form,
  fieldName,
}: ExistingPoliciesTableProps) {
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
              <TableHead>Person(s) Covered</TableHead>
              <TableHead>Type of Policy</TableHead>
              <TableHead>Date Issued</TableHead>
              <TableHead>Premium Amount</TableHead>
              <TableHead>Face Amount</TableHead>
              <TableHead>Changed GRP/IND</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <ExistingPolicyRow 
                key={field.id}
                form={form}
                field={field}
                index={index}
                fieldName={fieldName}
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
            companyName: '',
            personCovered: '',
            policyType: '',
            issueDate: new Date(),
            premiumAmount: 0,
            faceAmount: 0,
            changedGrpOrInd: 'no',
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Policy
      </Button>
    </div>
  );
}
