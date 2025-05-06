import { Session } from 'next-auth';
import { AccountDelete } from './settings/account-delete';
import { ChangePassword } from './settings/change-password';
import { EmailVerification } from './settings/email-verification';
import RoleSwitcher from './settings/role-change';

interface SettingsProps {
  emailStatus: {
    email: string;
    emailVerified: boolean;
  };
  session: Session | null;
}

export const Settings = ({ emailStatus, session }: SettingsProps) => {
  return (
    <div className='space-y-6'>
      <EmailVerification emailStatus={emailStatus} />
      <RoleSwitcher session={session} />
      <ChangePassword />
      <AccountDelete />
    </div>
  );
};
