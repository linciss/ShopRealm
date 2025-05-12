import initTranslations from '@/app/i18n';
import Link from 'next/link';
import { ChangeLocaleButton } from './profile/settings/change-locale-button';

const navigation = {
  solutions: [
    { name: 'productHeading', href: '/products' },
    { name: 'sellOn', href: '/create-store?direct=true' },
  ],
  company: [{ name: 'about', href: '/about' }],
};

interface FooterProps {
  locale: string;
}

const locales = [
  {
    value: 'en',
  },
  {
    value: 'lv',
  },
  {
    value: 'fr',
  },
];

export default async function Footer({ locale }: FooterProps) {
  const { t } = await initTranslations(locale || 'en', [
    'productPage',
    'errors',
    'success',
  ]);

  return (
    <footer className='bg-card' aria-labelledby='footer-heading'>
      <h2 id='footer-heading' className='sr-only'>
        {t('footer')}
      </h2>
      <div className=' py-12 md:py-16'>
        <div className='xl:grid xl:grid-cols-3 xl:gap-8 px-20'>
          <div className='space-y-8'>
            <h3 className='text-2xl font-bold text-card-foreground'>
              Shop Realm
            </h3>
            <p className='text-sm text-muted-foreground'>{t('makesBetter')}</p>
          </div>
          <div className='mt-16 grid grid-cols-3 gap-8 xl:col-span-2 xl:mt-0'>
            <div className='md:grid md:grid-cols-2 md:gap-8'>
              <div>
                <h3 className='text-sm font-semibold text-card-foreground'>
                  {t('solutions')}
                </h3>
                <ul role='list' className='mt-4 space-y-4'>
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className='text-sm text-muted-foreground hover:text-primary'
                      >
                        {t(item.name)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='md:grid md:grid-cols-1 md:gap-8'>
              <div>
                <h3 className='text-sm font-semibold text-card-foreground'>
                  {t('company')}
                </h3>
                <ul role='list' className='mt-4 space-y-4'>
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className='text-sm text-muted-foreground hover:text-primary'
                      >
                        {t(item.name)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='md:grid md:grid-cols-1 md:gap-8'>
              <div>
                <h3 className='text-sm font-semibold text-card-foreground'>
                  {t('changeLocale')}
                </h3>
                <ul role='list' className='mt-4 space-y-1'>
                  {locales.map((locale) => (
                    <li key={locale.value}>
                      <ChangeLocaleButton localeChange={locale.value} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-12 border-t border-border pt-8'>
          <p className='text-sm text-muted-foreground'>
            &copy; {new Date().getFullYear()} Shop Realm.{' '}
            {t('allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
