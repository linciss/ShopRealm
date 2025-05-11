import initTranslations from '@/app/i18n';
import { UserForm } from '@/components/custom/admin/user-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { auth } from '../../../../../../../../auth';
import { getUserDataById } from '../../../../../../../../data/admin';
import { redirect } from 'next/navigation';

interface UserConfiguratorProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function UserConfigurator({
  params,
}: UserConfiguratorProps) {
  const session = await auth();
  const { locale, id } = await params;
  const { t } = await initTranslations(locale, ['productPage']);
  const userData = await getUserDataById(id);

  if (userData === null) {
    redirect('/admin/users');
  }

  if (userData?.adminPrivileges && session?.user.adminLevel !== 'SUPER_ADMIN') {
    redirect('/admin/users');
  }

  return (
    <div className='space-y-4'>
      <div className='inline-flex space-x-2'>
        <Link href={`/admin/users`}>
          <Button aria-label='Admin stores table'>
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className='text-3xl font-bold'>{t('userConfigurator')}</h1>
      </div>
      <UserForm
        adminLevel={session?.user?.adminLevel || 'ADMIN'}
        userData={userData}
      />
    </div>
  );
}
