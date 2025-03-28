import { ProductCard } from '@/components/custom/product-card';
import { SideFilters } from '@/components/custom/side-filters';

export default function Products() {
  return (
    <div className='font-[family-name:var(--font-geist-sans)] text-foreground bg-background md:container mx-auto px-4 sm:px-6 lg:px-14'>
      <div className='flex flex-col gap-14'>
        <section className='mt-3'>
          <h1 className='font-semibold text-3xl'>Visi produkti</h1>
        </section>
        <div className='flex flex-row gap-8'>
          <SideFilters />
          <section className='flex-1 grid  gap-x-2 gap-y-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1'>
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </section>
        </div>
      </div>
    </div>
  );
}
