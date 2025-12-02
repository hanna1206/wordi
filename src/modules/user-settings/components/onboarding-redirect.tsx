import { redirect } from 'next/navigation';

import { getAuthenticatedUser } from '@/modules/auth/auth.service';
import { getCachedUserSettings } from '@/modules/user-settings/user-settings.actions';
import { isProfileComplete } from '@/modules/user-settings/utils/is-profile-complete';

export const OnboardingRedirect = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Single auth check - cached within this request via React.cache()
  const authResult = await getAuthenticatedUser();

  // If user is authenticated, check profile completion
  if (authResult.success && authResult.user) {
    try {
      // This is already cached via unstable_cache, and getAuthenticatedUser is cached via React.cache
      // So no redundant calls happen here
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
