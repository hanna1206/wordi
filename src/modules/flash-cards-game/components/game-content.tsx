'use client';

import { forwardRef } from 'react';

import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

import { VocabularyItem } from '@/modules/words-persistence/vocabulary.types';

import { CardSide, QualityScore } from '../flash-cards-game.const';
import { useGestureHandling } from '../hooks/use-gesture-handling';
import { FlashCard } from './flash-card';
import { PlayPageQualityFeedbackButtons } from './play-page-quality-feedback-buttons';

interface GameContentProps {
  currentWord: VocabularyItem;
  allWordIds: string[];
  cardSide: CardSide;
  onCardFlip: () => void;
  onQualitySelect: (score: QualityScore) => void;
  onFlip: (wordId: string, isFlipped: boolean) => void;
}

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const GameContent = forwardRef<HTMLDivElement, GameContentProps>(
  (
    { currentWord, allWordIds, cardSide, onCardFlip, onQualitySelect, onFlip },
    ref,
  ) => {
    const { onTouchStart, onTouchEnd } = useGestureHandling({
      onCardFlip,
      onQualitySelect,
    });

    return (
      <Box
        w="full"
        maxW="lg"
        mx="auto"
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap={6}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Box
          key={currentWord.id}
          animation={`${slideIn} 220ms ease-out`}
          willChange="transform, opacity"
        >
          <FlashCard
            ref={ref}
            word={currentWord}
            cardSide={cardSide}
            allWordIds={allWordIds}
            onFlip={onFlip}
          />
        </Box>

        <PlayPageQualityFeedbackButtons onQualitySelect={onQualitySelect} />
      </Box>
    );
  },
);

GameContent.displayName = 'GameContent';
