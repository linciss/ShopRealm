'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useTranslation } from 'react-i18next';

const categories = [
  {
    id: '',
    label: 'Notirit',
  },
  {
    id: 'electronics',
    label: 'Elektronika',
  },
  { id: 'clothing' },
  { id: 'home' },
  { id: 'beauty' },
  { id: 'sports' },
  { id: 'toys' },
  { id: 'books' },
  { id: 'health' },
  { id: 'automotive' },
  { id: 'jewelry' },
];

interface ProductFilterProps {
  selectedCategory: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  search: string;
}

export const ProductFilters = ({
  selectedCategory,
  minPrice,
  maxPrice,
  search,
}: ProductFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);

  const [searchValue, setSearchValue] = useState(search);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice || 0,
    maxPrice || 10000,
  ]);
  const [category, setCategory] = useState<string>(selectedCategory);

  useEffect(() => {
    const urlCategory = searchParams.get('category') || '';

    if (urlCategory !== category) {
      setCategory(urlCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const { t } = useTranslation();

  const createQueryString = (
    params: Record<string, string | number | null>,
  ) => {
    // deletes the page query if applying the filter so it doesnt show like page 13 for example
    const newSearchParams = new URLSearchParams(searchParams.toString());

    newSearchParams.delete('page');

    // iterates thorugh the query params and deletes them or add themn based on the user filter
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    });

    return newSearchParams.toString();
  };

  const applyFilters = () => {
    startTransition(() => {
      const queryString = createQueryString({
        search: searchValue || '',
        minPrice: priceRange[0] || null,
        maxPrice: priceRange[1] || null,
      });
      router.push(`${pathname}?${queryString}`);
    });
  };

  const applyCategory = (newCategory: string) => {
    setCategory(newCategory);
    startTransition(() => {
      const queryString = createQueryString({
        // check if user cleared the category
        category: newCategory === '' ? null : newCategory || '',
      });
      router.push(`${pathname}?${queryString}`);
    });
  };

  return (
    <>
      <Button
        className='w-full md:hidden inline-flex'
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        {mobileMenu ? (
          <>
            <ChevronUp /> {t('close')}
          </>
        ) : (
          <>
            <ChevronDown /> {t('open')}
          </>
        )}
      </Button>
      <div
        className={`flex-col gap-4 ${mobileMenu ? 'flex mt-6' : 'md:flex hidden '} `}
      >
        <div>
          <h2 className='font-medium mb-4'>{t('searchByKeyword')}</h2>
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='text'
              placeholder='...'
              className='pl-8 pr-8'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyFilters();
                }
              }}
            />
            {searchValue && (
              <Button
                className='absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:bg-transparent'
                onClick={() => {
                  setSearchValue('');
                  if (search) {
                    startTransition(() => {
                      const queryString = createQueryString({
                        search: null,
                      });
                      router.push(`${pathname}?${queryString}`);
                    });
                  }
                }}
                variant={'ghost'}
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
        <Separator />
        <div className='space-y-2'>
          <div>
            <h3 className='font-medium mb-4'>{t('sum')}</h3>
            <Slider
              defaultValue={priceRange}
              min={0}
              max={10000}
              step={10}
              value={priceRange}
              onValueChange={(value) =>
                setPriceRange(value as [number, number])
              }
              className='mb-6'
            />
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <span className='text-sm text-muted-foreground mr-2'>€</span>
                <label htmlFor='min' />

                <Input
                  id='min'
                  type='number'
                  min={0}
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setPriceRange([value, priceRange[1]]);
                  }}
                  className='w-20 h-8'
                />
              </div>
              <div className='flex items-center'>
                <span className='text-sm text-muted-foreground mr-2'>€</span>
                <label htmlFor='max' />
                <Input
                  id='max'
                  type='number'
                  min={priceRange[0]}
                  max={10000}
                  value={priceRange[1]}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setPriceRange([priceRange[0], value]);
                  }}
                  className='w-20 h-8'
                />
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div>
          <h3 className='font-medium mb-4'>{t('searchByCategory')}</h3>
          <div className='flex flex-col gap-2'>
            <RadioGroup defaultValue={category} value={category}>
              {categories.map((category) => (
                <div
                  className='flex items-center space-x-2 cursor-pointer'
                  key={category.id}
                  onClick={() => {
                    applyCategory(category.id);
                  }}
                >
                  <RadioGroupItem
                    value={category.id}
                    id={category.id}
                    aria-label={`Category-${category.label}`}
                  />
                  <Label htmlFor={category.id} className='cursor-pointer'>
                    {t(category.id) || t('clear')}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <Button onClick={applyFilters} disabled={isPending}>
          {t('filter')}
        </Button>
      </div>
    </>
  );
};
