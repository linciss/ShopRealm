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
import { switchRole } from '../../../actions/switch-role';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

type Role = 'SHOPPER' | 'STORE';

interface RoleSwitcherProps {
  session: Session | null;
}

export default function RoleSwitcher({ session }: RoleSwitcherProps) {
  const [isPending, startTransition] = useTransition();

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
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className={'gap-1 h-9 px-2 hidden md:flex'}
          >
            {role === 'SHOPPER' ? (
              <ShoppingBag className='h-4 w-4 text-primary' />
            ) : (
              <Store className='h-4 w-4 text-primary' />
            )}
            <span className='font-medium'>
              {role === 'SHOPPER' ? 'Pircejs' : 'Veikals'}
            </span>
            <ChevronDown className='h-4 w-4 opacity-50' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[200px]'>
          <DropdownMenuLabel>Samainit lomu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem
              className={cn(
                'flex items-center gap-2 cursor-pointer',
                role === 'SHOPPER' && 'bg-primary/10',
              )}
            >
              <ShoppingBag className='h-4 w-4' />
              <span>Pirceja loma</span>
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
              <span>Veikala loma</span>
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mainīt lomu?</DialogTitle>
          <DialogDescription className='text-base'>
            Vai tiešām vēlaties mainīt lietotāja lomu uz{' '}
            {role === 'SHOPPER' ? 'Veikals' : 'Pircejs'}? <br />
            <b>Jums bus jaautorizejas velvienreiz</b>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => handleRoleChange()} disabled={isPending}>
            Apstiprināt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
