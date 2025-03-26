import { auth } from '../../../auth';
import { redirect } from 'next/navigation';
import { FALLBACK_REDIRECT } from '../../../routes';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // if user accesses private routes wihtout session they are reidrect to fallback url which logs them out
  if (!session?.user?.id) {
    redirect(FALLBACK_REDIRECT);
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='flex flex-1'>
        <div className='w-full'>{children}</div>
      </div>
    </div>
  );
}
