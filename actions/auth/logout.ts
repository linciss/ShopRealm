'use server';

import { signOut } from '../../auth';

// calls sign out call back from auth that deletes the session
export const logout = async () => {
  await signOut({
    redirectTo: '/',
  });
};
