import { auth } from '../../../../../auth';
import { redirect } from 'next/navigation';
import { FALLBACK_REDIRECT } from '../../../../../routes';
import { AdminNavigation } from '@/components/custom/admin/admin-navigation';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(FALLBACK_REDIRECT);
  }

  if (!session.user.admin) {
    redirect('/products');
  }

  return (
    <div className='flex min-h-screen flex-col max-w-full '>
      <div className='flex flex-1'>
        <AdminNavigation userName={session.user.name || ''} />
        <div className='flex-1 max-w-7xl mx-auto pt-6 p-2 md:p-8'>
          {children}
        </div>
      </div>
    </div>
  );
}
