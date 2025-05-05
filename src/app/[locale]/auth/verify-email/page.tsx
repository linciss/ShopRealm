import initTranslations from '@/app/i18n';
import { verifyUserEmail } from '../../../../../actions/user/verify-email';

interface VerifyEmailPageProps {
  searchParams: Promise<{ token: string }>;
  params: Promise<{ locale: string }>;
}

export default async function VerifyEmailPage({
  searchParams,
  params,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;
  const { locale } = await params;

  const { t } = await initTranslations(locale, ['productPage']);

  const verifiedToken = await verifyUserEmail(token);

  if (verifiedToken.error) {
    return <div>{t(verifiedToken.error)}</div>;
  }

  return <div>{t(verifiedToken.success)}</div>;
}
