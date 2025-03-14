import Link from 'next/link';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';

interface RouteProps {
  label: string;
  href: string;
  description?: string;
}

export const NavigationShopper = () => {
  return (
    <>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Kategorijas</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2'>
            {catgeories.map((category: RouteProps, idx: number) =>
              idx === 0 ? (
                <li className='row-span-3' key={category.label}>
                  <NavigationMenuLink asChild>
                    <Link
                      className='flex h-full w-full select-none flex-col justify-start lg:justify-end rounded-md bg-gradient-to-b from-primary/20 to-primary/5 p-6 no-underline outline-none focus:shadow-md'
                      href={category.href}
                    >
                      <div className='mt-4 mb-2 text-lg font-medium'>
                        {category.label}
                      </div>
                      <p className='text-sm leading-tight text-muted-foreground'>
                        {category.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ) : (
                <li key={category.label}>
                  <NavigationMenuLink asChild>
                    <Link
                      className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                      href={category.href}
                    >
                      <div className='text-sm font-medium leading-none'>
                        {category.label}
                      </div>
                      <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                        {category.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ),
            )}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      {shopperLinks.map((link) => (
        <NavigationMenuItem key={link.label}>
          <Link href={link.href} legacyBehavior passHref>
            <NavigationMenuLink className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'>
              {link.label}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
    </>
  );
};

const catgeories: RouteProps[] = [
  {
    label: 'Visas preces',
    href: '/products',
    description:
      'Izvēlies no tūkstošiem produktiem, kas pieejami jums vienā vietā.',
  },
  {
    label: 'Elektronikas',
    href: '/electronics',
    description: 'Elektronikas preces',
  },
  {
    label: 'Mode',
    href: '/fashion',
    description: 'Izveido sev jaunu stilu',
  },
  {
    label: 'Majai',
    href: '/decoration',
    description: 'Papildini maju',
  },
];

const shopperLinks: RouteProps[] = [
  {
    label: 'Izpardosana',
    href: '/sale',
  },
  {
    label: 'Jaunumi',
    href: '/new',
  },
];

{
  /* <li className='row-span-3'>
              <NavigationMenuLink asChild>
                <Link
                  className='flex h-full w-full select-none flex-col justify-start lg:justify-end rounded-md bg-gradient-to-b from-primary/20 to-primary/5 p-6 no-underline outline-none focus:shadow-md'
                  href='/'
                >
                  <div className='mt-4 mb-2 text-lg font-medium'>
                    Visas preces
                  </div>
                  <p className='text-sm leading-tight text-muted-foreground'>
                    Ej cauri visam precem
                  </p>
                </Link>
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink asChild>
                <Link
                  className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                  href='/electronics'
                >
                  <div className='text-sm font-medium leading-none'>
                    Electronics
                  </div>
                  <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                    Gadgets, devices, and tech accessories
                  </p>
                </Link>
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink asChild>
                <Link
                  className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                  href='/fashion'
                >
                  <div className='text-sm font-medium leading-none'>
                    Fashion
                  </div>
                  <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                    Clothing, shoes, and accessories
                  </p>
                </Link>
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink asChild>
                <Link
                  className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                  href='/home'
                >
                  <div className='text-sm font-medium leading-none'>
                    Home & Garden
                  </div>
                  <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                    Furniture, decor, and outdoor items
                  </p>
                </Link>
              </NavigationMenuLink>
            </li> */
}
