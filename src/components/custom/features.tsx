import { ShoppingCart, Store, Search, CreditCard } from 'lucide-react';

interface FeatureProps {
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export default function Features() {
  return (
    <section className='bg-muted py-20 sm:py-32'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl lg:text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            Viss kas jums nepieciešams vienā vietā
          </h2>
          <p className='mt-4 text-lg text-muted-foreground'>
            Shop Realm apvieno labāko no tiešsaistes tirgus un e-komercijas
            platformām, lai jums sniegtu nevainojamu pieredzi.
          </p>
        </div>
        <div className='mt-16'>
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature) => (
              <div key={feature.name} className='pt-6'>
                <div className='flow-root rounded-lg bg-background px-6 pb-8'>
                  <div className='-mt-6'>
                    <div>
                      <span className='inline-flex items-center justify-center rounded-md bg-primary p-3 shadow-lg'>
                        <feature.icon
                          className='h-6 w-6 text-primary-foreground'
                          aria-hidden='true'
                        />
                      </span>
                    </div>
                    <h3 className='mt-8 text-lg font-semibold tracking-tight text-foreground'>
                      {feature.name}
                    </h3>
                    <p className='mt-5 text-base text-muted-foreground'>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const features: FeatureProps[] = [
  {
    name: 'Liels Produkta Klāsts',
    description:
      'Izvēlieties no tūkstošiem produktiem, kas pieejami jums vienā vietā.',
    icon: ShoppingCart,
  },
  {
    name: 'Izveido savu veikalu',
    description:
      'Izmantojiet mūsu platformu, lai izveidotu savu veikalu un sāktu pārdot.',
    icon: Store,
  },
  {
    name: 'Viegli Atrast',
    description:
      'Izmantojiet mūsu meklēšanas funkciju, lai atrastu produktus, ko vēlaties.',
    icon: Search,
  },
  {
    name: 'Droši Maksājumi',
    description:
      'Maksājiet droši un ērti, izmantojot mūsu platformas maksājumu sistēmu.',
    icon: CreditCard,
  },
];
