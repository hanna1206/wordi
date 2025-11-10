import { OnboardingRedirect } from '@/modules/user-settings/components/onboarding-redirect';

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  return <OnboardingRedirect>{children}</OnboardingRedirect>;
};

export default AppLayout;
