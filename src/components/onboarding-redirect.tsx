import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getAuthenticatedUser } from '@/modules/auth/auth.service';
import * as userSettingsRepository from '@/modules/user-settings/user-settings.repository';
import { isProfileComplete } from '@/modules/user-settings/utils/is-profile-complete';

const PATHS_VISIBLE_WITHOUT_FINISHED_ONBOARDING = [
  '/login',
  '/auth',
  '/onboarding',
  '/privacy-policy',
  '/terms-of-service',
];

const isPublicPath = (pathname: string) => {
  return PATHS_VISIBLE_WITHOUT_FINISHED_ONBOARDING.some((path) =>
    pathname.startsWith(path),
  );
};

export const OnboardingRedirect = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';

  // Skip check for public paths
  if (isPublicPath(pathname)) {
    return <>{children}</>;
  }

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
      // eslint-disable-next-line no-console
      console.log('User has no profile, redirecting to onboarding');
      // On error, redirect to onboarding to be safe
      redirect('/onboarding');
    }
  }

  return <>{children}</>;
};
