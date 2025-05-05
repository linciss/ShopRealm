import { CartContent } from '@/components/custom/cart/cart-content';

import { SumCard } from '@/components/custom/sum-card';
import { VerifyEmailBanner } from '@/components/custom/verify-email-banner';
import { getCartProducts } from '../../../../data/cart';
import { auth } from '../../../../auth';
import initTranslations from '@/app/i18n';

interface CartPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CartPage({ params }: CartPageProps) {
  const session = await auth();
  const { locale } = await params;
  const { t } = await initTranslations(locale, [
    'productPage',
    'errors',
    'success',
  ]);

  const res = await getCartProducts();
  const cartProducts = res?.cartProducts;
  const emailVerified = res?.verifiedEmail;

  const subTotal = cartProducts?.reduce(
    (accumulator, currProd) =>
      accumulator +
      currProd.quantity *
        parseFloat(
          currProd.product.sale
            ? currProd.product.salePrice || '0'
            : currProd.product.price,
        ),
    0,
  );

  return (
    <>
      <div className='container max-w-7xl mx-auto py-8'>
        {session?.user.id && !emailVerified && <VerifyEmailBanner t={t} />}
        <div className=''>
          <h2 className='text-3xl font-bold'>{t('cart')}</h2>
        </div>
        <div className='flex flex-row gap-6'>
          <div className='mt-5 w-full grid grid-cols-1 md:grid-cols-3  gap-6 md:flex-row'>
            <CartContent session={session} cart={cartProducts} />
            <SumCard
              subTotal={subTotal || 0}
              t={t}
              canProceed={cartProducts && cartProducts?.length > 0}
              isGuest={!session?.user?.id}
            />
          </div>
        </div>
      </div>
    </>
  );
}
