import prisma from '@/lib/db';
import { auth } from '../../../../auth';
import { PersonalInformation } from './personal-information';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalForms } from './personal-forms';
import { AddressForms } from './address-forms';

export const ProfileSettings = async () => {
  const session = await auth();

  if (!session?.user) return null;

  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      name: true,
      lastName: true,
      UUID: true,
      phone: true,
    },
  });

  const userAddress = await prisma.address.findFirst({
    where: {
      userId: session.user.id,
    },
    select: {
      street: true,
      city: true,
      country: true,
      postalCode: true,
    },
  });

  if (!userData || !userAddress || !session.user.id) return null;

  return (
    <div>
      <div>
        <h2 className='text-lg text-foreground'>
          Menedžē savus datus, pasūtījumus, u.c
        </h2>
      </div>
      <div className='mt-10'>
        <Tabs defaultValue='profile' className='bg-background text-foreground'>
          <TabsList className='bg-transparent text-foreground space-x-2 '>
            <TabsTrigger
              className='data-[state=active]:font-semibold !data-[state=active]:bg-transparent data-[state=active]:shadow-none'
              value='profile'
            >
              Profils
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:font-semibold !data-[state=active]:bg-transparent data-[state=active]:shadow-none'
              value='orders'
            >
              Pasūtījumi
            </TabsTrigger>
            <TabsTrigger
              className='data-[state=active]:font-semibold !data-[state=active]:bg-transparent data-[state=active]:shadow-none'
              value='settings'
            >
              Iestatījumi
            </TabsTrigger>
          </TabsList>
          <TabsContent value='profile' className='w-full space-y-20'>
            <PersonalInformation cardTitle='Personala informacija'>
              <PersonalForms userData={userData} />
            </PersonalInformation>
            <PersonalInformation cardTitle='Adreses informacija'>
              <AddressForms userAddress={userAddress} />
            </PersonalInformation>
          </TabsContent>
          <TabsContent value='orders'>orders</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
