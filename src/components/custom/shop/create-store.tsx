import { getUserData } from '../../../../data/user-data';
import { StoreForms } from './store-forms';

export const CreateStore = async () => {
  const userData = await getUserData();
  return (
    <div className='flex flex-col mx-auto text-center gap-3 justify-center container max-w-3xl'>
      <h1 className='text-4xl font-semibold'>Izverido savu veikalu!</h1>
      <p className='text-base font-normal text-muted-foreground'>
        Izveido savu veikalu uz Shop Sphere platformas un sāc pārdot produktus.
      </p>
      <StoreForms phone={userData?.phone || ''} />
    </div>
  );
};
