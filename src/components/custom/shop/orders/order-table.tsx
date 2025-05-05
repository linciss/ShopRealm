import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { statusMap } from './../../../../lib/utils';
import { formatCurrency } from './../../../../lib/format-currency';

export const badgeMap = (status: string, t: (value: string) => string) => {
  switch (status) {
    case 'pending':
      return (
        <p className='w-fit text-sm px-3 rounded-full border-blue-500 bg-blue-100 text-blue-500'>
          {t(status)}
        </p>
      );
    case 'shipped':
      return (
        <p className='w-fit text-sm px-3 rounded-full border-purple-500 bg-purple-100 text-purple-500'>
          {t(status)}
        </p>
      );
    case 'complete':
      return (
        <p className='w-fit text-sm px-3 rounded-full border-green-500 bg-green-100 text-green-700'>
          {t(status)}
        </p>
      );
    case 'returned':
      return (
        <p className='w-fit text-sm px-3 rounded-full border-red-500 bg-red-100 text-red-500'>
          {t(status)}
        </p>
      );
    default:
      return (
        <p className='w-fit text-sm px-3 rounded-full border-red-500 bg-red-100 text-red-500'>
          {t('canceled')}
        </p>
      );
  }
};

interface OrderTableProps {
  orders:
    | {
        id: string;
        status: string;
        order: {
          createdAt: Date;
        };
        quantity: number;
        priceAtOrder: number;
        total: number;
      }[]
    | undefined;
  t: (value: string) => string;
}

export const OrderTable = ({ orders, t }: OrderTableProps) => {
  return (
    <Card>
      <CardHeader className='sm:p-6 px-2 !pb-0'>
        <CardTitle className=''>{t('orderManager')}</CardTitle>
      </CardHeader>
      <CardContent className='sm:p-6 px-2'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('orderId')}</TableHead>
              <TableHead className='hidden md:table-cell'>
                {t('orderDate')}
              </TableHead>
              <TableHead>{t('orderStatus')}</TableHead>
              <TableHead className='hidden md:table-cell'>
                {t('total')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Button variant={'link'}>
                    <Link href={`/store/orders/${order.id}`} prefetch={true}>
                      {order.id}
                    </Link>
                  </Button>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {new Date(order.order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{badgeMap(statusMap[order.status].id, t)}</TableCell>
                <TableCell className='hidden md:table-cell'>
                  {formatCurrency(order.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
