'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

import { DataCard } from '../data-card';
import { OrderInfo } from '../order-info';
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
    image: string | null;
    id: string;
  };
  priceAtOrder: number;
  quantity: number;
}

interface OrderDetailsProps {
  orderItem: OrderItem | undefined;
  backCallback: () => void;
}

export const OrderDetails = ({
  orderItem,
  backCallback,
}: OrderDetailsProps) => {
  const { t } = useTranslation();

  if (!orderItem) return null;

  return (
    <div className='flex flex-col mt-5 gap-5'>
      <div className='flex justify-between items-center'>
        <Button
          onClick={() => {
            backCallback();
          }}
          variant={'ghost'}
        >
          <ArrowLeft /> {t('back')}
        </Button>
        {badgeMap(orderItem.status || '')}
      </div>
      <div className='grid md:grid-cols-3 grid-cols-2 gap-5'>
        <div className='col-span-2'>
          <OrderInfo
            name={orderItem.product.name}
            image={orderItem.product.image}
            priceAtOrder={orderItem.priceAtOrder}
            quantity={orderItem.quantity}
            total={orderItem.total}
            t={t}
          />
        </div>

        <div className='col-span-1'>
          <DataCard
            dataType={t('dataTypeStore')}
            name={orderItem.store.name}
            email={orderItem.store.user.email}
            phone={orderItem.store.storePhone}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};
