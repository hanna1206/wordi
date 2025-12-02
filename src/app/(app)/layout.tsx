import { DueWordsCountProvider } from '@/modules/flashcards/context/due-words-count-context';

export const dynamic = 'force-dynamic';

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  return <DueWordsCountProvider>{children}</DueWordsCountProvider>;
};

export default AppLayout;
