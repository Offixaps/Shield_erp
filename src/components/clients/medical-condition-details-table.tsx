
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
import { FormField, FormControl, FormItem, FormLabel } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';

type FormValues = any;

type MedicalConditionDetailsTableProps = {
  form: UseFormReturn<FormValues>;
  fieldName: any;
  illnessOptions?: string[];
};

function HighBloodPressureDetails({ control, index, fieldName }: { control: any, index: number, fieldName: string }) {
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
                                captionLayout="dropdown-buttons"
                                fromYear={1900}
                                toYear={new Date().getFullYear()}
                            />
                            </PopoverContent>
                        </Popover>
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
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
                                    captionLayout="dropdown-buttons"
                                    fromYear={1900}
                                    toYear={new Date().getFullYear()}
                                />
                            </PopoverContent>
                        </Popover>
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

function DiabetesDetails({ control, index, fieldName }: { control: any, index: number, fieldName: string }) {
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
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus disabled={(date) => date > new Date()} captionLayout="dropdown-buttons" fromYear={1900} toYear={new Date().getFullYear()} />
                            </PopoverContent>
                        </Popover>
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
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus disabled={(date) => date > new Date()} captionLayout="dropdown-buttons" fromYear={1900} toYear={new Date().getFullYear()} />
                            </PopoverContent>
                        </Popover>
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
        </div>
    );
}

function AsthmaDetails({ control, index, fieldName }: { control: any, index: number, fieldName: string }) {
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
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus disabled={(date) => date > new Date()} captionLayout="dropdown-buttons" fromYear={1900} toYear={new Date().getFullYear()} />
                            </PopoverContent>
                        </Popover>
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
                      </FormItem>
                    )}
                />
            </div>
             <FormField control={control} name={`${fieldName}.${index}.asthmaMedication`} render={({ field }) => (<FormItem><FormLabel>7. What medicines or drugs have you taken to relieve the attacks?</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
             <FormField control={control} name={`${fieldName}.${index}.asthmaSteroidTherapy`} render={({ field }) => (<FormItem><FormLabel>8. Please give details of treatment, particularly steroid therapy (if applicable).</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
             <FormField control={control} name={`${fieldName}.${index}.asthmaHospitalization`} render={({ field }) => (<FormItem><FormLabel>9. Have you ever been hospitalized for Asthma? If Yes, when, for how long and in which hospital?</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
             <FormField control={control} name={`${fieldName}.${index}.asthmaWorkAbsence`} render={({ field }) => (<FormItem><FormLabel>10. Have you ever been absent from work due to any asthma attacks? If yes, for what length of time?</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
             <FormField control={control} name={`${fieldName}.${index}.asthmaFunctionalLimitation`} render={({ field }) => (<FormItem><FormLabel>11. Is there any limitation of functional capacity with regards to work output?</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
        </div>
    );
}

function MedicalConditionRow({ form, field, index, fieldName, remove, illnessOptions }: { form: UseFormReturn<FormValues>, field: any, index: number, fieldName: string, remove: (index: number) => void, illnessOptions?: string[] }) {
    const watchIllness = useWatch({
        control: form.control,
        name: `${fieldName}.${index}.illness`
    });

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

    
