'use client';

import { CookieConsent } from '@/components/cookie-consent';
import { AuthSwitcher } from '@/modules/auth/components/auth-switcher';

export const LoginPage = () => {
  return (
    <>
      <AuthSwitcher />
      <CookieConsent />
    </>
  );
};
