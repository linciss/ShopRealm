import Link from 'next/link';
import { Button } from '../ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
// import { ThemeToggle } from './theme-toggle';
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
import { Menu, ShoppingCart, User } from 'lucide-react';
import { NavigationShopper } from './navigation-shopper';
import RoleSwitcher from './role-switcher';
import { ThemeToggle } from './theme-toggle';

//  navigation component for the website
export const NavigationBar = async () => {
  const session = await auth();

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
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
            <Button variant='outline' size='icon' className='mr-2 md:hidden'>
              <Menu className='h-4 w-4' />
              <span className='sr-only'>Toggle menu</span>
            </Button>

            <Link
              href='/products'
              className='mr-6 flex items-center space-x-2 md:hidden'
            >
              <span className='text-xl font-bold'>Shop Sphere</span>
            </Link>
          </div>

          <div className='flex flex-1 items-center justify-end  space-x-4  '>
            <RoleSwitcher session={session} />

            {session?.user.role === 'SHOPPER' && (
              <Button variant='ghost' size='icon'>
                <ShoppingCart className='h-5 w-5' />
                <span className='sr-only'>Cart</span>
              </Button>
            )}

            {session ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger>
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
                  className='hidden md:flex'
                  prefetch={true}
                >
                  <Button variant='outline' size='sm'>
                    Pierakstīties
                  </Button>
                </Link>
                <Link
                  href='/auth/sign-up'
                  className='hidden md:flex'
                  prefetch={true}
                >
                  <Button size='sm'>Reģistrēties</Button>
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
