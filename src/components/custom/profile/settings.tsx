import { AccountDelete } from './settings/account-delete';
import { EmailVerification } from './settings/email-verification';

export const Settings = () => {
  return (
    <div className='space-y-6'>
      <EmailVerification />
      <AccountDelete />
    </div>
  );
};
