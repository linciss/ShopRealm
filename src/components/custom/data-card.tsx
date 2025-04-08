import { Mail, Phone, Store, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface DataCardProps {
  dataType: string;
  name: string;
  email: string;
  phone: string;
}

export const DataCard = ({ dataType, name, email, phone }: DataCardProps) => {
  return (
    <Card>
      <CardHeader>
        <h3 className='text-xl font-semibold flex gap-4 items-center'>
          {dataType === 'Veikala' ? <Store /> : <User />}
          {dataType} dati
        </h3>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <p className='text-md font-semibold'>{name}</p>
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
