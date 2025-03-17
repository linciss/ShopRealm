import { CreateStore } from '@/components/custom/shop/create-store';
import { auth } from '../../../../../auth';
import { redirect } from 'next/navigation';

export default async function StoreCreate() {
  const session = await auth();

  if (!session?.user) return { error: 'Error' };

  if (session.user.hasStore) redirect('/store');
  return (
    <div className='py-10'>
      <CreateStore />
    </div>
  );
}
