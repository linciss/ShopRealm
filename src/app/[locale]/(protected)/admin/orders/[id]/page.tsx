import initTranslations from '@/app/i18n';
import { Metadata } from 'next';
import { getOrderById } from '../../../../../../../data/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

import { StatusChange } from '@/components/custom/shop/orders/status-change';
import { OrderInfo } from '@/components/custom/order-info';
import { DataCard } from '@/components/custom/data-card';

interface StoreCreateProps {
  params: Promise<{ locale: string; id: string }>;
}

type Status = 'pending' | 'shipped' | 'complete' | 'returned';

export const metadata: Metadata = {
  title: 'Inspecting order',
  description: 'Inspecting order',
};

export default async function StoreCreate({ params }: StoreCreateProps) {
  const { locale, id } = await params;

  const { t } = await initTranslations(locale, ['productPage']);
  const orderData = await getOrderById(id);

  if (!orderData) {
    redirect('/admin/orders');
  }

  return (
    <div className='space-y-4 mx-auto'>
      <div className='flex xl:items-center xl:flex-row flex-col gap-4 justify-between'>
        <div className='flex items-center gap-4'>
          <Link
            href={`/admin/orders`}
            prefetch={false}
            aria-label='Orders page'
          >
            <Button aria-label='Order page button'>
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className='text-xl  font-bold md:text-2xl sm:text-xl'>
            {t('order')} {orderData.id}
          </h1>
        </div>
        <StatusChange
          initialStatus={orderData.status as Status}
          orderItemId={orderData.id}
        />
      </div>
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        <div className='xl:col-span-2'>
          <OrderInfo
            image={orderData.product.image}
            name={orderData.product.name}
            priceAtOrder={orderData.priceAtOrder}
            quantity={orderData.quantity}
            total={orderData.total}
            t={t}
          />
        </div>
        <div className='col-span-1 space-y-6'>
          <DataCard
            dataType={t('dataTypeShopper')}
            name={orderData.shippingName}
            lastName={orderData.shippingLastName}
            phone={orderData.shippingPhone}
            email={orderData.shippingEmail}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
