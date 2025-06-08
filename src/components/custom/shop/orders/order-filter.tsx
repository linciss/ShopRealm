'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useTranslation } from 'react-i18next';

const statusMap = [
  {
    id: '',
  },
  {
    id: 'pending',
  },
  { id: 'shipped' },
  { id: 'complete' },
  { id: 'returned' },
];

const dateRangeMap = [
  { id: 'default' },
  { id: 'today' },
  { id: 'last-7-days' },
  { id: 'last-30-days' },
  { id: 'thisYear' },
];

const sortMap = [
  {
    id: 'default',
  },
  {
    id: 'newest',
  },
  {
    id: 'oldest',
  },
  {
    id: 'highest-value',
  },
  {
    id: 'lowest-value',
  },
];

interface OrderFilterProps {
  selectedStatus: string;
  dateRange: string;
  sort: string;
}

export const OrderFilter = ({
  selectedStatus,
  dateRange,
  sort,
}: OrderFilterProps) => {
  const { t } = useTranslation();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [dateRangeValue, setDateRangeValue] = useState(dateRange);

  const createQueryString = (
    params: Record<string, string | number | null>,
  ) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    });

    return newSearchParams.toString();
  };

  const [status, setStatus] = useState(selectedStatus);
  const [sortValue, setSortValue] = useState(sort);

  const applyStatus = (newStatus: string) => {
    setStatus(newStatus);
    startTransition(() => {
      const queryString = createQueryString({
        status: newStatus === '' ? null : newStatus || '',
      });
      router.push(`${pathname}?${queryString}`);
    });
  };

  const applyDateRange = (newValue: string) => {
    setDateRangeValue(newValue);
    startTransition(() => {
      const queryString = createQueryString({
        dateRange: newValue !== 'default' ? newValue : null,
      });

      router.push(`${pathname}?${queryString}`);
    });
  };

  const applySort = (newValue: string) => {
    setSortValue(newValue);
    startTransition(() => {
      const queryString = createQueryString({
        sort: newValue !== 'default' ? newValue : null,
      });

      router.push(`${pathname}?${queryString}`);
    });
  };
  const clearFilters = () => {
    startTransition(() => {
      const queryString = createQueryString({
        sort: null,
        dateRange: null,
        status: null,
      });
      router.push(`${pathname}?${queryString}`);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('orderFilter')}</CardTitle>
        <CardDescription>{t('orderFilterDesc')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div>
          <p className='font-medium mb-2'>{t('searchByStatus')}</p>
          <div className='flex flex-col gap-2'>
            <RadioGroup defaultValue={status} value={status}>
              {statusMap.map((status) => (
                <div
                  className='flex items-center space-x-2 cursor-pointer'
                  key={status.id}
                  onClick={() => {
                    applyStatus(status.id);
                  }}
                >
                  <RadioGroupItem
                    value={status.id}
                    id={status.id}
                    aria-label={`Status-${status.id}`}
                  />
                  <Label htmlFor={status.id} className='cursor-pointer'>
                    {t(status.id) || t('clear')}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <Separator />
        <div>
          <p className='font-medium mb-2'>{t('dateRange')}</p>
          <Select
            value={dateRangeValue}
            onValueChange={applyDateRange}
            disabled={isPending}
            defaultValue='default'
          >
            <SelectTrigger className='w-[180px]' aria-label='Sorting'>
              <SelectValue
                placeholder={t('dateRange')}
                aria-label='Sorting value'
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('dateRange')}</SelectLabel>
                {dateRangeMap.map((dateRange) => (
                  <SelectItem key={dateRange.id} value={dateRange.id}>
                    {t(dateRange.id)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Separator />
        <div>
          <p className='font-medium mb-2'>{t('sortBy')}</p>
          <Select
            value={sortValue}
            onValueChange={applySort}
            disabled={isPending}
            defaultValue='default'
          >
            <SelectTrigger className='w-[180px]' aria-label='Sorting'>
              <SelectValue
                placeholder={t('sortBy')}
                aria-label='Sorting value'
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('sortBy')}</SelectLabel>
                {sortMap.map((sort) => (
                  <SelectItem key={sort.id} value={sort.id}>
                    {t(sort.id)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => clearFilters()}
          className='w-full !mt-4'
          variant={'outline'}
          disabled={isPending}
        >
          {t('clearFilters')}
        </Button>
      </CardContent>
    </Card>
  );
};
