'use client';
import { useTranslation } from 'react-i18next';
import { DeleteAccountDialog } from '../../delete-account-dialog';
import { CardWrapper } from './card-wrapper';

export const AccountDelete = () => {
  const { t } = useTranslation();
  return (
    <CardWrapper
      cardHeader={<h2 className='text-2xl font-semibold'>{t('dangerZone')}</h2>}
      cardContent={
        <>
          <p className='font-semibold text-md'>{t('deleteAccountDesc')}</p>
          <DeleteAccountDialog />
        </>
      }
    />
  );
};
