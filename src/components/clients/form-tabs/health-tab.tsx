
'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormControl, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import MedicalHistoryTabs from '../medical-history-tabs';

const alcoholHabitsLabels: Record<string, string> = {
    'never_used': 'Have never used alcohol',
    'occasional_socially': 'Drink occasionally or socially only',
    'ex_drinker_over_5_years': 'Ex-drinker; last drunk alcohol over 5 years ago',
    'ex_drinker_1_to_5_years': 'Ex-drinker: last drunk alcohol 1 to 5 years ago',
    'ex_drinker_within_1_year': 'Ex-drinker: last drunk alcohol within the last year',
    'current_regular_drinker': 'Current regular drinker',
};

const tobaccoHabitsLabels: Record<string, string> = {
    'never_smoked': 'Have never smoked',
    'ex_smoker_over_5_years': 'Ex-smoker: last used over 5 years ago',
    'ex_smoker_1_to_5_years': 'Ex-smoker: last used 1 to 5 years ago',
    'ex_smoker_within_1_year': 'Ex-smoker: last used within the last year',
    'smoke_occasionally_socially': 'Smoke occasionally or socially only',
    'current_regular_smoker': 'Current regular smoker',
};

type FormValues = any;

type HealthTabProps = {
  form: UseFormReturn<FormValues>;
};

export default function HealthTab({ form }: HealthTabProps) {
  const [bmi, setBmi] = React.useState<number | null>(null);
  const [bmiStatus, setBmiStatus] = React.useState<{ text: string, color: string } | null>(null);

  const height = form.watch('height');
  const heightUnit = form.watch('heightUnit');
  const weight = form.watch('weight');

  React.useEffect(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (h > 0 && w > 0) {
      let heightInMeters;
      if (heightUnit === 'cm') {
        heightInMeters = h / 100;
      } else if (heightUnit === 'ft') {
        heightInMeters = h * 0.3048;
      } else {
        heightInMeters = h;
      }
      
      const calculatedBmi = w / (heightInMeters * heightInMeters);
      form.setValue('bmi', calculatedBmi);
      setBmi(calculatedBmi);

      if (calculatedBmi < 18.5) {
        setBmiStatus({ text: 'Underweight', color: 'bg-blue-500' });
      } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
        setBmiStatus({ text: 'Healthy Weight', color: 'bg-green-500' });
      } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
        setBmiStatus({ text: 'Overweight', color: 'bg-yellow-500' });
      } else {
        setBmiStatus({ text: 'Obesity', color: 'bg-red-500' });
      }
    } else {
      setBmi(null);
      setBmiStatus(null);
    }
  }, [height, heightUnit, weight, form]);
  
  const alcoholHabits = form.watch('alcoholHabits');
  const showAlcoholDetails = alcoholHabits === 'occasional_socially' || alcoholHabits === 'current_regular_drinker';
  
  const reducedAlcoholMedicalAdvice = form.watch('reducedAlcoholMedicalAdvice.reduced');
  const reducedAlcoholHealthProblems = form.watch('reducedAlcoholHealthProblems.reduced');
  
  const usedNicotineLast12Months = form.watch('usedNicotineLast12Months');

  const testedPositiveViralInfection = form.watch('testedPositiveViralInfection');
  
  return (
    <div className="space-y-8">
       <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>WARNING</AlertTitle>
        <AlertDescription className="text-destructive dark:text-white">
          The answers you give to these questions are material. If you fail to give accurate answers, it may affect the terms of your contract and we may decline a claim. In some cases the Company may check these answers by obtaining a report from your doctor/hospital.
        </AlertDescription>
      </Alert>

      <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>HEIGHT &amp; WEIGHT</h3>
        </div>
        <Separator className="my-0" />
        <div className="p-4 border border-t-0 rounded-b-md space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 175" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heightUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="m">m</SelectItem>
                            <SelectItem value="ft">ft</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 80" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                 <FormLabel>BMI</FormLabel>
                 <div className={cn("flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm", bmiStatus?.color, bmiStatus && 'text-white font-bold')}>
                    {bmi ? (
                        <div className="flex items-center gap-2">
                            <span>{bmi.toFixed(1)}</span>
                            {bmiStatus && <Badge className={cn('text-white', bmiStatus.color)}>{bmiStatus.text}</Badge>}
                        </div>
                    ) : 'Not calculated'}
                 </div>
              </div>
           </div>
        </div>
      </div>
      
       <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>Alcohol Consumption</h3>
        </div>
        <Separator className="my-0" />
        <div className="p-4 border border-t-0 rounded-b-md space-y-6">
            <FormField
              control={form.control}
              name="alcoholHabits"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select the statement that best describes your drinking habits</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        {Object.entries(alcoholHabitsLabels).map(([value, label]) => (
                          <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value={value} /></FormControl>
                              <FormLabel className="font-normal">{label}</FormLabel>
                          </FormItem>
                        ))}
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showAlcoholDetails && (
              <>
                <Separator />
                <div className="space-y-4">
                    <FormLabel>If you drink alcohol, what do you consume?</FormLabel>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-48">Description</TableHead>
                            <TableHead>Average per week</TableHead>
                            <TableHead>Notes (if any)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                               <FormField control={form.control} name="alcoholBeer.consumed" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Beer</FormLabel></FormItem>)} />
                            </TableCell>
                            <TableCell>
                              <FormField control={form.control} name="alcoholBeer.averagePerWeek" render={({ field }) => (<Input {...field} disabled={!form.watch('alcoholBeer.consumed')} />)} />
                            </TableCell>
                             <TableCell>
                              <FormField control={form.control} name="alcoholBeer.notes" render={({ field }) => (<Input {...field} disabled={!form.watch('alcoholBeer.consumed')} />)} />
                            </TableCell>
                          </TableRow>
                           <TableRow>
                            <TableCell>
                               <FormField control={form.control} name="alcoholWine.consumed" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Wine</FormLabel></FormItem>)} />
                            </TableCell>
                            <TableCell>
                              <FormField control={form.control} name="alcoholWine.averagePerWeek" render={({ field }) => (<Input {...field} disabled={!form.watch('alcoholWine.consumed')} />)} />
                            </TableCell>
                             <TableCell>
                              <FormField control={form.control} name="alcoholWine.notes" render={({ field }) => (<Input {...field} disabled={!form.watch('alcoholWine.consumed')} />)} />
                            </TableCell>
                          </TableRow>
                           <TableRow>
                            <TableCell>
                               <FormField control={form.control} name="alcoholSpirits.consumed" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Spirits</FormLabel></FormItem>)} />
                            </TableCell>
                            <TableCell>
                              <FormField control={form.control} name="alcoholSpirits.averagePerWeek" render={({ field }) => (<Input {...field} disabled={!form.watch('alcoholSpirits.consumed')} />)} />
                            </TableCell>
                             <TableCell>
                              <FormField control={form.control} name="alcoholSpirits.notes" render={({ field }) => (<Input {...field} disabled={!form.watch('alcoholSpirits.consumed')} />)} />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                </div>
              </>
            )}
             <Separator />
             <div className="space-y-4">
                <FormField control={form.control} name="reducedAlcoholMedicalAdvice.reduced" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Have you ever been advised by a medical professional to reduce your alcohol consumption?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                {reducedAlcoholMedicalAdvice === 'yes' && <FormField control={form.control} name="reducedAlcoholMedicalAdvice.notes" render={({ field }) => (<FormItem><FormLabel>If yes, please provide details</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />}
            </div>
             <Separator />
             <div className="space-y-4">
                <FormField control={form.control} name="reducedAlcoholHealthProblems.reduced" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Have you ever had to reduce your alcohol consumption because of health problems?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                {reducedAlcoholHealthProblems === 'yes' && <FormField control={form.control} name="reducedAlcoholHealthProblems.notes" render={({ field }) => (<FormItem><FormLabel>If yes, please provide details</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />}
            </div>
        </div>
      </div>
      
       <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>Tobacco / Nicotine Usage</h3>
        </div>
        <Separator className="my-0" />
        <div className="p-4 border border-t-0 rounded-b-md space-y-6">
           <FormField
              control={form.control}
              name="tobaccoHabits"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select the statement that best describes your smoking habits</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                          {Object.entries(tobaccoHabitsLabels).map(([value, label]) => (
                            <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value={value} /></FormControl>
                                <FormLabel className="font-normal">{label}</FormLabel>
                            </FormItem>
                          ))}
                       </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
             <FormField control={form.control} name="usedNicotineLast12Months" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Have you used any tobacco or nicotine products (including nicotine replacements) in the last 12 months?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
             {usedNicotineLast12Months === 'yes' && (
                <div className="space-y-4">
                    <FormLabel>If yes, which products have you used?</FormLabel>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-64">Description</TableHead>
                            <TableHead>Average per day</TableHead>
                            <TableHead>Average per week</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                                <FormField control={form.control} name="tobaccoCigarettes.smoked" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Cigarettes</FormLabel></FormItem>)} />
                            </TableCell>
                            <TableCell><FormField control={form.control} name="tobaccoCigarettes.avgPerDay" render={({ field }) => (<Input {...field} disabled={!form.watch('tobaccoCigarettes.smoked')} />)} /></TableCell>
                            <TableCell><FormField control={form.control} name="tobaccoCigarettes.avgPerWeek" render={({ field }) => (<Input {...field} disabled={!form.watch('tobaccoCigarettes.smoked')} />)} /></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                                <FormField control={form.control} name="tobaccoCigars.smoked" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Cigars</FormLabel></FormItem>)} />
                            </TableCell>
                            <TableCell><FormField control={form.control} name="tobaccoCigars.avgPerDay" render={({ field }) => (<Input {...field} disabled={!form.watch('tobaccoCigars.smoked')} />)} /></TableCell>
                            <TableCell><FormField control={form.control} name="tobaccoCigars.avgPerWeek" render={({ field }) => (<Input {...field} disabled={!form.watch('tobaccoCigars.smoked')} />)} /></TableCell>
                          </TableRow>
                           <TableRow>
                            <TableCell>
                                <FormField control={form.control} name="tobaccoPipe.smoked" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Pipe</FormLabel></FormItem>)} />
                            </TableCell>
                            <TableCell><FormField control={form.control} name="tobaccoPipe.avgPerDay" render={({ field }) => (<Input {...field} disabled={!form.watch('tobaccoPipe.smoked')} />)} /></TableCell>
                            <TableCell><FormField control={form.control} name="tobaccoPipe.avgPerWeek" render={({ field }) => (<Input {...field} disabled={!form.watch('tobaccoPipe.smoked')} />)} /></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                                <FormField control={form.control} name="tobaccoNicotineReplacement.smoked" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Nicotine replacement products</FormLabel></FormItem>)} />
                            </TableCell>
                            <TableCell><FormField control={form.control} name="tobaccoNicotineReplacement.avgPerDay" render={({ field }) => (<Input {...field} disabled={!form.watch('tobaccoNicotineReplacement.smoked')} />)} /></TableCell>
                            <TableCell><FormField control={form.control} name="tobaccoNicotineReplacement.avgPerWeek" render={({ field }) => (<Input {...field} disabled={!form.watch('tobaccoNicotineReplacement.smoked')} />)} /></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                                <FormField control={form.control} name="tobaccoEcigarettes.smoked" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">E-cigarettes</FormLabel></FormItem>)} />
                            </TableCell>
                            <TableCell><FormField control={form.control} name="tobaccoEcigarettes.avgPerDay" render={({ field }) => (<Input {...field} disabled={!form.watch('tobaccoEcigarettes.smoked')} />)} /></TableCell>
                            <TableCell><FormField control={form.control} name="tobaccoEcigarettes.avgPerWeek" render={({ field }) => (<Input {...field} disabled={!form.watch('tobaccoEcigarettes.smoked')} />)} /></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                                <FormField control={form.control} name="tobaccoOther.smoked" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="flex-1"><FormField control={form.control} name="tobaccoOther.otherType" render={({ field }) => (<Input placeholder="Specify other" {...field} disabled={!form.watch('tobaccoOther.smoked')} />)} /></div></FormItem>)} />
                            </TableCell>
                            <TableCell><FormField control={form.control} name="tobaccoOther.avgPerDay" render={({ field }) => (<Input {...field} disabled={!form.watch('tobaccoOther.smoked')} />)} /></TableCell>
                            <TableCell><FormField control={form.control} name="tobaccoOther.avgPerWeek" render={({ field }) => (<Input {...field} disabled={!form.watch('tobaccoOther.smoked')} />)} /></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                </div>
            )}
        </div>
      </div>
       <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>Recreational drugs Usage</h3>
        </div>
        <Separator className="my-0" />
        <div className="p-4 border border-t-0 rounded-b-md space-y-6">
            <FormField control={form.control} name="usedRecreationalDrugs" render={({ field }) => (<FormItem><FormLabel>Have you ever used recreational drugs (e.g. cocaine, heroin, weed) or taken drugs other than for medical purposes?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
            <Separator />
            <FormField control={form.control} name="injectedNonPrescribedDrugs" render={({ field }) => (<FormItem><FormLabel>Have you ever injected a non-prescribed drugs?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
            <Separator />
            <FormField control={form.control} name="testedPositiveViralInfection" render={({ field }) => (<FormItem><FormLabel>Have you ever been tested positive for HIV, Hepatitis B or C, or are you awaiting the results of such a test?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
            {testedPositiveViralInfection === 'yes' && (
                <div className="space-y-4 rounded-md border p-4">
                    <div className="space-y-2">
                        <FormLabel>If yes, please indicate which:</FormLabel>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium text-sm mb-2">Tested Positive For:</h4>
                                <FormField control={form.control} name="testedPositiveFor.hiv" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">HIV</FormLabel></FormItem>)} />
                                <FormField control={form.control} name="testedPositiveFor.hepB" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Hepatitis B</FormLabel></FormItem>)} />
                                <FormField control={form.control} name="testedPositiveFor.hepC" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Hepatitis C</FormLabel></FormItem>)} />
                            </div>
                             <div>
                                <h4 className="font-medium text-sm mb-2">Awaiting Results For:</h4>
                                <FormField control={form.control} name="awaitingResultsFor.hiv" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">HIV</FormLabel></FormItem>)} />
                                <FormField control={form.control} name="awaitingResultsFor.hepB" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Hepatitis B</FormLabel></FormItem>)} />
                                <FormField control={form.control} name="awaitingResultsFor.hepC" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Hepatitis C</FormLabel></FormItem>)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
      <MedicalHistoryTabs form={form} />
    </div>
  );
}
