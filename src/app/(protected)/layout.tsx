import { SessionProvider } from 'next-auth/react';
import { auth } from '../../../auth';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className='relative flex min-h-screen flex-col container'>
      <SessionProvider session={session}>
        <div className='sm:px-10 px-0'>{children}</div>
      </SessionProvider>
    </div>
  );
}
