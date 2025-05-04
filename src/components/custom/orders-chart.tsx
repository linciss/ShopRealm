'use client';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useTranslation } from 'react-i18next';

interface ChartDataProps {
  days: Record<string, number>;
}

export const OrdersChart = ({ days }: ChartDataProps) => {
  const { t, i18n } = useTranslation();

  const chartConfig = {
    orders: {
      label: t('orders'),
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  const chartData = (() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 6 + i);
      return date.toISOString().split('T')[0];
    });

    return last7Days.map((dateStr) => {
      const date = new Date(dateStr);
      const formattedDate = date.toLocaleDateString(i18n.language, {
        month: 'short',
        day: 'numeric',
      });

      return {
        day: formattedDate,
        orders: days[dateStr] || 0,
      };
    });
  })();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('orderOverview')}</CardTitle>
        <CardDescription>{t('stats')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='day'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dashed' />}
            />
            <Bar dataKey='orders' fill='hsl(var(--primary))' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
