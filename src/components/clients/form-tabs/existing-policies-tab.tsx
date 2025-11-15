
'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ExistingPoliciesTable from '../existing-policies-table';
import DeclinedPoliciesTable from '../declined-policies-table';

type ExistingPoliciesTabProps = {
  form: UseFormReturn<any>;
};

export default function ExistingPoliciesTab({ form }: ExistingPoliciesTabProps) {
  const hasExistingPolicies = form.watch('hasExistingPolicies');
  const declinedPolicy = form.watch('declinedPolicy');

  return (
    <div className="space-y-8">
      <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>Existing Life Insurance Policies</h3>
        </div>
        <Separator className="my-0" />
        <div className="p-4 border border-t-0 rounded-b-md space-y-6">
          <FormField
            control={form.control}
            name="hasExistingPolicies"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Do you have any existing life insurance policies with this or any other company?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><RadioGroupItem value="yes" /></FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><RadioGroupItem value="no" /></FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {hasExistingPolicies === 'yes' && (
            <ExistingPoliciesTable form={form} fieldName="existingPoliciesDetails" />
          )}
        </div>
      </div>

      <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>Declined / Postponed Life Insurance</h3>
        </div>
        <Separator className="my-0" />
        <div className="p-4 border border-t-0 rounded-b-md space-y-6">
          <FormField
            control={form.control}
            name="declinedPolicy"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Have you ever had an application for life, critical illness, or disability insurance declined, postponed, or accepted on special terms?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><RadioGroupItem value="yes" /></FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><RadioGroupItem value="no" /></FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {declinedPolicy === 'yes' && (
            <DeclinedPoliciesTable form={form} fieldName="declinedPolicyDetails" />
          )}
        </div>
      </div>
    </div>
  );
}
