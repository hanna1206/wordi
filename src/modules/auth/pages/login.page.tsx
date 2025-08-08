'use client';

import { CookieConsent } from '@/components/cookie-consent';
import { GradientBackground } from '@/components/gradient-background';
import { AuthSwitcher } from '@/modules/auth/components/auth-switcher';

export const LoginPage = () => {
  return (
    <GradientBackground variant="primary">
      <AuthSwitcher />
      <CookieConsent />
    </GradientBackground>
  );
};
