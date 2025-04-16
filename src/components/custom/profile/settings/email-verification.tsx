import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Info, Mail } from 'lucide-react';
import { getUserEmailStatus } from '../../../../../data/user-data';
import { VerifyEmailButton } from './verify-email-button';

export const EmailVerification = async () => {
  const emailStatus = await getUserEmailStatus();

  if (emailStatus?.emailVerified) return null;

  return (
    <Card>
      <CardHeader>
        <h2 className='text-2xl font-semibold'>Epasta verifikacija</h2>
        <p className='text-sm text-muted-foreground'>
          Verifice epastu. lai nodrosinatui profila drosibu
        </p>
      </CardHeader>

      <CardContent>
        <div className='flex items-center justify-between'>
          <div className='flex gap-4 items-center'>
            <Mail />
            <div className='flex flex-col '>
              <h3 className='text-lg font-medium'>{emailStatus?.email}</h3>

              {!emailStatus?.emailVerified && (
                <p className='text-orange-500 flex gap-2 items-center text-sm'>
                  <Info width={15} /> Nav verificeta
                </p>
              )}
            </div>
          </div>
          <VerifyEmailButton />
        </div>
      </CardContent>
    </Card>
  );
};
