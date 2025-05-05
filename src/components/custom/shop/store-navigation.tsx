'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ChartLine,
  LayoutDashboard,
  LucideProps,
  Package,
  ShoppingCart,
  Store,
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

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

  const { t } = useTranslation();

  const routes: Route[] = [
    {
      href: '/store',
      icon: LayoutDashboard,
      label: t('panel'),
      active: pathname === '/store',
    },
    {
      href: '/store/products',
      icon: Package,
      label: t('productHeading'),
      active:
        pathname === '/store/products' ||
        pathname.startsWith('/store/products/'),
    },
    {
      href: '/store/orders',
      icon: ShoppingCart,
      label: t('orders'),
      active:
        pathname === '/store/orders' || pathname.startsWith('/store/orders/'),
    },
    {
      href: '/store/analytics',
      icon: ChartLine,
      label: t('analytics'),
      active:
        pathname === '/store/analytics' ||
        pathname.startsWith('/store/analytics/'),
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
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                route.active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              prefetch={true}
            >
              <route.icon className='h-4 w-4' />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
