'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';

import { ShoppingBag, Store } from 'lucide-react';
import { Session } from 'next-auth';

import { useTranslation } from 'react-i18next';
import { switchRole } from '../../../../../actions/auth/switch-role';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CardWrapper } from './card-wrapper';
import { CardDescription, CardTitle } from '@/components/ui/card';

type Role = 'SHOPPER' | 'STORE';

interface RoleSwitcherProps {
  session: Session | null;
}

export default function RoleSwitcher({ session }: RoleSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  console.log(session?.user.id);

  if (!session?.user.id) return null;

  const role = (session.user.role as Role) || 'SHOPPER';

  const handleRoleChange = () => {
    startTransition(() => {
      switchRole().then((res) => {
        console.log(res);
      });
    });
  };

  return (
    <CardWrapper
      cardHeader={
        <>
          <CardTitle>{t('roleChange')}</CardTitle>
          <CardDescription className={'gap-2 flex items-center'}>
            {t('currRole')}:{' '}
            {role === 'SHOPPER' ? (
              <ShoppingBag className='h-4 w-4 text-primary' />
            ) : (
              <Store className='h-4 w-4 text-primary' />
            )}
            <span className='font-medium'>
              {role === 'SHOPPER' ? t('shopper') : t('store')}
            </span>
          </CardDescription>
        </>
      }
      cardContent={
        <Dialog>
          <DialogTrigger asChild>
            <Button aria-label='Role change' variant='default' className={''}>
              {t('changeRole')}
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('changeRole')}</DialogTitle>
              <DialogDescription className='text-base'>
                {t('changeRolePrompt')}{' '}
                {role === 'SHOPPER' ? t('store') : t('shopper')}? <br />
                <b className='text-sm mt-1'>{t('authPrompt')}</b>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => handleRoleChange()} disabled={isPending}>
                {t('changeRole')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    ></CardWrapper>
  );
}
