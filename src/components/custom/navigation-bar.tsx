import Link from 'next/link';
import { Button } from '../ui/button';

// route interface for the links so they are type safe
interface RouteProps {
  label: string;
  href: string;
}
//  navigation component for the website
export const NavigationBar = () => {
  return (
    <header className='sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-14 max-w-screen-2xl items-center justify-between'>
        <Link href='/' className='flex items-center gap-3' prefetch={false}>
          <span className='text-lg font-semibold'>Shop Sphere</span>
          <span className='sr-only'>Shop Sphere</span>
        </Link>
        <nav className='hidden md:flex gap-4'>
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className='relative font-semibold flex items-center text-sm transition-colors 
                    after:absolute after:h-[3px] after:bg-foreground after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center after:bottom-0 after:left-0'
              prefetch={true}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className='flex items-center gap-4'>
          <>
            <Link href='#' className='hidden md:flex'>
              <Button variant='outline' size='sm'>
                Pierakstīties
              </Button>
            </Link>
            <Link href='#' className='hidden md:flex'>
              <Button size='sm'>Reģistrēties</Button>
            </Link>
          </>
        </div>
      </div>
    </header>
  );
};

const links: RouteProps[] = [
  {
    label: '1',
    href: '/',
  },
  {
    label: '2',
    href: '/1',
  },
  {
    label: '3',
    href: '/2',
  },
];
