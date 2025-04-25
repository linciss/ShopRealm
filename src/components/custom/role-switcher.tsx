'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingBag, Store, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Session } from 'next-auth';
import { switchRole } from '../../../actions/auth/switch-role';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { useTranslation } from 'react-i18next';

type Role = 'SHOPPER' | 'STORE';

interface RoleSwitcherProps {
  session: Session | null;
}

export default function RoleSwitcher({ session }: RoleSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

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
    <Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild className='' aria-label='Role change'>
          <Button
            aria-label='Role change'
            variant='ghost'
            size='sm'
            className={'gap-2 h-9 px-2 flex'}
          >
            {role === 'SHOPPER' ? (
              <ShoppingBag className='h-4 w-4 text-primary' />
            ) : (
              <Store className='h-4 w-4 text-primary' />
            )}
            <span className='font-medium'>
              {role === 'SHOPPER' ? t('shopper') : t('store')}
            </span>
            <ChevronDown className='h-4 w-4 opacity-50' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[200px]'>
          <DropdownMenuLabel>{t('changeRole')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem
              className={cn(
                'flex items-center gap-2 cursor-pointer',
                role === 'SHOPPER' && 'bg-primary/10',
              )}
            >
              <ShoppingBag className='h-4 w-4' />
              <span>{t('shopperRole')}</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem
              className={cn(
                'flex items-center gap-2 cursor-pointer',
                role === 'STORE' && 'bg-primary/10',
              )}
            >
              <Store className='h-4 w-4' />
              <span>{t('storeRole')}</span>
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>

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
}
