import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';

import { getAuthenticatedUser } from '@/modules/auth/auth.service';
import { USER_SETTINGS_CACHE_KEY } from '@/modules/user-settings/user-settings.const';
import * as userSettingsRepository from '@/modules/user-settings/user-settings.repository';
import { isProfileComplete } from '@/modules/user-settings/utils/is-profile-complete';
import { getOnboardingCompleteCookie } from '@/modules/user-settings/utils/onboarding-cookie';

const getCachedUserSettings = unstable_cache(
  async (userId: string) => {
    return await userSettingsRepository.getByUserId(userId);
  },
  [USER_SETTINGS_CACHE_KEY],
  { revalidate: 3600, tags: [USER_SETTINGS_CACHE_KEY] },
);

export const OnboardingRedirect = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const authResult = await getAuthenticatedUser();

  // If user is authenticated, check profile completion
  if (authResult.success && authResult.user) {
    const onboardingComplete = await getOnboardingCompleteCookie();

    // Fast path: if cookie exists, skip DB check
    if (onboardingComplete?.value === 'true') {
      return <>{children}</>;
    }

    // Slow path: check DB with caching
    try {
      const userSettings = await getCachedUserSettings(authResult.user.id);

      if (!userSettings || !isProfileComplete(userSettings)) {
        redirect('/onboarding');
      }

      // Profile is complete but cookie is missing
      // Cookie will be set on next login or can be set via a Server Action
      // For now, just allow access (DB check passed)
    } catch {
      redirect('/onboarding');
    }
  }

  return <>{children}</>;
};
