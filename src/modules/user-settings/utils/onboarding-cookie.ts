import { cookies } from 'next/headers';

import { ONBOARDING_COOKIE_KEY } from '../user-settings.const';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const setOnboardingCompleteCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.set(ONBOARDING_COOKIE_KEY, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
  });
};

export const getOnboardingCompleteCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(ONBOARDING_COOKIE_KEY);
};
