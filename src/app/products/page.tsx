import { SideFilters } from '@/components/custom/side-filters';

export default function Products() {
  return (
    <div className='font-[family-name:var(--font-geist-sans)] text-foreground bg-background container mx-auto px-4 sm:px-6 lg:px-14'>
      <div className='flex flex-col gap-14'>
        <section className='mt-3'>
          <h1 className='font-semibold text-3xl'>Visi produkti</h1>
        </section>
        <SideFilters />
      </div>
    </div>
  );
}
