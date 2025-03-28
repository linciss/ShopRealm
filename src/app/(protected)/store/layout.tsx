import { auth } from '../../../../auth';
import { redirect } from 'next/navigation';
import { getStoreName } from '../../../../data/store';
import { StoreNavigation } from '@/components/custom/shop/store-navigation';
import { FALLBACK_REDIRECT } from '../../../../routes';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    console.log(session, 'user isnt logged in ');
    redirect(FALLBACK_REDIRECT);
  }

  if (!session?.user.hasStore) {
    return redirect('/create-store');
  }

  const storeName: string | undefined = await getStoreName();

  console.log(storeName);

  return (
    <div className='flex min-h-screen flex-col max-w-full '>
      <div className='flex flex-1'>
        <StoreNavigation storeName={storeName || ''} />
        <div className='flex-1 max-w-7xl mx-auto pt-6 p-2 md:p-8'>
          {children}
        </div>
      </div>
    </div>
  );
}
