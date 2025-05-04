import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { formatCurrency } from './../../../../lib/format-currency';

interface RecentOrdersProps {
  recentOrders: {
    id: string;
    total: number;
  }[];
  t: (value: string) => string;
}

export const RecentOrders = ({ recentOrders, t }: RecentOrdersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('recentOrders')}</CardTitle>
        <CardDescription>{t('recentOrdersDesc')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {recentOrders.length > 0 ? (
          recentOrders.map((order) => {
            return (
              <div
                key={order.id}
                className='flex flex-row items-center justify-between'
              >
                <div className=''>
                  <p>
                    {t('order')} {order.id}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {t('total')} {formatCurrency(order.total)}
                  </p>
                </div>
                <Link href={`/store/orders/${order.id}`}>
                  <Button variant={'outline'}>{t('view')}</Button>
                </Link>
              </div>
            );
          })
        ) : (
          <p className='text-muted-foreground'>{t('noRecentOrders')}</p>
        )}
      </CardContent>
    </Card>
  );
};
