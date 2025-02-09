'use client';
import { useCurrentUser } from '../../../../hooks/use-current-user';

export default function Profile() {
  const user = useCurrentUser();
  return (
    <div>
      <h1>Profile</h1>
      <div>{JSON.stringify(user)}</div>
    </div>
  );
}
