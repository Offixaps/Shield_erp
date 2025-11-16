
'use client';

import * as React from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
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

export default function DigestiveDisorderDetails({ control, index, fieldName }: { control: any, index: number, fieldName: string }) {
    const watchHadEndoscopy = useWatch({ control, name: `${fieldName}.${index}.hadEndoscopy` });
    const watchHadSurgery = useWatch({ control, name: `${fieldName}.${index}.hadDigestiveSurgery` });
    const watchProblemsAfterSurgery = useWatch({ control, name: `${fieldName}.${index}.problemsAfterSurgery` });
    const watchIsReceivingTreatment = useWatch({ control, name: `${fieldName}.${index}.isReceivingTreatmentNow` });

    return (
        <div className="p-4 mt-2 space-y-6 bg-yellow-500/10 rounded-md border border-yellow-500/20">
            <h4 className="font-semibold" style={{ color: 'hsl(var(--chart-4))' }}>Digestive Disorder Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={control} name={`${fieldName}.${index}.digestiveSymptoms`} render={({ field }) => (<FormItem><FormLabel>1. What symptoms did the condition begin with?</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                <FormField control={control} name={`${fieldName}.${index}.digestiveSymptomFrequency`} render={({ field }) => (<FormItem><FormLabel>2. How frequent and severe are they?</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={control} name={`${fieldName}.${index}.digestiveConditionStartDate`} render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>3. Kindly estimate when the condition began</FormLabel>
                       <DatePickerField field={field} />
                    </FormItem>)} />
                <FormField control={control} name={`${fieldName}.${index}.digestivePreciseDiagnosis`} render={({ field }) => (<FormItem><FormLabel>4. What was the precise diagnosis?</FormLabel><FormControl><Input {...field} placeholder="e.g., Duodenal Ulcer" /></FormControl></FormItem>)} />
            </div>

            <FormField control={control} name={`${fieldName}.${index}.digestiveMedication`} render={({ field }) => (<FormItem><FormLabel>5. What medication do you usually take for the condition?</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />

            <div className="space-y-4 rounded-md border p-4">
                <FormField control={control} name={`${fieldName}.${index}.hadEndoscopy`} render={({ field }) => (
                    <FormItem><FormLabel>6. Have you ever had an endoscopy?</FormLabel>
                        <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl>
                    </FormItem>)} />
                {watchHadEndoscopy === 'yes' && <FormField control={control} name={`${fieldName}.${index}.endoscopyDetails`} render={({ field }) => (<FormItem><FormLabel>If yes, please give details including the date and result.</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />}
            </div>

            <div className="space-y-4 rounded-md border p-4">
                <FormField control={control} name={`${fieldName}.${index}.hadDigestiveSurgery`} render={({ field }) => (
                    <FormItem><FormLabel>7. Have you ever had a surgery on account of the condition?</FormLabel>
                        <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl>
                    </FormItem>)} />
                {watchHadSurgery === 'yes' && (
                    <div className="pl-6 mt-4 space-y-4">
                        <FormField control={control} name={`${fieldName}.${index}.problemsAfterSurgery`} render={({ field }) => (
                            <FormItem><FormLabel>Have you had any problems after the surgery?</FormLabel>
                                <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl>
                            </FormItem>)} />
                        {watchProblemsAfterSurgery === 'yes' && <FormField control={control} name={`${fieldName}.${index}.problemsAfterSurgeryDetails`} render={({ field }) => (<FormItem><FormLabel>If yes, please give details</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />}
                    </div>
                )}
            </div>

             <div className="space-y-4 rounded-md border p-4">
                <FormField control={control} name={`${fieldName}.${index}.isReceivingTreatmentNow`} render={({ field }) => (
                    <FormItem><FormLabel>8. Are you being followed up or receiving any treatment now?</FormLabel>
                        <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl>
                    </FormItem>)} />
                {watchIsReceivingTreatment === 'yes' && <FormField control={control} name={`${fieldName}.${index}.treatmentDetails`} render={({ field }) => (<FormItem><FormLabel>If yes, please give details</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />}
                {watchIsReceivingTreatment === 'no' && <FormField control={control} name={`${fieldName}.${index}.dischargeDate`} render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>If you have been discharged from follow up, when was this?</FormLabel>
                        <DatePickerField field={field} />
                    </FormItem>)} />}
            </div>

            <FormField control={control} name={`${fieldName}.${index}.asthmaWorkAbsence`} render={({ field }) => (
                <FormItem className="rounded-md border p-4">
                    <FormLabel>9. Have you ever been off work with this complaint?</FormLabel>
                    <FormControl><Textarea {...field} placeholder="If yes, please state when and for how long." /></FormControl>
                </FormItem>)} 
            />
        </div>
    );
}
