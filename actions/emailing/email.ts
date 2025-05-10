'use server';

import { resend } from '@/lib/resend';
import { render } from '@react-email/render';
import { EmailVerification } from '@/components/emails/email-verification';
import { ProductSale } from '@/components/emails/email-product-sale';
import { ResetPassword } from '@/components/emails/reset-password';
import { cookies } from 'next/headers';
import initTranslations from '@/app/i18n';

export const sendVerifyEmail = async (token: string, email: string) => {
  const pathname = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const confirmLink = `${pathname}/auth/verify-email?token=${token}`;
  const locale = (await cookies()).get('NEXT_LOCALE')?.value || 'en';
  const html = render(await EmailVerification({ confirmLink, locale }));
  const { t } = await initTranslations(locale, ['email']);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.DOMAIN_EMAIL || 'Hello <onboarding@resend.dev>',
      to: [process.env.EMAIL || '', email],
      subject: t('email:verifyEmail'),
      html: await html,
    });
    if (error) {
      return { error: 'error' };
    }

    if (data) {
      return { success: 'email:sent' };
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return { error: 'validationError' };
  }
};

export const sendSaleEmail = async (productId: string, emails: string[]) => {
  const pathname = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const confirmLink = `${pathname}/products/${productId}`;
  const locale = (await cookies()).get('NEXT_LOCALE')?.value || 'en';
  const html = render(await ProductSale({ confirmLink, locale }));
  const { t } = await initTranslations(locale, ['email']);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.DOMAIN_EMAIL || 'Hello <onboarding@resend.dev>',
      bcc: [process.env.EMAIL || '', ...emails],
      to: [process.env.EMAIL || ''],
      subject: t('email:productOnSale'),
      html: await html,
    });
    if (error) {
      return { error: 'error' };
    }

    if (data) {
      return { success: 'email:sent' };
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return { error: 'validatioError' };
  }
};

export const sendResetPassword = async (token: string, email: string) => {
  const pathname = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const confirmLink = `${pathname}/auth/reset-password?token=${token}`;
  const locale = (await cookies()).get('NEXT_LOCALE')?.value || 'en';
  const html = render(await ResetPassword({ confirmLink, locale }));
  const { t } = await initTranslations(locale, ['email']);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.DOMAIN_EMAIL || 'Hello <onboarding@resend.dev>',
      to: [process.env.EMAIL || '', email],
      subject: t('email:resetPassword'),
      html: await html,
    });
    if (error) {
      return { error: 'error' };
    }

    if (data) {
      return { success: 'email:sent' };
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return { error: 'validationError' };
  }
};
