import { redirect } from 'next/navigation';
import { FALLBACK_REDIRECT } from '../../../../routes';
import { auth } from '../../../../auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Profile',
  description:
    'Configure your proifle details such as address and personal information aswell as account settings and order history',
};

export default async function ProfileLayout({
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
    session?.user?.id && (
      <div className='flex min-h-screen flex-col'>
        <div className='flex flex-1'>
          <div className='w-full max-w-7xl mx-auto px-2'>{children}</div>
        </div>
      </div>
    )
  );
}
