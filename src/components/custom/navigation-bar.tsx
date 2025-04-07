import Link from 'next/link';
import { Button } from '../ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { SignOutButton } from '../auth/sign-out-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { auth } from '../../../auth';
import { ShoppingCart, User } from 'lucide-react';
import { NavigationShopper } from './navigation-shopper';
import RoleSwitcher from './role-switcher';
import { ThemeToggle } from './theme-toggle';
import { MobileMenu } from './mobile-menu';

//  navigation component for the website
export const NavigationBar = async () => {
  const session = await auth();

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='px-4 flex h-16 items-center justify-between'>
        <div className='mr-4 hidden md:flex'>
          <Link href='/products' className='mr-6 flex items-center space-x-2'>
            <span className='text-xl font-bold'>Shop Sphere</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationShopper />
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className='flex flex-1 items-center md:justify-end space-x-4 justify-between'>
          <div className='flex flex-1 items-center  space-x-4 '>
            <MobileMenu />

            <Link
              href='/products'
              className='mr-6 flex items-center space-x-2 md:hidden'
            >
              <span className='text-xl font-bold'>Shop Sphere</span>
            </Link>
          </div>

          <div className='flex flex-1 items-center justify-end  space-x-4  '>
            <div
              className={`md:block ${
                session?.user.role === 'STORE' ? '' : 'hidden'
              }`}
            >
              <RoleSwitcher session={session} />
            </div>

            <Link href='/cart' prefetch={true} aria-label='Cart page'>
              <Button variant='ghost' size='icon' aria-label='Cart page'>
                <ShoppingCart className='h-5 w-5' />
                <span className='sr-only'>Cart</span>
              </Button>
            </Link>

            {session?.user.id ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger aria-label='Profile dropdown'>
                    <User className='h-5 w-5' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Mans konts</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href={'/profile'}>
                      <DropdownMenuItem>Profils </DropdownMenuItem>
                    </Link>
                    <Link href={'/favorites'}>
                      <DropdownMenuItem>Mani favoriti</DropdownMenuItem>
                    </Link>
                    <SignOutButton>
                      <DropdownMenuItem>Iziet</DropdownMenuItem>
                    </SignOutButton>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href='/auth/sign-in'
                  className=' md:flex'
                  prefetch={true}
                  aria-label='Login'
                >
                  <Button variant='outline' size='sm' aria-label='Login Button'>
                    Pierakstīties
                  </Button>
                </Link>
                <Link
                  href='/auth/sign-up'
                  className='hidden md:flex'
                  prefetch={true}
                  aria-label='Login'
                >
                  <Button size='sm' aria-label='Login button'>
                    Reģistrēties
                  </Button>
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
