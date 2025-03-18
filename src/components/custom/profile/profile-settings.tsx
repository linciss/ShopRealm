import { PersonalInformation } from './personal-information';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalForms } from './personal-forms';
import { AddressForms } from './address-forms';
import { getUserAddress, getUserData } from '../../../../data/user-data';

export const ProfileSettings = async () => {
  const userData = await getUserData();

  const userAddress = await getUserAddress();

  if (!userData || !userAddress) return null;

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
