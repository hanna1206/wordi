'use client';

import { Suspense } from 'react';

import { FlashCardsPlayPage } from '@/modules/flash-cards-game/pages/flash-cards-play.page';

const FlashCardsPlay = () => {
  return (
    <Suspense>
      <FlashCardsPlayPage />
    </Suspense>
  );
};

export default FlashCardsPlay;
