'use client';
import { Info, Mail } from 'lucide-react';
import { VerifyEmailButton } from './verify-email-button';
import { CardWrapper } from './card-wrapper';

interface EmailVerificationProps {
  emailStatus: {
    email: string;
    emailVerified: boolean;
  };
}
export const EmailVerification = ({ emailStatus }: EmailVerificationProps) => {
  if (emailStatus?.emailVerified) return null;

  return (
    <CardWrapper
      cardHeader={
        <>
          <h2 className='text-2xl font-semibold'>Epasta verifikacija</h2>
          <p className='text-sm text-muted-foreground'>
            Verifice epastu. lai nodrosinatui profila drosibu
          </p>
        </>
      }
      cardContent={
        <div className='flex items-center justify-between'>
          <div className='flex gap-4 items-center'>
            <Mail />
            <div className='flex flex-col '>
              <h3 className='text-md font-medium'>{emailStatus?.email}</h3>

              {!emailStatus?.emailVerified && (
                <p className='text-orange-500 flex gap-2 items-center text-sm'>
                  <Info width={15} /> Nav verificeta
                </p>
              )}
            </div>
          </div>
          <VerifyEmailButton />
        </div>
      }
    />
  );
};
