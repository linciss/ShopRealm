import { redirect } from 'next/navigation';
import { auth } from '../../../../auth';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) return;

  if (session.user.hasStore) redirect('/store');

  return (
    <div className='relative flex min-h-screen flex-col container'>
      <div className='sm:px-10 px-0'>{children}</div>
    </div>
  );
}
