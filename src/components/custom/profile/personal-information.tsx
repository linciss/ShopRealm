'use server';

import prisma from '@/lib/db';
import { auth } from '../../../../auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalForms } from './personal-forms';

export const PersonalInformation = async () => {
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

  if (!userData) return null;

  console.log(userData);

  return (
    <div className='mt-2 w-full border-primary'>
      <Card className='p-1 bg-background shadow-lg'>
        <CardHeader>
          <CardTitle className='text-xl'>Persobnala informacij</CardTitle>
        </CardHeader>
        <CardContent>
          <PersonalForms
            userData={{
              name: userData.name,
              lastName: userData.lastName,
              email: userData.email,
              phone: userData.phone,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};
