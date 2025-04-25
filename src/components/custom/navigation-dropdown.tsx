import Link from 'next/link';
import { SignOutButton } from '../auth/sign-out-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { User } from 'lucide-react';
import { Session } from 'next-auth';
import { Button } from '../ui/button';
import initTranslations from '@/app/i18n';

interface NavigationAuthProps {
  session: Session | null;
  locale: string;
}

export const NavigationAuth = async ({
  session,
  locale,
}: NavigationAuthProps) => {
  const { t } = await initTranslations(locale || 'en', [
    'productPage',
    'errors',
    'success',
  ]);

  return session?.user.id ? (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label='Profile dropdown'>
          <User className='h-5 w-5' />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={'/profile'}>
            <DropdownMenuItem>{t('profile')}</DropdownMenuItem>
          </Link>
          <Link href={'/favorites'}>
            <DropdownMenuItem>{t('favorites')}</DropdownMenuItem>
          </Link>
          <SignOutButton>
            <DropdownMenuItem>{t('signOut')}</DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ) : (
    <>
      <Link
        href='/auth/sign-in'
        className=' md:flex'
        prefetch={false}
        aria-label='Login'
      >
        <Button variant='outline' size='sm' aria-label='Login Button'>
          {t('login')}
        </Button>
      </Link>
      <Link
        href='/auth/sign-up'
        className='hidden md:flex'
        prefetch={false}
        aria-label='Login'
      >
        <Button size='sm' aria-label='Login button'>
          {t('register')}
        </Button>
      </Link>
    </>
  );
};
