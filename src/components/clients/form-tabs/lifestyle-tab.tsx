
'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormControl, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import LifestyleDetailTable from '../lifestyle-detail-table';

type FormValues = any; // Replace with z.infer<typeof yourSchema>

type LifestyleTabProps = {
  form: UseFormReturn<FormValues>;
};

export default function LifestyleTab({ form }: LifestyleTabProps) {
  
  const flownAsPilot = form.watch('flownAsPilot');
  const hazardousSports = form.watch('hazardousSports');
  const travelOutsideCountry = form.watch('travelOutsideCountry');

  return (
    <div className="space-y-8">
      
       <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>Hazardous Activities and Travel</h3>
        </div>
        <Separator className="my-0" />
        <div className="p-4 border border-t-0 rounded-b-md space-y-6">
           <FormField
              control={form.control}
              name="flownAsPilot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Have you ever flown as a pilot, student pilot or crew member?</FormLabel>
                  <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {flownAsPilot === 'yes' && <LifestyleDetailTable form={form} fieldName="flownAsPilotDetails" itemOptions={['Pilot', 'Student Pilot', 'Crew Member']} />}

            <Separator />

            <FormField
              control={form.control}
              name="hazardousSports"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you engage in any hazardous sports or pastimes?</FormLabel>
                  <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl>
                  <FormDescription>E.g., Scuba diving, Mountain Climbing, Parachuting, Hang gliding, Paragliding, Automobile racing, Motorcycles Racing, Boat racing etc.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {hazardousSports === 'yes' && <LifestyleDetailTable form={form} fieldName="hazardousSportsDetails" itemOptions={['Scuba diving', 'Mountain Climbing', 'Parachuting', 'Hang gliding', 'Paragliding', 'Automobile racing', 'Motorcycles Racing', 'Boat racing']} />}

            <Separator />
            
            <FormField
              control={form.control}
              name="travelOutsideCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you have any intention to live, work or go on holiday outside your country of residence for more than 3 months?</FormLabel>
                  <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {travelOutsideCountry === 'yes' && <LifestyleDetailTable form={form} fieldName="travelOutsideCountryDetails" itemOptions={['Live Outside', 'Work outside', 'Go on Holiday']} />}

        </div>
      </div>
    </div>
  )
}
