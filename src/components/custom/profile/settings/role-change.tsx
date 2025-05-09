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
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

type Role = 'SHOPPER' | 'STORE';

interface RoleSwitcherProps {
  session: Session | null;
  approved?: boolean | null;
}

export default function RoleSwitcher({ session, approved }: RoleSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();
  const { toast } = useToast();

  if (!session?.user.id) return null;

  const role = (session.user.role as Role) || 'SHOPPER';

  const handleRoleChange = () => {
    startTransition(() => {
      switchRole().then((res) => {
        if (res?.error) {
          toast({
            title: t('error'),
            description: t(res.error),
            variant: 'destructive',
          });
        }
      });
    });
  };
  let cardHeader;
  let cardContent;

  if (session.user.hasStore && approved) {
    cardHeader = (
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
    );
    cardContent = (
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
    );
  } else if (!session.user.hasStore) {
    cardHeader = (
      <>
        <CardTitle>{t('createStore')}</CardTitle>
      </>
    );
    cardContent = (
      <>
        <CardDescription>{t('createStoreDesc')}</CardDescription>
        <Button variant={'outline'} asChild className='mt-2'>
          <Link prefetch={false} href={'/create-store'}>
            {t('createStoreAction')}
          </Link>
        </Button>
      </>
    );
  } else {
    cardHeader = (
      <>
        <CardTitle>{t('waitingForApproval')}</CardTitle>
      </>
    );
    cardContent = (
      <>
        <CardDescription>{t('waitingForApprovalDesc')}</CardDescription>
      </>
    );
  }

  return (
    <CardWrapper
      cardHeader={cardHeader}
      cardContent={cardContent}
    ></CardWrapper>
  );
}
