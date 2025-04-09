import { redirect } from 'next/navigation';
import { getOrderItemById } from '../../../../../../data/orders';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { OrderInfo } from '@/components/custom/order-info';
import { ShippingInfo } from '@/components/custom/shop/orders/shipping-info';
import { StatusChange } from '@/components/custom/shop/orders/status-change';
import { DataCard } from '@/components/custom/data-card';

type Props = {
  params: Promise<{ id: string }>;
};

type Status = 'pending' | 'shipped' | 'complete' | 'returned';

export default async function Order({ params }: Props) {
  const { id } = await params;

  const order = await getOrderItemById(id);

  if (!order) redirect('/store/orders');

  return (
    <div className='space-y-4 mx-auto'>
      <div className='flex xl:items-center xl:flex-row flex-col gap-4 justify-between'>
        <div className='flex items-center gap-4'>
          <Link href={`/store/orders`} prefetch={true} aria-label='Orders page'>
            <Button aria-label='Order page button'>
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className='text-xl  font-bold md:text-2xl sm:text-xl'>
            Pasutijums {order.id}
          </h1>
        </div>
        <StatusChange
          initialStatus={order.status as Status}
          orderItemId={order.id}
        />
      </div>
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        <div className='xl:col-span-2'>
          <OrderInfo
            image={order.product.image}
            name={order.product.name}
            priceAtOrder={order.priceAtOrder}
            quantity={order.quantity}
            total={order.total}
          />
        </div>
        <div className='col-span-1 space-y-6'>
          <DataCard
            dataType={'Veiakala'}
            name={order.shippingName}
            lastName={order.shippingLastName}
            phone={order.shippingPhone}
            email={order.shippingEmail}
          />
          <ShippingInfo
            address={{
              street: order.shippingStreet || '',
              city: order.shippingCity || '',
              country: order.shippingCountry || '',
              postalCode: order.shippingPostalCode || '',
            }}
          />
        </div>
      </div>
    </div>
  );
}
