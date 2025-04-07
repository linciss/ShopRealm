import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Mail, Phone, User } from 'lucide-react';

interface CustomerInfoProps {
  user: {
    name: string;
    email: string;
    phone: string | null;
  };
}

export const CustomerInfo = ({ user }: CustomerInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <h3 className='text-xl font-semibold flex gap-4 items-center'>
          <User />
          Pasutitaja dati
        </h3>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <p className='text-md font-semibold'>{user.name}</p>
        <a
          className='text-sm text-muted-foreground flex gap-2 items-center'
          href={`mailto:${user.email}`}
          aria-label='Customer email'
        >
          <Mail width={16} />
          <p className='hover:underline'>{user.email}</p>
        </a>
        <a
          className='text-sm text-muted-foreground flex gap-2 items-center'
          href={`tel:${user.phone}`}
          aria-label='Customer phone'
        >
          <Phone width={16} />
          <p className='hover:underline'>{user.phone}</p>
        </a>
      </CardContent>
    </Card>
  );
};
