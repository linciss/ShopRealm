import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserAddress, getUserData } from '../../../../data/user-data';
import { PersonalInformation } from '@/components/custom/profile/personal-information';
import { PersonalForms } from '@/components/custom/profile/personal-forms';
import { AddressForms } from '@/components/custom/profile/address-forms';
import { OrderHistory } from '@/components/custom/profile/order-history';
import { getOrderHsitory } from '../../../../data/orders';

export default async function Profile() {
  const userData = await getUserData();

  const userAddress = await getUserAddress();

  const orderHistory = await getOrderHsitory();

  if (!userData || !userAddress) return null;

  return (
    <div className='py-10'>
      <h1 className='text-2xl font-bold'>Mans profils</h1>
      <div>
        <div>
          <h2 className='text-lg text-foreground'>
            Menedžē savus datus, pasūtījumus, u.c
          </h2>
        </div>
        <div className='mt-10'>
          <Tabs
            defaultValue='profile'
            className='bg-background text-foreground'
          >
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
            <TabsContent value='orders'>
              <OrderHistory orderItems={orderHistory} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
