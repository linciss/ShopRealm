'use client';

import { useParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ChartLine,
  LayoutDashboard,
  LucideProps,
  Package,
  Settings,
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
  const params = useParams<{ locale: string }>();

  const { t } = useTranslation();

  const routes: Route[] = [
    {
      href: '/store',
      icon: LayoutDashboard,
      label: t('panel'),
      active:
        pathname ===
        (params.locale === 'en' ? '' : `/${params.locale}`) + '/store',
    },
    {
      href: '/store/products',
      icon: Package,
      label: t('productHeading'),
      active:
        pathname ===
          (params.locale === 'en' ? '' : `/${params.locale}`) +
            '/store/products' ||
        pathname.startsWith(
          (params.locale === 'en' ? '' : `/${params.locale}`) +
            '/store/products',
        ),
    },
    {
      href: '/store/orders',
      icon: ShoppingCart,
      label: t('orders'),
      active:
        pathname ===
          (params.locale === 'en' ? '' : `/${params.locale}`) +
            '/store/orders' ||
        pathname.startsWith(
          (params.locale === 'en' ? '' : `/${params.locale}`) + '/store/orders',
        ),
    },
    {
      href: '/store/analytics',
      icon: ChartLine,
      label: t('analytics'),
      active:
        pathname ===
          (params.locale === 'en' ? '' : `/${params.locale}`) +
            '/store/analytics' ||
        pathname.startsWith(
          (params.locale === 'en' ? '' : `/${params.locale}`) +
            '/store/analytics',
        ),
    },
    {
      href: '/store/settings',
      icon: Settings,
      label: t('settings'),
      active:
        pathname ===
          (params.locale === 'en' ? '' : `/${params.locale}`) +
            '/store/settings' ||
        pathname.startsWith(
          (params.locale === 'en' ? '' : `/${params.locale}`) +
            '/store/settings',
        ),
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
