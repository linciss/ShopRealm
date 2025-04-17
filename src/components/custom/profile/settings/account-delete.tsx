import { DeleteAccountDialog } from '../../delete-account-dialog';
import { CardWrapper } from './card-wrapper';

export const AccountDelete = () => {
  return (
    <CardWrapper
      cardHeader={<h2 className='text-2xl font-semibold'>Bistama zona</h2>}
      cardContent={
        <>
          <p className='font-semibold text-md'>
            Kad esat izdzxesis savu kontu, atpakaļceļa vairs nav. Ludzu, esiet
            partliecinats.
          </p>
          <DeleteAccountDialog />
        </>
      }
    />
  );
};
