import initTranslations from '@/app/i18n';
import { StoreForms } from '@/components/custom/shop/settings/store-forms';
import { Metadata } from 'next';
import { getStoreDataById } from '../../../../../../../data/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ActiveForms } from '@/components/custom/shop/settings/active-forms';

interface StoreCreateProps {
  params: Promise<{ locale: string; id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit store',
  description: 'Edit user store',
};

export default async function StoreCreate({ params }: StoreCreateProps) {
  const { locale, id } = await params;

  const { t } = await initTranslations(locale, ['productPage']);
  const storeData = await getStoreDataById(id);

  if (!storeData) {
    redirect('/admin');
  }

  return (
    <div className='md:max-w-7xl space-y-5'>
      <div className='inline-flex space-x-2'>
        <Link href={`/admin/stores`}>
          <Button aria-label='Admin stores table'>
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className='text-3xl font-bold'>{t('editUserStore')}</h1>
      </div>

      <div className='grid lg:grid-cols-3 grid-cols-1 gap-6'>
        <div className='lg:col-span-2  col-span-1'>
          <StoreForms
            storeInfo={{
              id: storeData.id,
              phone: storeData.storePhone,
              name: storeData.name,
              description: storeData.description,
            }}
          />
        </div>
        <div className='col-span-1'>
          <ActiveForms activeValue={storeData.active} />
        </div>
      </div>
    </div>
  );
}
