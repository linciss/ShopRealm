import { auth } from '../../../../auth';
import { redirect } from 'next/navigation';
import { getStoreName } from '../../../../data/store';
import { StoreNavigation } from '@/components/custom/shop/store-navigation';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user.hasStore) {
    return redirect('/create-store');
  }

  const storeName: string | undefined = await getStoreName();

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='flex flex-1'>
        <StoreNavigation storeName={storeName || ''} />
        <div className='flex-1 container '>{children}</div>
      </div>
    </div>
  );
}
