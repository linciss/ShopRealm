import { CheckoutForm } from '@/components/custom/checkout/checkout-form';
import { redirect } from 'next/navigation';
import { SumCard } from '@/components/custom/sum-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { VerifyEmailBanner } from '@/components/custom/verify-email-banner';
import { getUserShippingInfo } from '../../../../data/user-data';
import initTranslations from '@/app/i18n';

interface CheckoutPageProps {
  searchParams: Promise<{ sum: number }>;
  params: Promise<{ locale: string }>;
}

export default async function CheckoutPage({
  searchParams,
  params,
}: CheckoutPageProps) {
  const user = await getUserShippingInfo();
  const { locale } = await params;
  if (!user) {
    redirect('/cart');
  }

  const { t } = await initTranslations(locale, [
    'productPage',
    'errors',
    'success',
  ]);

  const subTotal = (await searchParams).sum;

  if (!user.emailVerified) return <VerifyEmailBanner t={t} />;

  return (
    <div className='container max-w-7xl mx-auto py-8'>
      <div className='flex items-center gap-4'>
        <Link href={`/cart`} prefetch={true} aria-label='Cart page'>
          <Button aria-label='Cart page button'>
            <ArrowLeft />
          </Button>
        </Link>
        <h2 className='text-3xl font-bold'>{t('checkout')}</h2>
      </div>
      <div className='w-full grid grid-cols-1 md:grid-cols-3  gap-6 md:flex-row'>
        <CheckoutForm userInfo={user} />
        <SumCard subTotal={subTotal} isCheckout={true} t={t} />
      </div>
    </div>
  );
}
