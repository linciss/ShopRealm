'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
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

type Role = 'SHOPPER' | 'STORE';

interface RoleSwitcherProps {
  session: Session | null;
}

export default function RoleSwitcher({ session }: RoleSwitcherProps) {
  const [role, setRole] = useState<Role>(
    (session?.user?.role as Role) || 'SHOPPER',
  );

  if (!session) return null;

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    switchRole();
    if (newRole === 'STORE') {
      return redirect('/store');
    }

    redirect('/products');
  };

  return (
    <DropdownMenu>
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
        <DropdownMenuItem
          className={`{flex items-center gap-2 cursor-pointer',
            ${role === 'SHOPPER' ? 'bg-primary/10}' : null}`}
          onClick={() => handleRoleChange('SHOPPER')}
        >
          <ShoppingBag className='h-4 w-4' />
          <span>Pirceja loma</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            'flex items-center gap-2 cursor-pointer',
            role === 'STORE' && 'bg-primary/10',
          )}
          onClick={() => handleRoleChange('STORE')}
        >
          <Store className='h-4 w-4' />
          <span>Veikala loma</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
