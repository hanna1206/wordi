import { Suspense } from 'react';

import { PlayPageLoadingState } from '@/modules/flashcards/components/play-page-loading-state';
import { FlashcardsPage } from '@/modules/flashcards/pages/flashcards.page';

const FlashcardsPageWrapper = () => {
  <Suspense fallback={<PlayPageLoadingState />}>
    <FlashcardsPage />
  </Suspense>;
};

export default FlashcardsPageWrapper;
