import { Session } from 'next-auth';
import { AccountDelete } from './settings/account-delete';
import { ChangePassword } from './settings/change-password';
import { EmailVerification } from './settings/email-verification';
import RoleSwitcher from './settings/role-change';
import { ChangeLocale } from './settings/change-locale';

interface SettingsProps {
  emailStatus: {
    email: string;
    emailVerified: boolean;
  };
  session: Session | null;
  approved?: boolean | null;
}

export const Settings = ({ emailStatus, session, approved }: SettingsProps) => {
  return (
    <div className='space-y-6'>
      <EmailVerification emailStatus={emailStatus} />
      <ChangeLocale />
      <ChangePassword />
      <RoleSwitcher session={session} approved={approved} />
      <AccountDelete />
    </div>
  );
};
