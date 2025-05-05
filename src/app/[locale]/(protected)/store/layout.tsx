import { auth } from '../../../../../auth';
import { redirect } from 'next/navigation';
import { getStoreName } from '../../../../../data/store';
import { StoreNavigation } from '@/components/custom/shop/store-navigation';
import { FALLBACK_REDIRECT } from '../../../../../routes';
import { StorePaymentSetupBanner } from '@/components/custom/shop/payment-setup-banner';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(FALLBACK_REDIRECT);
  }

  if (!session?.user.hasStore) {
    return redirect('/create-store');
  }
  const storeData = await getStoreName();

  const name = storeData?.name || '';
  const isStripeConnected = storeData?.isStripeConnected || false;

  return (
    <div className='flex min-h-screen flex-col max-w-full '>
      <div className='flex flex-1'>
        <StoreNavigation storeName={name || ''} />
        <div className='flex-1 max-w-7xl mx-auto pt-6 p-2 md:p-8'>
          <StorePaymentSetupBanner
            isStripeConnected={isStripeConnected}
            storeName={name || ''}
          />
          {children}
        </div>
      </div>
    </div>
  );
}
