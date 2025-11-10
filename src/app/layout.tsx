import type { Metadata } from 'next';
import { Onest, Roboto_Condensed } from 'next/font/google';

import { FeedbackWidget } from '@/components/feedback-widget';
import { OnboardingRedirect } from '@/components/onboarding-redirect';
import { Provider } from '@/components/provider';
import { Toaster } from '@/components/toaster';

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-onest',
});

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-roboto-condensed',
});

export const metadata: Metadata = {
  title: 'Wordi',
  description: 'Learn German with Wordi',
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${onest.variable} ${onest.className} ${robotoCondensed.variable}`}
    >
      <body suppressHydrationWarning>
        <Provider>
          <OnboardingRedirect>{children}</OnboardingRedirect>
          <Toaster />
        </Provider>
        <FeedbackWidget />
      </body>
    </html>
  );
};

export default RootLayout;
