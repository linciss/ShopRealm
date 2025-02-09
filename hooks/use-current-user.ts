import { useSession } from 'next-auth/react';

// define a hook to get the current user from the session
export const useCurrentUser = () => {
  const session = useSession();
  return session?.data?.user;
};
