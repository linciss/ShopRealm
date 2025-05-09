import Link from 'next/link';
import {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  Gamepad2,
} from 'lucide-react';

const categories = [
  { id: 'electronics', icon: Smartphone },
  { id: 'clothing', icon: Shirt },
  { id: 'home', icon: Home },
  { id: 'beauty', icon: Sparkles },
  { id: 'sports', icon: Dumbbell },
  { id: 'toys', icon: Gamepad2 },
];

interface CategoryGridProps {
  t: (value: string) => string;
}

export const CategoryGrid = ({ t }: CategoryGridProps) => {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.id}`}
          className='flex flex-col items-center p-4 rounded-lg transition-all hover:bg-background hover:shadow-md'
        >
          <div className='h-16 w-16 md:h-20 md:w-20 flex items-center justify-center rounded-full bg-primary/10 mb-3'>
            <category.icon className='h-8 w-8 text-primary' />
          </div>
          <span className='text-center font-medium'>{t(category.id)}</span>
        </Link>
      ))}
    </div>
  );
};
