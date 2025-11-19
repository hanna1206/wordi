import { redirect } from 'next/navigation';

import { getAuthenticatedUser } from '@/modules/auth/auth.service';
import { getCachedUserSettings } from '@/modules/user-settings/user-settings.actions';
import { isProfileComplete } from '@/modules/user-settings/utils/is-profile-complete';

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
