'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontal,
} from 'lucide-react';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
}

export const ProductPagination = ({
  currentPage,
  totalPages,
}: ProductPaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    if (currentPage === newPage) return;
    if (newPage === 0) return;
    if (newPage > totalPages) return;

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      router.push(`${pathname}?${params.toString()}`);

      // scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];

    pageNumbers.push(1);

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) {
      pageNumbers.push('ellipsis-start');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push('ellipsis-end');
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className='w-full mx-auto flex flex-row items-center justify-center mt-5 gap-1'>
      <Button
        variant={'outline'}
        disabled={currentPage === 1 || isPending}
        onClick={() => handlePageChange(currentPage - 1)}
        aria-label='back'
      >
        <ChevronLeftIcon />
      </Button>

      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
          return (
            <Button
              key={`ellipsis-${index}`}
              variant='ghost'
              size='icon'
              disabled
              className='cursor-default'
              aria-label='ellipsis'
            >
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          );
        }

        return (
          <Button
            key={index}
            variant={currentPage === page ? 'default' : 'outline'}
            size='icon'
            disabled={isPending}
            onClick={() => handlePageChange(page as number)}
            aria-label='page number'
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant={'outline'}
        disabled={currentPage === totalPages || isPending}
        onClick={() => handlePageChange(currentPage + 1)}
        aria-label='forward'
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
};
