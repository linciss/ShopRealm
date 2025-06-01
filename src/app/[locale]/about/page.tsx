import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, ShieldCheck, Zap, Heart, Globe, BarChart4 } from 'lucide-react';
import initTranslations from '@/app/i18n';
import { aboutUsData } from '../../../../data/store';

interface AboutProps {
  params: Promise<{ locale: string }>;
}
export default async function AboutPage({ params }: AboutProps) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ['productPage']);
  const data = await aboutUsData();

  return (
    <div className='container mx-auto px-4 py-12'>
      <section className='mb-20'>
        <div className='mx-auto max-w-3xl text-center'>
          <h1 className='mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'>
            {t('ourMission')}
          </h1>
          <p className='mx-auto mb-8 text-xl text-muted-foreground'>
            Shop Realm {t('isBuilding')}
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <Button asChild size='lg' className='gap-2'>
              <Link href='/create-store'>
                <Zap size={18} />
                {t('startSelling')}
              </Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/products'>{t('explore')}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className='mb-20'>
        <div className='mx-auto max-w-4xl'>
          <h2 className='mb-8 text-center text-3xl font-bold tracking-tight'>
            {t('outStory')}
          </h2>
          <div className='space-y-6 text-lg'>
            <p>Shop Realm {t('p1')}</p>
            <p>{t('p2')}</p>
            <p>{t('p3')}</p>
            <p>
              {t('today')}, Shop Realm {t('p4')}
            </p>
          </div>
        </div>
      </section>

      <section className='mb-20 rounded-xl bg-muted/50 py-16'>
        <div className='container'>
          <h2 className='mb-12 text-center text-3xl font-bold tracking-tight'>
            {t('ourCoreValues')}
          </h2>
          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
            {[
              {
                title: t('empowerment'),
                description: t('empDesc'),
                icon: <Users className='h-6 w-6' />,
              },
              {
                title: t('transparency'),
                description: t('transparencyDesc'),
                icon: <ShieldCheck className='h-6 w-6' />,
              },
              {
                title: t('community'),
                description: t('communityDesc'),
                icon: <Heart className='h-6 w-6' />,
              },
              {
                title: t('innovation'),
                description: t('innovationDesc'),
                icon: <Zap className='h-6 w-6' />,
              },
            ].map((value, index) => (
              <Card key={index} className='border-0 bg-background shadow-md'>
                <CardContent className='p-6'>
                  <div className='mb-4 rounded-full bg-primary/10 p-3 text-primary w-fit'>
                    {value.icon}
                  </div>
                  <h3 className='mb-2 text-xl font-bold'>{value.title}</h3>
                  <p className='text-muted-foreground'>{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TODO: change the nums to real */}
      <section className='mb-20'>
        <h2 className='mb-12 text-center text-3xl font-bold tracking-tight'>
          Shop Realm {t('byTheNumbers')}
        </h2>
        <div className='grid gap-6 sm:grid-cols-1 lg:grid-cols-3'>
          {[
            {
              value: data?.openStores,
              label: t('activeStores'),
              icon: <Globe className='h-6 w-6' />,
            },
            {
              value: data?.totalProducts,
              label: t('productsListed'),
              icon: <BarChart4 className='h-6 w-6' />,
            },
            {
              value: data?.totalCustomers,
              label: t('happyCustomers'),
              icon: <Users className='h-6 w-6' />,
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className='border border-primary/10 bg-gradient-to-br from-background to-muted/30'
            >
              <CardContent className='flex items-center p-6'>
                <div className='mr-4 text-primary'>{stat.icon}</div>
                <div>
                  <div className='text-3xl font-bold text-primary'>
                    {stat.value}
                  </div>
                  <div className='text-sm font-medium text-muted-foreground'>
                    {stat.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className='mt-20 border-t pt-12'>
        <div className='mx-auto max-w-4xl'>
          <h2 className='mb-8 text-center text-2xl font-bold tracking-tight'>
            {t('companyInfo')}
          </h2>
          <div className='text-center'>
            <div>
              {/* TODO: INSERT THE LOCATION MAP ?? */}
              <h3 className='mb-4 text-lg font-semibold'>{t('contact')}</h3>
              <ul className='space-y-2 text-muted-foreground'>
                <li>
                  <a href='mailto:shoprealm@linards.me'>shoprealm@linards.me</a>
                </li>
                <li>+371 22446688</li>
                <li>Ventspils iela 51</li>
                <li>Liepaja, Latvija</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
