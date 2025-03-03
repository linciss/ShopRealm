import { ProfileSettings } from '@/components/custom/profile/profile-settings';

export default function Profile() {
  // const [userData, setUserData] = useState<User | null>();

  return (
    <div className='py-10'>
      <h1 className='text-2xl font-bold'>Mans profils</h1>
      <ProfileSettings />
    </div>
  );
}
