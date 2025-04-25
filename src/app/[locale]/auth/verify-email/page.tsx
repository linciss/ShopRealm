import { verifyUserEmail } from '../../../../../actions/user/verify-email';

interface VerifyEmailPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;

  const verifiedToken = await verifyUserEmail(token);

  if (verifiedToken.error) {
    return <div>{verifiedToken.error}</div>;
  }

  return <div>{verifiedToken.success}</div>;
}
