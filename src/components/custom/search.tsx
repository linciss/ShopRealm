'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className='relative w-full'>
      <div className='relative flex items-center'>
        <Input
          type='text'
          placeholder={t('searchFor')}
          className='pr-12 h-12 rounded-full pl-5'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type='submit'
          size='icon'
          className='absolute right-1 h-10 w-10 rounded-full'
          disabled={!searchQuery.trim()}
        >
          <Search className='h-5 w-5' />
          <span className='sr-only'>{t('search')}</span>
        </Button>
      </div>
    </form>
  );
};
