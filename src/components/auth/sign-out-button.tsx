'use client';

import { logout } from '../../../actions/auth/logout';

interface SignOutButtonProps {
  children?: React.ReactNode;
}

export const SignOutButton = ({ children }: SignOutButtonProps) => {
  return <span onClick={logout}>{children}</span>;
};
