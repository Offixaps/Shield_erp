
'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import BeneficiaryTable from '../beneficiary-table';
import { Separator } from '@/components/ui/separator';

type BeneficiariesTabProps = {
  form: UseFormReturn<any>;
};

export default function BeneficiariesTab({ form }: BeneficiariesTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>Primary Beneficiaries</h3>
        </div>
        <Separator className="my-0" />
        <div className="p-4 border border-t-0 rounded-b-md">
          <BeneficiaryTable form={form} fieldName="primaryBeneficiaries" />
        </div>
      </div>

      <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>Contingent Beneficiaries</h3>
        </div>
        <Separator className="my-0" />
        <div className="p-4 border border-t-0 rounded-b-md">
          <BeneficiaryTable form={form} fieldName="contingentBeneficiaries" />
        </div>
      </div>
    </div>
  );
}
