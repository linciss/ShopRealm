'use server';

import { resend } from '@/lib/resend';
import { render } from '@react-email/render';
import { EmailVerification } from '@/components/emails/email-verification';
import { ProductSale } from '@/components/emails/email-product-sale';
import { ResetPassword } from '@/components/emails/reset-password';
import { cookies } from 'next/headers';

export const sendVerifyEmail = async (token: string, email: string) => {
  const pathname = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const confirmLink = `${pathname}/auth/verify-email?token=${token}`;
  const html = render(EmailVerification({ confirmLink }));

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.DOMAIN_EMAIL || 'Hello <onboarding@resend.dev>',
      to: [process.env.EMAIL || '', email],
      subject: 'Epasta verifikacija',
      html: await html,
    });
    if (error) {
      return { error: 'Kluda!' };
    }

    if (data) {
      return { success: 'Nosutits' };
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return { error: ' Kluda validejot datus!' };
  }
};

export const sendSaleEmail = async (productId: string, emails: string[]) => {
  const pathname = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const confirmLink = `${pathname}/products/${productId}`;
  const html = render(ProductSale({ confirmLink }));

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.DOMAIN_EMAIL || 'Hello <onboarding@resend.dev>',
      bcc: [process.env.EMAIL || '', ...emails],
      to: [process.env.EMAIL || ''],
      subject: 'Produkts uz izpardosanu!',
      html: await html,
    });
    if (error) {
      return { error: 'Kluda!' };
    }

    if (data) {
      return { success: 'Nosutits' };
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return { error: ' Kluda validejot datus!' };
  }
};

export const sendResetPassword = async (token: string, email: string) => {
  const pathname = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const confirmLink = `${pathname}/auth/reset-password?token=${token}`;
  const locale = (await cookies()).get('NEXT_LOCALE')?.value || 'en';

  const html = render(await ResetPassword({ confirmLink, locale }));

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.DOMAIN_EMAIL || 'Hello <onboarding@resend.dev>',
      to: [process.env.EMAIL || '', email],
      subject: 'Epasta verifikacija',
      html: await html,
    });
    if (error) {
      return { error: 'Kluda!' };
    }

    if (data) {
      return { success: 'Nosutits' };
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return { error: ' Kluda validejot datus!' };
  }
};
