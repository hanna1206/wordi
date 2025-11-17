import { DueWordsCountProvider } from '@/modules/flashcards/context/due-words-count-context';
import { OnboardingRedirect } from '@/modules/user-settings/components/onboarding-redirect';

export const dynamic = 'force-dynamic';

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <OnboardingRedirect>
      <DueWordsCountProvider>{children}</DueWordsCountProvider>
    </OnboardingRedirect>
  );
};

export default AppLayout;
