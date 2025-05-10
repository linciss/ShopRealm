import initTranslations from '@/app/i18n';
import { verifyResetToken } from '../../../../../actions/user/reset-password';
import { ResetPasswordForms } from '@/components/auth/reset-password';

interface ResetPasswordProps {
  searchParams: Promise<{ token: string }>;
  params: Promise<{ locale: string }>;
}

export default async function ResetPassword({
  searchParams,
  params,
}: ResetPasswordProps) {
  const { token } = await searchParams;
  const { locale } = await params;

  const { t } = await initTranslations(locale, ['productPage']);

  const verifiedToken = await verifyResetToken(token);

  if (verifiedToken.error) {
    return <div>{t(verifiedToken.error)}</div>;
  }

  return (
    <div>
      <ResetPasswordForms />
    </div>
  );
}
