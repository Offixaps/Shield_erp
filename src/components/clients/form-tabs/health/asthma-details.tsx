
'use client';

import * as React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { FormField, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function AsthmaDetails({ control, index, fieldName }: { control: any, index: number, fieldName: string }) {
    return (
        <div className="p-4 mt-2 space-y-6 bg-purple-500/10 rounded-md border border-purple-500/20">
            <h4 className="font-semibold" style={{ color: 'hsl(var(--chart-3))' }}>Asthma Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField control={control} name={`${fieldName}.${index}.asthmaFirstSignsAge`} render={({ field }) => (<FormItem><FormLabel>1. Age at first signs</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                 <FormField control={control} name={`${fieldName}.${index}.asthmaSymptomDuration`} render={({ field }) => (<FormItem><FormLabel>2. Duration of symptoms</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                 <FormField control={control} name={`${fieldName}.${index}.asthmaSymptomFrequency`} render={({ field }) => (<FormItem><FormLabel>3. Frequency of symptoms</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
            </div>
            <FormField control={control} name={`${fieldName}.${index}.asthmaTrigger`} render={({ field }) => (<FormItem><FormLabel>4. Are symptoms caused by any special circumstance or conditions? If Yes, provide full details.</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name={`${fieldName}.${index}.asthmaLastAttackDate`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>5. When did you last have an Asthma attack?</FormLabel>
                        <DatePickerField field={field} />
                      </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name={`${fieldName}.${index}.asthmaSeverity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>6. How would you describe your condition?</FormLabel>
                         <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Mild">Mild</SelectItem>
                                <SelectItem value="Moderate">Moderate</SelectItem>
                                <SelectItem value="Severe">Severe</SelectItem>
                            </SelectContent>
                        </Select>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-xs p-2 -mt-1 hover:no-underline">View Severity Guide</AccordionTrigger>
                                <AccordionContent>
                                    <Card className="bg-background">
                                        <CardHeader>
                                            <CardTitle className="text-sm">Asthma Severity Guide</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 text-xs">
                                            <div>
                                                <h4 className="font-semibold">Mild</h4>
                                                <ul className="list-disc pl-5 text-muted-foreground">
                                                    <li>Airways clear between attacks.</li>
                                                    <li>Attacks responding rapidly to self-administered remedies.</li>
                                                    <li>No acute spasmodic attacks or frequent respiratory infections within the last two years.</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">Moderate</h4>
                                                <ul className="list-disc pl-5 text-muted-foreground">
                                                    <li>More than three acute spasmodic attacks within the last two years.</li>
                                                    <li>More frequent use of antispasmodics.</li>
                                                    <li>Occasional use of oral corticosteroids during an acute spasmodic attack.</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">Severe</h4>
                                                <ul className="list-disc pl-5 text-muted-foreground">
                                                    <li>Continuous medication.</li>
                                                    <li>Impaired chest development.</li>
                                                    <li>History of status asthmaticus or hospital admission within the last two years.</li>
                                                </ul>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                      </FormItem>
                    )}
                />
            </div>
             <FormField control={control} name={`${fieldName}.${index}.asthmaMedication`} render={({ field }) => (<FormItem><FormLabel>7. What medicines or drugs have you taken to relieve the attacks?</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
             <FormField control={control} name={`${fieldName}.${index}.asthmaSteroidTherapy`} render={({ field }) => (<FormItem><FormLabel>8. Please give details of treatment, particularly steroid therapy (if applicable).</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
             <FormField control={control} name={`${fieldName}.${index}.asthmaHospitalization`} render={({ field }) => (<FormItem><FormLabel>9. Have you ever been hospitalized for Asthma? If Yes, when, for how long and in which hospital?</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
             <FormField control={control} name={`${fieldName}.${index}.asthmaWorkAbsence`} render={({ field }) => (<FormItem><FormLabel>10. Have you ever been absent from work due to any asthma attacks? If yes, for what length of time?</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
             <FormField control={control} name={`${fieldName}.${index}.asthmaFunctionalLimitation`} render={({ field }) => (<FormItem><FormLabel>11. Is there any limitation of functional capacity with regards to work output?</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
             <FormField control={control} name={`${fieldName}.${index}.asthmaChestXRay`} render={({ field }) => (<FormItem><FormLabel>12. Has your chest ever been x-rayed or have undergone a lung function test? If yes, give details of results including test dates.</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
             <FormField control={control} name={`${fieldName}.${index}.asthmaComplicatingFeatures`} render={({ field }) => (<FormItem><FormLabel>13. Are you aware of any features that may complicate your condition, e.g. Smoke, occupational hazards?</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
        </div>
    );
}
