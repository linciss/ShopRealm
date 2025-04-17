'use client';
import { AccountDelete } from './settings/account-delete';
import { ChangePassword } from './settings/change-password';
import { EmailVerification } from './settings/email-verification';

interface SettingsProps {
  emailStatus: {
    email: string;
    emailVerified: boolean;
  };
}

export const Settings = ({ emailStatus }: SettingsProps) => {
  return (
    <div className='space-y-6'>
      <EmailVerification emailStatus={emailStatus} />
      <ChangePassword />
      <AccountDelete />
    </div>
  );
};
