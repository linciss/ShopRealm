import initTranslations from '@/app/i18n';
import { StoreForms } from '@/components/custom/shop/settings/store-forms';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStoreData } from '../../../../../../data/store';
import { redirect } from 'next/navigation';
import { FALLBACK_REDIRECT } from '../../../../../../routes';
import { ActiveForms } from '@/components/custom/shop/settings/active-forms';
import { Payments } from '@/components/custom/shop/settings/payments';
import { DangerZone } from '@/components/custom/shop/settings/danger-zone';

interface SettingsProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab: string }>;
}

export default async function Settings({
  params,
  searchParams,
}: SettingsProps) {
  const { locale } = await params;
  const { tab } = await searchParams;

  const { t } = await initTranslations(locale, ['productPage']);

  const store = await getStoreData();

  if (!store) redirect(FALLBACK_REDIRECT);

  return (
    <div className='space-y-4 '>
      <div className='flex flex-col gap-4'>
        <h1 className=' font-bold text-3xl '>{t('settings')}</h1>
      </div>
      <Tabs defaultValue={tab || 'general'} className='space-y-4'>
        <TabsList>
          <TabsTrigger value='general'>{t('general')}</TabsTrigger>
          <TabsTrigger value='payment'>{t('payment')}</TabsTrigger>
          <TabsTrigger value='dangerZone'>{t('dangerZone')}</TabsTrigger>
        </TabsList>
        <TabsContent
          value='general'
          className='grid lg:grid-cols-3 grid-cols-1 gap-6'
        >
          <div className='lg:col-span-2  col-span-1'>
            <StoreForms
              storeInfo={{
                phone: store.storePhone,
                name: store.name,
                description: store.description,
              }}
            />
          </div>
          <div className='col-span-1'>
            <ActiveForms activeValue={store.active} />
          </div>
        </TabsContent>
        <TabsContent value='payment' className='space-y-4'>
          <Payments t={t} stripeAccountId={store.stripeAccountId} />
        </TabsContent>
        <TabsContent value='dangerZone' className='space-y-4'>
          <DangerZone />
        </TabsContent>
      </Tabs>
    </div>
  );
}
