import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className='relative overflow-hidden bg-background py-20 sm:py-32'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='lg:grid lg:grid-cols-12 lg:gap-8'>
          <div className='sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left'>
            <h1 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl'>
              Sveicināti <span className='text-primary'>Shop Sphere</span>
            </h1>
            <p className='mt-6 text-xl text-muted-foreground'>
              Jūsu universālā platforma, lai iepirktos plašā tirgū vai izveidotu
              savu veikalu. Atklājiet, pārdodiet un attīstieties, izmantojot
              Shop Sphere.
            </p>
            <div className='mt-10 sm:flex gap-4  lg:justify-start flex justify-center items-center'>
              <Button size='lg'>Iepirkties</Button>
              <Button size='lg' variant='outline'>
                Atvērt savu veikalu
              </Button>
            </div>
          </div>
          <div className='mt-12 lg:col-span-6 lg:mt-0'>
            <div className='relative mx-auto w-full max-w-lg lg:max-w-md'>
              <div className='aspect-w-5 aspect-h-3 rounded-lg bg-primary/10 shadow-xl overflow-hidden'>
                <Image
                  priority
                  src='https://kzmlp0g13xkhf3iwox9m.lite.vusercontent.net/placeholder.svg?height=400&width=600'
                  alt='Shop Sphere App'
                  className='object-cover object-center'
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
