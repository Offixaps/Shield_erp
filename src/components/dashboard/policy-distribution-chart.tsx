
'use client';

import * as React from 'react';
import { Pie, PieChart } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';

// The data for this chart will need to be fetched and calculated from Firestore.
// For now, we use an empty array to prevent build errors.
const policyDistributionData: any[] = [];

const chartConfig = {
  policies: {
    label: 'Policies',
  },
  'Auto Insurance': {
    label: 'Auto',
    color: 'hsl(var(--chart-1))',
  },
  'Health Insurance': {
    label: 'Health',
    color: 'hsl(var(--chart-2))',
  },
  'Life Insurance': {
    label: 'Life',
    color: 'hsl(var(--chart-3))',
  },
  'Home Insurance': {
    label: 'Home',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export default function PolicyDistributionChart() {
  if (policyDistributionData.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">No data to display</p>
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[300px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={policyDistributionData}
          dataKey="value"
          nameKey="name"
          innerRadius="60%"
          strokeWidth={5}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
