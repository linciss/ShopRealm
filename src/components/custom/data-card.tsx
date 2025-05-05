import { Mail, Phone, Store, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataCardProps {
  dataType: string;
  name: string;
  email: string;
  phone: string;
  lastName?: string;
  t: (value: string) => string;
}

export const DataCard = ({
  dataType,
  name,
  lastName,
  email,
  phone,
  t,
}: DataCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center'>
          {dataType === t('dataTypeStore') ? (
            <Store className='h-[17px] w-[17px]' />
          ) : (
            <User className='h-[17px] w-[17px]' />
          )}
          {dataType} {t('data')}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <p className='text-sm font-semibold'>
          {name} {lastName}
        </p>
        <a
          className='text-sm text-muted-foreground flex gap-2 items-center'
          href={`mailto:${email}`}
          aria-label='Customer email'
        >
          <Mail width={16} />
          <p className='hover:underline'>{email}</p>
        </a>
        <a
          className='text-sm text-muted-foreground flex gap-2 items-center'
          href={`tel:${phone}`}
          aria-label='Customer phone'
        >
          <Phone width={16} />
          <p className='hover:underline'>{phone}</p>
        </a>
      </CardContent>
    </Card>
  );
};
