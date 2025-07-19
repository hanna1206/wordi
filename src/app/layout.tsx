import type { Metadata } from 'next';
import { Onest } from 'next/font/google';

import { Provider } from '@/components/provider';

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
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
    <html lang="en" suppressHydrationWarning>
      <body className={onest.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
};

export default RootLayout;
