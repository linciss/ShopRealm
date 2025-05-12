'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

export const NavSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };
  const { t } = useTranslation();

  const handleEnter = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='relative hidden items-center w-full flex-1 md:flex '
      role='search'
    >
      <Input
        type='search'
        placeholder={t('searchForProducts')}
        className='pr-10 rounded-lg border-neutral-200 focus:border-neutral-300 focus-visible:ring-1 focus-visible:ring-neutral-300'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleEnter();
          }
        }}
        aria-label='Search products'
      />
      <Button
        type='submit'
        size='icon'
        variant='ghost'
        className='absolute right-0 px-2 text-neutral-500 hover:text-neutral-700'
        aria-label='Submit search'
      >
        <Search className='h-4 w-4' />
      </Button>
    </form>
  );
};
