import initTranslations from '@/app/i18n';
import { StoreForms } from '@/components/custom/shop/settings/store-forms';
import { getUserData } from '../../../../../data/user-data';

interface StoreCreateProps {
  params: Promise<{ locale: string }>;
}
export default async function StoreCreate({ params }: StoreCreateProps) {
  const { locale } = await params;

  const { t } = await initTranslations(locale, ['productPage']);
  const userData = await getUserData();

  return (
    <div className='py-10'>
      <div className='flex flex-col mx-auto text-center gap-3 justify-center container max-w-3xl'>
        <h1 className='text-4xl font-semibold'>{t('createYourStore')}</h1>
        <p className='text-base font-normal text-muted-foreground'>
          {t('createStoreDesc')}
        </p>
        <StoreForms storeInfo={{ phone: userData?.phone || '' }} />
      </div>
    </div>
  );
}
