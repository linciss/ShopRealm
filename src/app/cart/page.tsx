import { CartContent } from '@/components/custom/cart/cart-content';
import { auth } from '../../../auth';
import { getCartProducts } from '../../../data/cart';
import { SumCard } from '@/components/custom/sum-card';
import { VerifyEmailBanner } from '@/components/custom/verify-email-banner';

export default async function CartPage() {
  const session = await auth();

  const res = await getCartProducts();
  const cartProducts = res?.cartProducts;
  const emailVerified = res?.verifiedEmail;

  const subTotal = cartProducts?.reduce(
    (accumulator, currProd) =>
      accumulator + currProd.quantity * parseInt(currProd.product.price),
    0,
  );

  return (
    <>
      {!emailVerified && <VerifyEmailBanner />}
      <div className='container max-w-7xl mx-auto py-8'>
        <div className=''>
          <h2 className='text-3xl font-bold'>Grozs</h2>
        </div>
        <div className='flex flex-row gap-6'>
          <div className='mt-5 w-full grid grid-cols-1 md:grid-cols-3  gap-6 md:flex-row'>
            <CartContent session={session} cart={cartProducts} />
            <SumCard subTotal={subTotal || 0} />
          </div>
        </div>
      </div>
    </>
  );
}
