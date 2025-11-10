import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';

import { getAuthenticatedUser } from '@/modules/auth/auth.service';
import { USER_SETTINGS_CACHE_KEY } from '@/modules/user-settings/user-settings.const';
import * as userSettingsRepository from '@/modules/user-settings/user-settings.repository';
import { isProfileComplete } from '@/modules/user-settings/utils/is-profile-complete';

const getCachedUserSettings = unstable_cache(
  async (userId: string) => {
    return await userSettingsRepository.getByUserId(userId);
  },
  [USER_SETTINGS_CACHE_KEY],
  {
    revalidate: 86400 * 7, // one week - because profile rarely changes
    tags: [USER_SETTINGS_CACHE_KEY],
  },
);

export const OnboardingRedirect = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const authResult = await getAuthenticatedUser();

  // If user is authenticated, check profile completion
  if (authResult.success && authResult.user) {
    try {
      const userSettings = await getCachedUserSettings(authResult.user.id);

      if (!userSettings || !isProfileComplete(userSettings)) {
        redirect('/onboarding');
      }
    } catch {
      redirect('/onboarding');
    }
  }

  return <>{children}</>;
};
