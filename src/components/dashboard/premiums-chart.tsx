'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  collected: {
    label: 'Collected',
    color: 'hsl(var(--chart-1))',
  },
  outstanding: {
    label: 'Outstanding',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

type PremiumsChartProps = {
  data: any[];
};

export default function PremiumsChart({ data }: PremiumsChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
            tickFormatter={(value) => `GHS${Number(value) / 1000}k`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="collected" fill="var(--color-collected)" radius={4} />
        <Bar dataKey="outstanding" fill="var(--color-outstanding)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
