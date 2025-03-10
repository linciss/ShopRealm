'use client';

import Link from 'next/link';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { switchRole } from '../../../actions/switch-role';

interface RoleSwitcherProps {
  role: string | undefined;
}

export const RoleSwitcherButton = ({ role }: RoleSwitcherProps) => {
  return (
    <Link
      href={''}
      onClick={() => {
        switchRole();
      }}
    >
      <DropdownMenuItem>
        {role === 'STORE' ? 'Lietotaja rezims' : 'Veikala rezims'}
      </DropdownMenuItem>
    </Link>
  );
};
