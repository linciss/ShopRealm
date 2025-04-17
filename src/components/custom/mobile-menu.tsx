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

interface RouteProps {
  label: string;
  href: string;
}

const shopperLinks: RouteProps[] = [
  {
    label: 'Elektronikas',
    href: '/electronics',
  },
  {
    label: 'Rotallietas',
    href: '/toys',
  },
  {
    label: 'Majai',
    href: '/home',
  },
  {
    label: 'Veseliba un labklajiba',
    href: '/health',
  },
  {
    label: 'Auto un motocikli',
    href: '/automotive',
  },
  {
    label: 'Apgerbs',
    href: '/clothing',
  },
  {
    label: 'Sports un atputa',
    href: '/sports',
  },
  {
    label: 'Gramatas un mediji',
    href: '/books',
  },
  {
    label: 'Veseliba un skaistums',
    href: '/beauty',
  },
  {
    label: 'Rotaslietas un aksesuari',
    href: '/jewelry',
  },
];

const storeLinks: RouteProps[] = [
  {
    label: 'Panelis',
    href: '/store',
  },
  {
    href: '/store/products',
    label: 'Produkti',
  },
  {
    href: '/store/orders',
    label: 'Pasutijumni',
  },
];

export const MobileMenu = async () => {
  const session = await auth();

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
            <span className='sr-only'>Izvelne</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='w-[300px] sm:w-[350px]'>
          <SheetHeader>
            <SheetTitle className='text-left'>Shop Sphere</SheetTitle>
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
                    ? 'Visi produkti'
                    : 'Mans veikals'}
                </Link>
              </SheetClose>
              <div className='space-y-3'>
                <h3 className='font-medium'>Kategorijas</h3>
                <div className='grid grid-cols-1 gap-2'>
                  {routesToRender.map((route) => (
                    <SheetClose asChild key={route.href}>
                      <Link
                        href={route.href}
                        className='text-muted-foreground hover:text-foreground'
                      >
                        {route.label}
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
                      Izpardosana
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href='/new'
                      className='text-muted-foreground hover:text-foreground py-2'
                    >
                      Jaunumi
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
