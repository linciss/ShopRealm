'use client';

import { useParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  LucideProps,
  Package,
  Store,
  User,
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface StoreNavigationProps {
  userName: string;
}

interface Route {
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  active: boolean;
}

export function AdminNavigation({ userName }: StoreNavigationProps) {
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();

  const { t } = useTranslation();

  const routes: Route[] = [
    {
      href: '/admin',
      icon: LayoutDashboard,
      label: t('adminPanel'),
      active:
        pathname ===
        (params.locale === 'en' ? '' : `/${params.locale}`) + '/admin',
    },
    {
      href: '/admin/stores',
      icon: Store,
      label: t('stores'),
      active:
        pathname ===
          (params.locale === 'en' ? '' : `/${params.locale}`) +
            '/admin/stores' ||
        pathname.startsWith(
          (params.locale === 'en' ? '' : `/${params.locale}`) +
            '/admin/stores/',
        ),
    },
    {
      href: '/admin/users',
      icon: User,
      label: t('users'),
      active:
        pathname ===
          (params.locale === 'en' ? '' : `/${params.locale}`) +
            '/admin/users' ||
        pathname.startsWith(
          (params.locale === 'en' ? '' : `/${params.locale}`) + '/admin/users/',
        ),
    },
    {
      href: '/admin/products',
      icon: Package,
      label: t('products'),
      active:
        pathname ===
          (params.locale === 'en' ? '' : `/${params.locale}`) +
            '/admin/products' ||
        pathname.startsWith(
          (params.locale === 'en' ? '' : `/${params.locale}`) +
            '/admin/products/',
        ),
    },
    {
      href: '/admin/orders',
      icon: Package,
      label: t('orders'),
      active:
        pathname ===
          (params.locale === 'en' ? '' : `/${params.locale}`) +
            '/admin/orders' ||
        pathname.startsWith(
          (params.locale === 'en' ? '' : `/${params.locale}`) +
            '/admin/orders/',
        ),
    },
  ];

  return (
    <div className=' flex-col min-h-full w-64 border-r bg-card md:flex hidden'>
      <div className='p-6'>
        <div className='flex items-center gap-2 mb-6'>
          <User className='h-6 w-6 text-primary' />
          <span className='text-xl font-semibold truncate'>{userName}</span>
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
