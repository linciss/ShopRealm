import initTranslations from '@/app/i18n';
import { StoreForms } from '@/components/custom/shop/settings/store-forms';
import { getUserData } from '../../../../../data/user-data';
import { Metadata } from 'next';

interface StoreCreateProps {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: 'Shop Realm',
  description:
    'Create your store to be able to sell your products. You can create your store in a few simple steps. Admins will review your store and approve it. After that you can start selling your products.',
};

export default async function StoreCreate({ params }: StoreCreateProps) {
  const { locale } = await params;

  const { t } = await initTranslations(locale, ['productPage']);
  const userData = await getUserData();

  return (
    <div className='py-10'>
      <div className='flex flex-col mx-auto gap-3 justify-center container max-w-3xl'>
        <h1 className='text-4xl font-semibold text-center'>
          {t('createYourStore')}
        </h1>
        <p className='text-base font-normal text-muted-foreground text-center'>
          {t('createStoreDesc')}
        </p>
        <StoreForms storeInfo={{ phone: userData?.phone || '' }} />
      </div>
    </div>
  );
}
