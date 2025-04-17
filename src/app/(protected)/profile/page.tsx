import {
  getUserAddress,
  getUserData,
  getUserEmailStatus,
} from '../../../../data/user-data';
import { getOrderHsitory } from '../../../../data/orders';
import { ProfileBanner } from '@/components/custom/profile/profile-banner';
import { ProfilePage } from '@/components/custom/profile/profile-layout';

export default async function Profile() {
  const userData = await getUserData();

  const userAddress = await getUserAddress();

  const orderHistory = await getOrderHsitory();

  const emailStatus = await getUserEmailStatus();

  if (!userData || !userAddress || !emailStatus) return null;

  return (
    <div className=''>
      <ProfileBanner
        name={userData.name}
        lastName={userData.lastName}
        email={userData.email}
        phone={userData.phone || ''}
        createdAt={userData.createdAt}
        country={userAddress.country || ''}
      />
      <div className=' max-w-7xl mx-auto py-10'>
        <div className='mt-10'>
          <ProfilePage
            userData={userData}
            userAddress={userAddress}
            orderHistory={orderHistory}
            emailStatus={emailStatus}
          />
        </div>
      </div>
    </div>
  );
}
