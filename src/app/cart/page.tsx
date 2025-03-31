import { CartContent } from '@/components/custom/cart/cart-content';
import { auth } from '../../../auth';
import { getCartProducts } from '../../../data/cart';

export default async function CartPage() {
  const session = await auth();

  const cartProducts = await getCartProducts();

  return (
    <div className='container max-w-7xl mx-auto py-8'>
      <div className=''>
        <h2 className='text-3xl font-bold'>Grozs</h2>
      </div>
      <div className='flex flex-row gap-6'>
        <CartContent session={session} cartProducts={cartProducts} />
      </div>
    </div>
  );
}
