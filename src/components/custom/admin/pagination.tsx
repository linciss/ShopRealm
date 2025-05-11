'use client';

import { Button } from '@/components/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  pageCount: number;
}

export const Pagination = ({ pageCount }: PaginationProps) => {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const [page, setPage] = useState(Number(sp.get('page')) || 1);
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    startTransition(() => {
      router.push(`${pathname}?page=${newPage}`);
    });
  };

  return (
    <>
      <Button
        variant={'outline'}
        onClick={() => {
          handlePageChange(page - 1);
        }}
        disabled={isPending || page <= 1}
      >
        {t('prevPage')}
      </Button>
      <Button
        variant={'outline'}
        onClick={() => {
          handlePageChange(page + 1);
        }}
        disabled={isPending || page >= pageCount}
      >
        {t('nextPage')}
      </Button>
    </>
  );
};
