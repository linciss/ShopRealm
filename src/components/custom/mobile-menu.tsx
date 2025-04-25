import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { auth } from '../../../auth';
import initTranslations from '@/app/i18n';

interface RouteProps {
  label: string;
  href: string;
}

const shopperLinks: RouteProps[] = [
  {
    label: 'electronics',
    href: '/products/category/electronics',
  },
  {
    label: 'toys',
    href: '/products/category/toys',
  },
  {
    label: 'home',
    href: '/products/category/home',
  },
  {
    label: 'health',
    href: '/products/category/health',
  },
  {
    label: 'automotive',
    href: '/products/category/automotive',
  },
  {
    label: 'clothing',
    href: '/products/category/clothing',
  },
  {
    label: 'sports',
    href: '/products/category/sports',
  },
  {
    label: 'books',
    href: '/products/category/books',
  },
  {
    label: 'beauty',
    href: '/products/category/beauty',
  },
  {
    label: 'jewelry',
    href: '/products/category/jewelry',
  },
];

const storeLinks: RouteProps[] = [
  {
    label: 'panel',
    href: '/store',
  },
  {
    href: '/store/products',
    label: 'productsHeading',
  },
  {
    href: '/store/orders',
    label: 'orders',
  },
];

interface MobileMenuProps {
  locale: string;
}

export const MobileMenu = async ({ locale }: MobileMenuProps) => {
  const session = await auth();

  const { t } = await initTranslations(locale || 'en', [
    'productPage',
    'errors',
    'success',
  ]);

  const routesToRender =
    session?.user.role === 'STORE' ? storeLinks : shopperLinks;

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='mr-2 md:hidden'
            aria-label='Menu'
          >
            <Menu className='h-5 w-5' />
            <span className='sr-only'>{t('menu')}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='w-[300px] sm:w-[350px]'>
          <SheetHeader>
            <SheetTitle className='text-left'>Shop Realm</SheetTitle>
          </SheetHeader>
          <div className='flex flex-col gap-4 py-6'>
            <div className='flex flex-col space-y-3'>
              <SheetClose asChild>
                <Link
                  href={
                    session?.user.role === 'SHOPPER' ? '/products' : '/store'
                  }
                  className='flex items-center py-2 text-lg font-semibold'
                >
                  {session?.user.role === 'SHOPPER'
                    ? t('allProducts')
                    : t('myStore')}
                </Link>
              </SheetClose>
              <div className='space-y-3'>
                <h3 className='font-medium'>{t('categories')}</h3>
                <div className='grid grid-cols-1 gap-2'>
                  {routesToRender.map((route) => (
                    <SheetClose asChild key={route.href}>
                      <Link
                        href={route.href}
                        className='text-muted-foreground hover:text-foreground'
                      >
                        {t(route.label)}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </div>
              {session?.user.role === 'SHOPPER' ? (
                <>
                  <SheetClose asChild>
                    <Link
                      href='/sale'
                      className='text-muted-foreground hover:text-foreground py-2'
                    >
                      {t('sale')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href='/new'
                      className='text-muted-foreground hover:text-foreground py-2'
                    >
                      {t('new')}
                    </Link>
                  </SheetClose>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
