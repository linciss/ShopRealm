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
        <NavigationMenuTrigger>Preces</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2'>
            {catgeories.map((category: RouteProps, idx: number) =>
              idx === 0 ? (
                <li className='row-span-3' key={category.label}>
                  <NavigationMenuLink asChild>
                    <Link
                      prefetch={false}
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
                      prefetch={false}
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
          <Link href={link.href} legacyBehavior passHref prefetch={false}>
            <NavigationMenuLink className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'>
              {link.label}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
    </>
  );
};

// export const categoryMap: CategoryMap = {
//   electronics: { id: 'electronics', label: 'Elektronika' },
//   clothing: { id: 'clothing', label: 'Apgerbs' },
//   home: { id: 'home', label: 'Majas un virtuve' },
//   beauty: { id: 'beauty', label: 'Veseliba un skaistums' },
//   sports: { id: 'sports', label: 'Sports un atputa' },
//   toys: { id: 'toys', label: 'Rotaļlietas un spēles' },
//   books: { id: 'books', label: 'Gramatas un mediji' },
//   health: { id: 'health', label: 'Veseliba un labklajiba' },
//   automotive: { id: 'automotive', label: 'Auto un motocikli' },
//   jewelry: { id: 'jewelry', label: 'Rotaslietas un aksesuari' },
// };

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
    label: 'Rotallietas',
    href: '/toys',
    description: 'Rotallietas berniem',
  },
  {
    label: 'Majai',
    href: '/home',
    description: 'Majai un virtuvei',
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
  {
    label: 'Visas kategorijas',
    href: '/categories',
  },
];
