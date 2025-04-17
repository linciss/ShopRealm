'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Box, User, UserCog } from 'lucide-react';
import { useState } from 'react';
import { PersonalForms } from './personal-forms';
import { AddressForms } from './address-forms';
import { OrderHistory } from './order-history';
import { Settings } from './settings';

interface OrderHistory {
  createdAt: Date;
  orderItems: {
    id: string;
    status: string;
    total: number;
    store: {
      name: string;
      storePhone: string;
      user: {
        email: string;
      };
    };
    product: {
      name: string;
      id: string;
      image: string | null;
    };
    priceAtOrder: number;
    quantity: number;
  }[];
}
interface ProfilePageLayoutProps {
  userData: {
    name: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  userAddress: {
    street: string | null;
    city: string | null;
    country: string | null;
    postalCode: string | null;
  };
  orderHistory: OrderHistory[] | undefined;
  emailStatus: {
    email: string;
    emailVerified: boolean;
  };
}

export const ProfilePage = ({
  userData,
  userAddress,
  orderHistory,
  emailStatus,
}: ProfilePageLayoutProps) => {
  const [activeTab, setActiveTab] = useState<string>('profile');

  return (
    <div className='flex md:flex-row flex-col gap-6 px-2 md:px-4  '>
      <div className='md:w-64 shrink-0'>
        <Card>
          <CardContent className='flex flex-col p-0'>
            <Button
              variant={activeTab === 'profile' ? 'default' : 'outline'}
              onClick={() => setActiveTab('profile')}
              className='rounded-none rounded-t-xl justify-start gap-3 h-auto py-3'
            >
              <User /> Profila dati
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'default' : 'outline'}
              onClick={() => setActiveTab('orders')}
              className='rounded-none justify-start gap-3  h-auto py-3'
            >
              <Box /> Pasutijumi
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'outline'}
              onClick={() => setActiveTab('settings')}
              className='rounded-none rounded-b-xl justify-start gap-3  h-auto py-3 '
            >
              <UserCog />
              Iestatijumi
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className='flex-1'>
        {activeTab === 'profile' && (
          <Tabs defaultValue='profile' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='profile'>Profila dati</TabsTrigger>
              <TabsTrigger value='address'>Adreses dati</TabsTrigger>
            </TabsList>
            <TabsContent value='profile'>
              <PersonalForms userData={userData} />
            </TabsContent>
            <TabsContent value='address'>
              <AddressForms userAddress={userAddress} />
            </TabsContent>
          </Tabs>
        )}
        {activeTab === 'orders' && <OrderHistory history={orderHistory} />}
        {activeTab === 'settings' && <Settings emailStatus={emailStatus} />}
      </div>
    </div>
  );
};
