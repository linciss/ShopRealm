import Link from 'next/link';

const navigation = {
  solutions: [
    { name: 'Produkti', href: '#' },
    { name: 'Pardod Shop Realm platforma', href: '#' },
  ],
  support: [{ name: 'Cena', href: '#' }],
  company: [{ name: 'Par mums', href: '#' }],
};

export default function Footer() {
  return (
    <footer className='bg-card' aria-labelledby='footer-heading'>
      <h2 id='footer-heading' className='sr-only'>
        Kajene
      </h2>
      <div className=' py-12 md:py-16'>
        <div className='xl:grid xl:grid-cols-3 xl:gap-8 px-20'>
          <div className='space-y-8'>
            <h3 className='text-2xl font-bold text-card-foreground'>
              Shop Realm
            </h3>
            <p className='text-sm text-muted-foreground'>
              Padara komerciju labaku
            </p>
          </div>
          <div className='mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0'>
            <div className='md:grid md:grid-cols-2 md:gap-8'>
              <div>
                <h3 className='text-sm font-semibold text-card-foreground'>
                  Risinajumi
                </h3>
                <ul role='list' className='mt-4 space-y-4'>
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className='text-sm text-muted-foreground hover:text-primary'
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='mt-10 md:mt-0'>
                <h3 className='text-sm font-semibold text-card-foreground'>
                  Palidziba
                </h3>
                <ul role='list' className='mt-4 space-y-4'>
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className='text-sm text-muted-foreground hover:text-primary'
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='md:grid md:grid-cols-1 md:gap-8'>
              <div>
                <h3 className='text-sm font-semibold text-card-foreground'>
                  Kompanija
                </h3>
                <ul role='list' className='mt-4 space-y-4'>
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className='text-sm text-muted-foreground hover:text-primary'
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-12 border-t border-border pt-8'>
          <p className='text-sm text-muted-foreground'>
            &copy; {new Date().getFullYear()} Shop Realm. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
