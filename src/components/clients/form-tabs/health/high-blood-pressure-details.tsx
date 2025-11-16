
'use client';

import * as React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { FormField, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type FormValues = any;

function DatePickerField({ field, fromYear = 1900, toYear = new Date().getFullYear() }: { field: any, fromYear?: number, toYear?: number }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
          >
            {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
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

export default function HighBloodPressureDetails({ control, index, fieldName }: { control: any, index: number, fieldName: string }) {
    return (
        <div className="p-4 mt-2 space-y-6 bg-blue-500/10 rounded-md border border-blue-500/20">
             <h4 className="font-semibold text-primary">High Blood Pressure Details</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={control}
                    name={`${fieldName}.${index}.diagnosisDate`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>1. When were you diagnosed?</FormLabel>
                        <DatePickerField field={field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`${fieldName}.${index}.bpReadingAtDiagnosis`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>2. BP Reading at diagnosis</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g., 140/90 mmHg" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
             </div>
             <FormField
                control={control}
                name={`${fieldName}.${index}.causeOfHighBp`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>3. Was it caused by anything specific (e.g., Stress, Pregnancy, Overweight)?</FormLabel>
                         <FormControl>
                            <Textarea {...field} placeholder="If yes, provide full details." />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name={`${fieldName}.${index}.prescribedTreatment`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>4. What treatment was/is prescribed?</FormLabel>
                         <FormControl>
                            <Textarea {...field} placeholder="Describe treatment..." />
                        </FormControl>
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name={`${fieldName}.${index}.complications`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>5. Did you have any complications (e.g., Kidney Problems, Vision Problems)?</FormLabel>
                         <FormControl>
                            <Textarea {...field} placeholder="If yes, provide full details." />
                        </FormControl>
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField
                    control={control}
                    name={`${fieldName}.${index}.monitoringFrequency`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>6. How often is it monitored?</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g., Monthly" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={control}
                    name={`${fieldName}.${index}.lastMonitoredDate`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>7. When was it last monitored?</FormLabel>
                        <DatePickerField field={field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`${fieldName}.${index}.lastBpReading`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>8. What was the last reading?</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g., 120/80 mmHg" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
            </div>
             <FormField
                control={control}
                name={`${fieldName}.${index}.sugarCholesterolChecked`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>9. Have you had your sugar/glucose or cholesterol levels checked in the past 2 years?</FormLabel>
                         <FormControl>
                            <Textarea {...field} placeholder="If yes, please provide full details." />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    );
}
