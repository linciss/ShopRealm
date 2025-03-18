import { auth } from '../../../auth';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }
  return (
    <div className='flex min-h-screen flex-col'>
      <div className='flex flex-1'>
        <div className='w-full'>{children}</div>
      </div>
    </div>
  );
}
