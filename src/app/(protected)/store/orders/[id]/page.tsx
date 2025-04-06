import { redirect } from 'next/navigation';
import { getOrderItemById } from '../../../../../../data/orders';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { OrderInfo } from '@/components/custom/shop/orders/order-info';
import { CustomerInfo } from '@/components/custom/shop/orders/customer-info';
import { ShippingInfo } from '@/components/custom/shop/orders/shipping-info';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Order({ params }: Props) {
  const { id } = await params;

  const order = await getOrderItemById(id);

  if (!order) redirect('/store/orders');

  return (
    <div className='space-y-4 mx-auto'>
      <div className='flex items-center flex-row gap-4'>
        <Link href={`/store/orders`} prefetch={true}>
          <Button>
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className='text-xl  font-bold md:text-2xl sm:text-xl'>
          Pasutijums {order.id}
        </h1>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='col-span-2'>
          <OrderInfo order={order} />
        </div>
        <div className='col-span-1 space-y-6'>
          <CustomerInfo
            user={{
              name: order.order.user.name,
              phone: order.order.user.phone,
              email: order.order.user.email,
            }}
          />
          <ShippingInfo
            address={{
              street: order.order.user.address?.street || '',
              city: order.order.user.address?.city || '',
              country: order.order.user.address?.country || '',
              postalCode: order.order.user.address?.postalCode || '',
            }}
          />
        </div>
      </div>
    </div>
  );
}
