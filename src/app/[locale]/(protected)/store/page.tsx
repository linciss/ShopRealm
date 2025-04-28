import initTranslations from '@/app/i18n';
import { StatCard } from '@/components/custom/shop/stat-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface StoreProps {
  params: Promise<{ locale: string }>;
}

export default async function Store({ params }: StoreProps) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ['productPage']);

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center flex-col md:flex-row gap-4'>
        <h1 className='text-3xl font-bold '>{t('panel')}</h1>
        <div className='space-x-2 flex-nowrap flex flex-row'>
          <Link href={`/store/products`}>
            <Button aria-label='Add item'>
              <Plus />
              {t('addProduct')}
            </Button>
          </Link>
        </div>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard />
        <StatCard />
        <StatCard />
        <StatCard />
      </div>
    </div>
  );
}
