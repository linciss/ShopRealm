import { MailWarning } from 'lucide-react';
import { VerifyEmailButton } from './profile/settings/verify-email-button';

export const VerifyEmailBanner = () => {
  return (
    <div className='bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 '>
      <div className='flex items-center mx-auto justify-center'>
        <div className='flex-shrink-0'>
          <MailWarning className='h-5 w-5 text-amber-400' />
        </div>
        <div className='ml-3'>
          <p className='text-sm text-amber-700'>
            Ludzu verifice epastu prims velies veikt pasutijumus{' '}
            <VerifyEmailButton />
          </p>
        </div>
      </div>
    </div>
  );
};
