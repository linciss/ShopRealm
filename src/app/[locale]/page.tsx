import Features from '@/components/custom/features';
import Hero from '@/components/custom/hero';

export default function Home() {
  return (
    <div className='font-[family-name:var(--font-geist-sans)] text-foreground bg-background'>
      <Hero />
      <Features />
    </div>
  );
}
