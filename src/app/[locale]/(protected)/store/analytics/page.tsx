import {
  CalendarClock,
  ChartNoAxesCombinedIcon,
  CreditCard,
} from 'lucide-react';
import { StatCard } from '@/components/custom/shop/stat-card';
import initTranslations from '@/app/i18n';
import { getAnalytics } from '../../../../../../data/store';
import { formatCurrency } from '@/lib/format-currency';
import { RevenueChart } from '@/components/custom/revenue-chart';
import { TopProducts } from '@/components/custom/shop/stats/analytics-top';

interface AnalyticsProps {
  params: Promise<{ locale: string }>;
}

export default async function Analytics({ params }: AnalyticsProps) {
  const { locale } = await params;

  const { t } = await initTranslations(locale, ['productPage']);
  const {
    totalRevenue = 0,
    conversionRate = 0,
    avgOrderValue = 0,
    totalOrders = 0,
    totalCustomers = 0,
    revenuePerDay = {},
    topSelling = [],
    totalViews = 0,
  } = (await getAnalytics()) || {};

  return (
    <div className='space-y-4 '>
      <div className='flex flex-col gap-4'>
        <h1 className=' font-bold text-3xl '>{t('analytics')}</h1>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-6 lg:grid-cols-3'>
          <StatCard
            name={t('totalRevenue')}
            value={formatCurrency(totalRevenue)}
            icon={<CreditCard />}
          />
          <StatCard
            name={t('convRate')}
            value={`${parseFloat(conversionRate.toFixed(2))}%`}
            icon={<ChartNoAxesCombinedIcon />}
          />
          <StatCard
            name={t('avgOrderValue')}
            value={formatCurrency(avgOrderValue)}
            icon={<CalendarClock />}
          />
          <StatCard
            name={t('allOrders')}
            value={totalOrders}
            icon={<CalendarClock />}
          />
          <StatCard
            name={t('totalCustomers')}
            value={totalCustomers}
            icon={<CalendarClock />}
          />
          <StatCard
            name={t('totalInteractions')}
            value={totalViews}
            icon={<CalendarClock />}
          />
        </div>
      </div>

      <RevenueChart revenuePerDay={revenuePerDay} />
      <TopProducts t={t} topSelling={topSelling} />
    </div>
  );
}
