'use client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

interface ProductSoterProps {
  sort: string;
}

const sortOptions = [
  {
    value: 'default',
    label: 'Nekartot',
  },
  {
    value: 'oldest',
    label: 'Vecakie',
  },
  {
    value: 'newest',
    label: 'Jaunakie',
  },
  {
    value: 'popular',
    label: 'Popularie',
  },
  {
    value: 'price-low',
    label: 'No zemakas cenas',
  },
  {
    value: 'price-high',
    label: 'No augstakas cenas',
  },
];

export const ProductSoter = ({ sort }: ProductSoterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sortValue, setSortValue] = useState<string>(sort);

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

  const [isPending, startTransition] = useTransition();

  const applySort = (newValue: string) => {
    setSortValue(newValue);
    startTransition(() => {
      const queryString = createQueryString({
        sort: newValue !== 'default' ? newValue : null,
      });

      router.push(`${pathname}?${queryString}`);
    });
  };

  return (
    <Select
      value={sortValue}
      onValueChange={applySort}
      disabled={isPending}
      defaultValue='default'
    >
      <SelectTrigger className='w-[180px]' aria-label='Sorting'>
        <SelectValue placeholder='Kartosana' aria-label='Sorting value' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Kartosana</SelectLabel>
          {sortOptions.map((sort) => (
            <SelectItem key={sort.value} value={sort.value}>
              {sort.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
