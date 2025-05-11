import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisIcon, Eye, Pencil } from 'lucide-react';
import { DeleteButton } from './delete-button';
import { Separator } from '@/components/ui/separator';
import { Pagination } from './pagination';
import { AdminLevel, Role } from '@prisma/client';
import { TableSearch } from '../table-search';
import { auth } from '../../../../auth';

interface OrderTableProps {
  users?:
    | {
        id: string;
        name: string;
        email: string;
        role: Role;
        verified: boolean;
        createdAt: Date;
        hasStore: boolean;
        storeId: string | null;
      }[]
    | undefined;
  t: (value: string) => string;
  pageCount: number;
  admins?: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    hasStore: boolean;
    adminLevel: AdminLevel | null;
    storeId: string | null;
    adminPrivileges: boolean | null;
  }[];
}

export const UsersTable = async ({
  users,
  t,
  pageCount,
  admins,
}: OrderTableProps) => {
  const session = await auth();
  const userHead = (
    <>
      <TableHead>{t('name')}</TableHead>
      <TableHead>{t('email')}</TableHead>
      <TableHead>{t('hasStore')}</TableHead>
      <TableHead className='hidden md:table-cell'>
        {t('emailVerified')}
      </TableHead>
      <TableHead className='hidden md:table-cell'>{t('joined')}</TableHead>
      <TableHead className=''>{''}</TableHead>
    </>
  );

  const adminHead = (
    <>
      <TableHead>{t('name')}</TableHead>
      <TableHead>{t('email')}</TableHead>
      <TableHead>{t('hasStore')}</TableHead>
      <TableHead>{t('adminLevel')}</TableHead>
      <TableHead className='hidden md:table-cell'>{t('joined')}</TableHead>
      {session?.user?.adminLevel === 'SUPER_ADMIN' && (
        <TableHead className=''>{''}</TableHead>
      )}
    </>
  );

  return (
    <Card>
      <CardHeader className='sm:p-6 px-2 !pb-0'>
        <CardTitle className=''>{t(users ? 'users' : 'admins')}</CardTitle>
      </CardHeader>
      <CardContent className='sm:p-6 px-2'>
        {users && (
          <div>
            <TableSearch fields={['name', 'email']} />
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              {users && userHead}
              {admins && adminHead}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.hasStore ? '✅' : '❌'}</TableCell>
                <TableCell className='hidden md:table-cell'>
                  {user.verified ? '✅' : '❌'}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link
                          href={`/admin/users/configurator/${user?.id}`}
                          prefetch={false}
                          className='flex items-center gap-1 '
                        >
                          <Pencil height={16} width={16} />
                          {t('editUser')}
                        </Link>
                      </DropdownMenuItem>
                      {user.hasStore && (
                        <>
                          <DropdownMenuItem>
                            <Link
                              href={`/store/${user?.storeId}`}
                              prefetch={false}
                              className='flex items-center gap-1'
                            >
                              <Eye height={16} width={16} />
                              {t('showStorePage')}
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}

                      <Separator className='my-2' />
                      <DeleteButton id={user.id} type='user' />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {admins?.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.hasStore ? '✅' : '❌'}</TableCell>
                <TableCell>
                  {admin.adminLevel === 'ADMIN' ? t('admin') : t('superAdmin')}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {new Date(admin.createdAt).toLocaleDateString()}
                </TableCell>
                {session?.user?.adminLevel === 'SUPER_ADMIN' && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link
                            href={`/admin/users/configurator/${admin?.id}`}
                            prefetch={false}
                            className='flex items-center gap-1 '
                          >
                            <Pencil height={16} width={16} />
                            {t('editUser')}
                          </Link>
                        </DropdownMenuItem>
                        {admin.hasStore && (
                          <>
                            <DropdownMenuItem>
                              <Link
                                href={`/store/${admin?.storeId}`}
                                prefetch={false}
                                className='flex items-center gap-1'
                              >
                                <Eye height={16} width={16} />
                                {t('showStorePage')}
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}

                        <Separator className='my-2' />
                        <DeleteButton id={admin.id} type='user' />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className='flex flex-row items-center gap-1 justify-end'>
        <Pagination pageCount={pageCount} />
      </CardFooter>
    </Card>
  );
};
