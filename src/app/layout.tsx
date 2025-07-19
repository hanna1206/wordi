import type { Metadata } from 'next';
import { Onest } from 'next/font/google';

import { Provider } from '@/components/provider';

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-onest',
});

export const metadata: Metadata = {
  title: 'Wordi',
  description: 'Learn German with Wordi',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning className={onest.variable}>
      <body suppressHydrationWarning>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
};

export default RootLayout;
