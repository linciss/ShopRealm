import { auth } from '../../../auth';
import { redirect } from 'next/navigation';
import { FALLBACK_REDIRECT } from '../../../routes';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  console.log('layout hit!');

  // if user accesses private routes wihtout session they are reidrect to fallback url which logs them out
  if (!session?.user?.id) {
    console.log(session, 'user isnt logged in ');
    redirect(FALLBACK_REDIRECT);
  }

  return (
    session?.user?.id && (
      <div className='flex min-h-screen flex-col'>
        <div className='flex flex-1'>
          <div className='w-full'>{children}</div>
        </div>
      </div>
    )
  );
}
