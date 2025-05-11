'use client';

import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface TableSearchProps {
  fields: string[];
}

export function TableSearch({ fields }: TableSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const initialSearch = searchParams.get('search') || '';
  const [value, setValue] = useState(initialSearch);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  //   handle serach
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (newValue) {
        params.set('search', newValue);
      } else {
        params.delete('search');
      }

      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    }, 500);
  };

  //   unmount timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className='relative'>
      <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
      <Input
        placeholder={t('searchBy') + ' ' + fields.map((f) => t(f)).join(', ')}
        value={value}
        onChange={handleSearchChange}
        className='pl-8'
      />
    </div>
  );
}
