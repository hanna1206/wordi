import { OnboardingPage } from '@/modules/user-settings/pages/onboarding.page';

// Force dynamic rendering since this page uses cookies for authentication
export const dynamic = 'force-dynamic';

export default function Onboarding() {
  return <OnboardingPage />;
}
