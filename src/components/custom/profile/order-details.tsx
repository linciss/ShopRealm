import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

import { DataCard } from '../data-card';
import { OrderInfo } from '../order-info';
import { badgeMap } from '../shop/orders/order-table';

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
          <ArrowLeft /> Atpakal
        </Button>
        {badgeMap(orderItem.status || '')}
      </div>
      <div className='grid grid-cols-3 gap-5'>
        <div className='col-span-2'>
          <OrderInfo
            name={orderItem.product.name}
            image={orderItem.product.image}
            priceAtOrder={orderItem.priceAtOrder}
            quantity={orderItem.quantity}
            total={orderItem.total}
          />
        </div>

        <div className='col-span-1'>
          <DataCard
            dataType='Veikala'
            name={orderItem.store.name}
            email={orderItem.store.user.email}
            phone={orderItem.store.storePhone}
          />
        </div>
      </div>
    </div>
  );
};
