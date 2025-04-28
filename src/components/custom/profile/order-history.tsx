'use client';

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
import { formatCurrency } from './../../../lib/format-currency';
import { useState } from 'react';
import { OrderDetails } from './order-details';
import { badgeMap } from '../shop/orders/order-table';
import { useTranslation } from 'react-i18next';

interface OrderItem {
  id: string;
  status: string;
  total: number;
  store: {
    name: string;
    storePhone: string;
    user: {
      email: string;
    };
  };
  product: {
    name: string;
    id: string;
    image: string | null;
  };
  priceAtOrder: number;
  quantity: number;
}

interface OrderHistory {
  createdAt: Date;
  orderItems: OrderItem[];
}

interface OrderHistoryProps {
  history?: OrderHistory[] | undefined;
}

export const OrderHistory = ({ history }: OrderHistoryProps) => {
  const [isViewingOrderInfo, setIsViewvingOrderInfo] = useState<boolean>(false);
  const [orderItem, setOrderItem] = useState<OrderItem | undefined>();
  const { t } = useTranslation();

  const handleOrderDetails = (value: OrderItem) => {
    setOrderItem(value);
    setIsViewvingOrderInfo(true);
  };

  const backCallback = () => {
    setIsViewvingOrderInfo(false);
    setOrderItem(undefined);
  };

  if (isViewingOrderInfo)
    return <OrderDetails orderItem={orderItem} backCallback={backCallback} />;

  return (
    <Card>
      <CardHeader className='sm:p-6 px-2'>
        <CardTitle className='text-2xl  font-semibold leading-none tracking-tight'>
          {t('myOrders')}
        </CardTitle>
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
                {t('orderTotal')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history?.map((order) =>
              order.orderItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Button
                      variant={'link'}
                      onClick={() => {
                        handleOrderDetails(item);
                      }}
                    >
                      {item.id}
                    </Button>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>{badgeMap(item.status)}</TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {formatCurrency(item.total)}
                  </TableCell>
                </TableRow>
              )),
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
