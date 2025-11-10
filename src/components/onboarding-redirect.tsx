import { redirect } from 'next/navigation';

import { getAuthenticatedUser } from '@/modules/auth/auth.service';
import * as userSettingsRepository from '@/modules/user-settings/user-settings.repository';
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
      const userSettings = await userSettingsRepository.getByUserId(
        authResult.user.id,
      );

      if (!userSettings || !isProfileComplete(userSettings)) {
        redirect('/onboarding');
      }
    } catch {
      // On error, redirect to onboarding to be safe
      redirect('/onboarding');
    }
  }

  return <>{children}</>;
};
