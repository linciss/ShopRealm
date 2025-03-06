'use client';

import Link from 'next/link';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { switchRole } from '../../../actions/switch-role';

interface RoleSwitcherProps {
  id: string | undefined;
}

export const RoleSwitcherButton = ({ id }: RoleSwitcherProps) => {
  return (
    <Link
      href={''}
      onClick={() => {
        switchRole(id);
      }}
    >
      <DropdownMenuItem>Veikala rezims</DropdownMenuItem>
    </Link>
  );
};
