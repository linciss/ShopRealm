import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronDown } from 'lucide-react';

interface FIlterProps {
  value: string;
  id: string;
  label: string;
}

export const SideFilters = () => {
  return (
    <aside className='flex flex-col gap-8'>
      <section className='flex flex-col gap-2'>
        <h2 className='text-lg font-semibold'>Kategorijas</h2>
        <RadioGroup defaultValue={categoryFilter[0].value}>
          {categoryFilter.map(({ id, value, label }) => (
            <div key={id} className='flex items-center space-x-2'>
              <RadioGroupItem
                value={value}
                id={id}
                aria-labelledby={`label-${id}`}
              />
              <Label id={`label-${id}`} htmlFor={id}>
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <span className='flex flex-row items-center gap-1'>
          <ChevronDown size={12} />
          <p className='text-primary text-sm hover:underline cursor-pointer'>
            Skatīt vēl
          </p>
        </span>
      </section>

      <section className='flex flex-col gap-2'>
        <h2 className='text-lg font-semibold'>Reitingi</h2>
        <RadioGroup defaultValue={categoryFilter[0].value}>
          {ratingFilter.map(({ id, value, label }) => (
            <div key={id} className='flex items-center space-x-2'>
              <RadioGroupItem
                value={value}
                id={id}
                aria-labelledby={`label-${id}`}
              />
              <Label id={`label-${id}`} htmlFor={id}>
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </section>
    </aside>
  );
};

const categoryFilter: FIlterProps[] = [
  {
    value: 'all',
    id: 'r1',
    label: 'Visas kategorijas',
  },
  {
    value: 'comfortable',
    id: 'r2',
    label: 'Comfortable',
  },
  {
    value: 'compact',
    id: 'r3',
    label: 'Compact',
  },
];

const ratingFilter: FIlterProps[] = [
  {
    value: 'all',
    id: 'r1',
    label: 'Visi reitingi   ',
  },
  {
    value: 'comfortable',
    id: 'r2',
    label: 'Comfortable',
  },
  {
    value: 'compact',
    id: 'r3',
    label: 'Compact',
  },
];
