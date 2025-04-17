import { SignOutButton } from '@/components/auth/sign-out-button';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone } from 'lucide-react';

interface ProfileBannerProps {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;
  createdAt: Date;
}

export const ProfileBanner = ({
  name,
  lastName,
  email,
  phone,
  country,
  createdAt,
}: ProfileBannerProps) => {
  return (
    <div className='w-full bg-muted'>
      <div className='max-w-7xl container py-5 flex md:flex-row flex-col items-center md:justify-between justify-center'>
        <div className='flex flex-col gap-2'>
          <div className='space-y-2 md:text-start text-center'>
            <h1 className='text-xl font-semibold'>
              {name} {lastName}
            </h1>
            <p className='text-sm text-muted-foreground'>
              Pievienojas {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className='flex flex-row gap-4'>
            <span className='text-sm text-muted-foreground flex flex-row gap-2 items-center'>
              <Mail width={16} /> {email}
            </span>
            {phone && (
              <span className='text-sm text-muted-foreground flex flex-row gap-2 items-center'>
                <Phone width={16} /> {phone}
              </span>
            )}
            {country && (
              <span className='text-sm text-muted-foreground flex flex-row gap-2 items-center'>
                <MapPin width={16} /> {email}
              </span>
            )}
          </div>
        </div>
        <SignOutButton>
          <Button variant={'outline'}>Izlogoties</Button>
        </SignOutButton>
      </div>
    </div>
  );
};
