import {
  getUserAddress,
  getUserData,
  getUserEmailStatus,
} from '../../../../../data/user-data';
import { getOrderHsitory } from '../../../../../data/orders';
import { ProfileBanner } from '@/components/custom/profile/profile-banner';
import { ProfilePage } from '@/components/custom/profile/profile-layout';
import initTranslations from '@/app/i18n';
import { auth } from '../../../../../auth';
import { hasBeenApproved } from '../../../../../data/store';

interface ProfileProps {
  params: Promise<{ locale: string }>;
}

export default async function Profile({ params }: ProfileProps) {
  const userData = await getUserData();
  let approved = null;

  const session = await auth();

  const userAddress = await getUserAddress();

  const orderHistory = await getOrderHsitory();

  const emailStatus = await getUserEmailStatus();

  if (!userData || !userAddress || !emailStatus) return null;

  const { locale } = await params;

  const { t } = await initTranslations(locale, ['productPage']);

  if (session?.user.hasStore) {
    approved = await hasBeenApproved();
  }

  return (
    <div className=''>
      <ProfileBanner
        name={userData.name}
        lastName={userData.lastName}
        email={userData.email}
        phone={userData.phone || ''}
        createdAt={userData.createdAt}
        country={t(userAddress.country) || ''}
        t={t}
      />
      <div className=' max-w-7xl mx-auto py-10 container !px-0'>
        <ProfilePage
          userData={userData}
          userAddress={userAddress}
          orderHistory={orderHistory}
          emailStatus={emailStatus}
          session={session}
          approved={approved}
        />
      </div>
    </div>
  );
}
