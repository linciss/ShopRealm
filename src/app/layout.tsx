import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NavigationBar } from '@/components/custom/navigation-bar';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { auth } from '../../auth';
import { SessionProvider } from 'next-auth/react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Shop Sphere',
  description: 'Hello world!',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <div className='relative flex min-h-screen flex-col bg-background'>
            <SessionProvider session={session}>
              <NavigationBar />
              <div className='flex-1'>{children}</div>
            </SessionProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
