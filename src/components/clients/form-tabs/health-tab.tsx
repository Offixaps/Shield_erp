
'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import MedicalHistoryTabs from '../medical-history-tabs';

type HealthTabProps = {
  form: UseFormReturn<any>;
};

export default function HealthTab({ form }: HealthTabProps) {
  
  return (
    <div className="space-y-8">
      <MedicalHistoryTabs form={form} />
    </div>
  );
}
