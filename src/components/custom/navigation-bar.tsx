import Link from 'next/link';
import { Button } from '../ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

import { auth } from '../../../auth';
import { ShoppingCart } from 'lucide-react';
import { NavigationShopper } from './navigation-shopper';
import { ThemeToggle } from './theme-toggle';
import { MobileMenu } from './mobile-menu';
import { NavigationAuth } from './navigation-dropdown';
import { NavSearch } from './nav-search';

interface NavigationBarProps {
  locale: string;
}

//  navigation component for the website
export const NavigationBar = async ({ locale }: NavigationBarProps) => {
  const session = await auth();

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='px-4 flex h-16 items-center justify-between'>
        <div className='mr-4 hidden md:flex'>
          <Link href='/products' className='mr-6 flex items-center space-x-2'>
            <span className='text-xl font-bold'>Shop Realm</span>
          </Link>
          {session?.user.role !== 'STORE' && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationShopper locale={locale} />
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        {session?.user.role !== 'STORE' && <NavSearch />}

        <div className='flex flex-1 md:flex-grow-0 items-center md:justify-end space-x-4 justify-between'>
          <div className='flex flex-1 items-center  space-x-4 '>
            <MobileMenu locale={locale} />

            <Link
              href='/products'
              className='mr-6 flex items-center space-x-2 md:hidden'
            >
              <span className='text-xl font-bold'>Shop Realm</span>
            </Link>
          </div>

          <div className='flex flex-1  items-center justify-end  space-x-4  '>
            {session?.user.role !== 'STORE' && (
              <Link href='/cart' prefetch={false} aria-label='Cart page'>
                <Button variant='ghost' size='icon' aria-label='Cart page'>
                  <ShoppingCart className='h-5 w-5' />
                  <span className='sr-only'>Cart</span>
                </Button>
              </Link>
            )}

            <NavigationAuth session={session || null} locale={locale} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
