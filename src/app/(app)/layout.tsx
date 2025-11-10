import { OnboardingRedirect } from '@/components/onboarding-redirect';

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  return <OnboardingRedirect>{children}</OnboardingRedirect>;
};

export default AppLayout;
