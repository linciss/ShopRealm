import Link from 'next/link';
import { Button } from '../ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { ThemeToggle } from './theme-toggle';

// route interface for the links so they are type safe
interface RouteProps {
  label: string;
  href: string;
  description?: string;
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
          {links.map(({ label, href }) =>
            label === 'Veikals' ? (
              <NavigationMenu key={label}>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className='relative font-semibold flex items-center text-sm transition-colors !bg-transparent'>
                      Veikals
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
                        {storeLinks.map((link) => (
                          <ListItem key={link.label} {...link}>
                            {link.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <Link
                key={href}
                href={href}
                className='relative font-semibold flex items-center text-sm transition-colors 
                  after:absolute after:h-[3px] after:bg-foreground after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center after:bottom-0 after:left-0'
                prefetch={true}
              >
                {label}
              </Link>
            ),
          )}
        </nav>
        <div className='flex items-center gap-4'>
          <Link href='/auth/sign-in' className='hidden md:flex'>
            <Button variant='outline' size='sm'>
              Pierakstīties
            </Button>
          </Link>
          <Link href='/auth/sign-up' className='hidden md:flex'>
            <Button size='sm'>Reģistrēties</Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

const links: RouteProps[] = [
  {
    label: 'Veikals',
    href: '/',
  },
  {
    label: '2',
    href: '/1',
  },
  {
    label: 'Par mums',
    href: '/about',
  },
];

const storeLinks: RouteProps[] = [
  {
    label: 'Visas preces',
    href: '/products',
    description:
      'Izvēlies no tūkstošiem produktiem, kas pieejami jums vienā vietā.',
  },
  {
    label: 'Izpārdošana',
    href: '/sale',
    description:
      'Izvēlies no tūkstošiem produktu, kuri ir pieejami par zemākām cenām.',
  },
  {
    label: 'Jaunumi',
    href: '/new',
    description: 'Jauni produkti, kas nesen pievienoti.',
  },
  {
    label: 'Kategorijas',
    href: '/categories',
    description:
      'Izvēlies produktus pēc kategorijām, lai vieglāk atrastu to, ko meklē.',
  },
];

const ListItem = ({
  label,
  href,
  children,
}: RouteProps & { children?: string }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          className={
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
          }
          href={href}
        >
          <div className='text-sm font-medium leading-none'>{label}</div>
          <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
            <>{children}</>
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
