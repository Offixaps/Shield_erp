
'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import LifestyleTab from '../lifestyle-tab';
import MedicalHistoryTabs from '../medical-history-tabs';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


type HealthTabProps = {
  form: UseFormReturn<any>;
};

export default function HealthTab({ form }: HealthTabProps) {
  const [bmi, setBmi] = React.useState<number | null>(null);

  const height = form.watch('height');
  const heightUnit = form.watch('heightUnit');
  const weight = form.watch('weight');

  React.useEffect(() => {
    if (height && weight && Number(height) > 0 && Number(weight) > 0) {
      let heightInMeters: number;
      switch (heightUnit) {
        case 'cm':
          heightInMeters = Number(height) / 100;
          break;
        case 'ft':
          heightInMeters = Number(height) * 0.3048;
          break;
        case 'm':
        default:
          heightInMeters = Number(height);
          break;
      }
      const calculatedBmi = Number(weight) / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi);
    } else {
      setBmi(null);
    }
  }, [height, heightUnit, weight]);
  
  return (
    <div className="space-y-8">
      <LifestyleTab form={form} bmi={bmi} />
      <MedicalHistoryTabs form={form} />
    </div>
  );
}
