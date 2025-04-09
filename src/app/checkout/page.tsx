import { CheckoutForm } from '@/components/custom/checkout/checkout-form';
import { getUserShippingInfo } from '../../../data/user-data';
import { redirect } from 'next/navigation';
import { FALLBACK_REDIRECT } from '../../../routes';
import { SumCard } from '@/components/custom/sum-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CheckoutPageProps {
  searchParams: Promise<{ sum: number }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const user = await getUserShippingInfo();

  if (!user) {
    redirect(FALLBACK_REDIRECT);
  }

  const subTotal = (await searchParams).sum;

  return (
    <div className='container max-w-7xl mx-auto py-8'>
      <div className='flex items-center gap-4'>
        <Link href={`/cart`} prefetch={true} aria-label='Cart page'>
          <Button aria-label='Cart page button'>
            <ArrowLeft />
          </Button>
        </Link>
        <h2 className='text-3xl font-bold'>Pasutisana</h2>
      </div>
      <div className='w-full grid grid-cols-1 md:grid-cols-3  gap-6 md:flex-row'>
        <CheckoutForm userInfo={user} />
        <SumCard subTotal={subTotal} isCheckout={true} />
      </div>
    </div>
  );
}
