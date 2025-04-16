import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DeleteAccountDialog } from '../../delete-account-dialog';

export const AccountDelete = () => {
  return (
    <Card>
      <CardHeader>
        <h2 className='text-2xl font-semibold'>Bistama zona</h2>
      </CardHeader>

      <CardContent>
        <p className='font-semibold text-md'>
          Kad esat izdzxesis savu kontu, atpakaļceļa vairs nav. Ludzu, esiet
          partliecinats.
        </p>
        <DeleteAccountDialog />
      </CardContent>
    </Card>
  );
};
