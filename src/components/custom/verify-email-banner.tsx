import { AlertTriangle } from 'lucide-react';
import { VerifyEmailButton } from './profile/settings/verify-email-button';

interface VerifyEmailBannerProps {
  t: (value: string) => string;
}

export const VerifyEmailBanner = ({ t }: VerifyEmailBannerProps) => {
  return (
    <div
      className={
        'relative px-4 py-3 rounded-lg mb-6 animate-in fade-in duration-300 border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200'
      }
    >
      <div className='flex items-start gap-3'>
        <div className='flex-shrink-0 pt-0.5'>
          <AlertTriangle className='h-5 w-5 text-amber-500' />
        </div>
        <div className='flex-1 space-y-1.5'>
          <h3 className='font-medium leading-tight'>{t('pleaseVerify')}</h3>
          <p className='text-sm text-amber-700 dark:text-amber-300'>
            {t('pleaseVerifyDesc')}
          </p>
          <div className='pt-1'>
            <VerifyEmailButton />
          </div>
        </div>
      </div>
    </div>
  );
};
