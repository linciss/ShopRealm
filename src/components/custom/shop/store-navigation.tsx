'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  LucideProps,
  Package,
  ShoppingCart,
  Store,
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { BetterLink } from '../better-link';

interface StoreNavigationProps {
  storeName: string;
}

interface Route {
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  active: boolean;
}

export function StoreNavigation({ storeName }: StoreNavigationProps) {
  const pathname = usePathname();

  const routes: Route[] = [
    {
      href: '/store',
      icon: LayoutDashboard,
      label: 'Panelis',
      active: pathname === '/store',
    },
    {
      href: '/store/products',
      icon: Package,
      label: 'Produkti',
      active:
        pathname === '/store/products' ||
        pathname.startsWith('/store/products/'),
    },
    {
      href: '/store/orders',
      icon: ShoppingCart,
      label: 'Pasutijumni',
      active:
        pathname === '/store/orders' || pathname.startsWith('/store/orders/'),
    },
  ];

  return (
    <div className=' flex-col min-h-full w-64 border-r bg-card md:flex hidden'>
      <div className='p-6'>
        <div className='flex items-center gap-2 mb-6'>
          <Store className='h-6 w-6 text-primary' />
          <span className='text-xl font-semibold truncate'>{storeName}</span>
        </div>
        <nav className='space-y-1'>
          {routes.map((route) => (
            <BetterLink
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                route.active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <route.icon className='h-4 w-4' />
              {route.label}
            </BetterLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
