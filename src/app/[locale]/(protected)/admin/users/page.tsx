import initTranslations from '@/app/i18n';
import { getUserData } from '../../../../../../data/admin';
import { UsersTable } from '@/components/custom/admin/users-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { auth } from '../../../../../../auth';

interface StoreProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page: number; search: string }>;
}

export default async function Admin({ params, searchParams }: StoreProps) {
  const { locale } = await params;
  const session = await auth();
  const { page, search } = await searchParams;
  const { t } = await initTranslations(locale, ['productPage']);
  const userData = await getUserData({ page: page || 1, search });
  const pageCount = Math.ceil((userData?.totalUsers || 1) / 10);

  return (
    <div className='space-y-4'>
      <div className='flex flex-row justify-between'>
        <h1 className='text-3xl font-bold '>{t('userManagement')}</h1>
        {session?.user?.adminLevel === 'SUPER_ADMIN' && (
          <Link href={`/admin/users/configurator`}>
            <Button aria-label='Add admin'>
              <Plus />
              {t('addAdmin')}
            </Button>
          </Link>
        )}
      </div>

      <UsersTable users={userData?.users} t={t} pageCount={pageCount} />
      <UsersTable admins={userData?.admins} t={t} pageCount={1} />
    </div>
  );
}
