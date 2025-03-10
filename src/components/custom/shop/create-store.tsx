import prisma from '@/lib/db';
import { auth } from '../../../../auth';
import { StoreForms } from './store-forms';

export const CreateStore = async () => {
  const session = await auth();

  if (!session?.user) return null;

  const userData = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: {
      phone: true,
    },
  });
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
