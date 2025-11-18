
'use client';

import * as React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { FormField, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

export default function DiabetesDetails({ control, index, fieldName }: { control: any, index: number, fieldName: string }) {
    return (
        <div className="p-4 mt-2 space-y-6 bg-red-500/10 rounded-md border border-red-500/20">
            <h4 className="font-semibold text-destructive">Diabetes Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name={`${fieldName}.${index}.diabetesFirstSignsDate`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>1. When did the first signs commence?</FormLabel>
                        <DatePickerField field={field} />
                      </FormItem>
                    )}
                  />
                <FormField
                    control={control}
                    name={`${fieldName}.${index}.diabetesSymptoms`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>2. What were the symptoms?</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g., Frequent urination, thirst" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
            </div>
            <FormField
                control={control}
                name={`${fieldName}.${index}.diabetesConsulted`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>3. Have you consulted a Medical Attendant for this condition?</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                    </FormItem>
                )}
            />
             <FormField
                    control={control}
                    name={`${fieldName}.${index}.diabetesDiagnosisDate`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>4. When did your doctor diagnose you with Diabetes Mellitus?</FormLabel>
                        <DatePickerField field={field} />
                      </FormItem>
                    )}
                />
            <FormField control={control} name={`${fieldName}.${index}.diabetesHospitalized`} render={({ field }) => (<FormItem><FormLabel>5. Have you ever been hospitalized for Diabetes? If yes, when, at which hospital and for how long?</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
            <FormField control={control} name={`${fieldName}.${index}.diabetesTakingInsulin`} render={({ field }) => (<FormItem><FormLabel>6. Are you taking any Insulin? If Yes, what type and how many units per day?</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
            <FormField control={control} name={`${fieldName}.${index}.diabetesOralTreatment`} render={({ field }) => (<FormItem><FormLabel>7. Are you taking any oral treatment? If Yes, provide full details of the type and dosage.</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
            <FormField control={control} name={`${fieldName}.${index}.diabetesDosageVaried`} render={({ field }) => (<FormItem><FormLabel>8. Has the intake of Insulin or oral drugs varied during the last 12 months? If Yes, give details of previous dosage.</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
            <FormField control={control} name={`${fieldName}.${index}.diabetesRegularTests`} render={({ field }) => (<FormItem><FormLabel>9. Do you regularly test blood and urine for sugar? If Yes, at what intervals and do you do home blood glucometer checks?</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
            <FormField control={control} name={`${fieldName}.${index}.diabetesLatestBloodSugar`} render={({ field }) => (<FormItem><FormLabel>10. What was the latest blood sugar reading?</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
            <FormField control={control} name={`${fieldName}.${index}.diabetesDiabeticComa`} render={({ field }) => (<FormItem><FormLabel>11. Have you ever been in a diabetic or insulin coma at any time? If Yes, state number of attacks and dates.</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
            <FormField control={control} name={`${fieldName}.${index}.diabetesComplications`} render={({ field }) => (<FormItem><FormLabel>12. Are you aware of any diabetic complications such as eye problems, pain or numbness in feet, kidney problems, and poor blood circulations? If yes, state complications and date of diagnosis.</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
            <FormField control={control} name={`${fieldName}.${index}.diabetesOtherExams`} render={({ field }) => (<FormItem><FormLabel>13. Have you had any other medical examinations in respect of diabetes? If so when and at what was the results?</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
            <FormField control={control} name={`${fieldName}.${index}.diabetesOtherConsultations`} render={({ field }) => (<FormItem><FormLabel>14. Have you consulted with any other Medical Attendant(s) or Medical Institutions in respect of diabetes, diabetes complications and treatment? Please provide details of Medical Attendant(s) and the results.</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
        </div>
    );
}
