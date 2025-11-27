'use client';

import { useCallback, useEffect, useState } from 'react';

import { Flex } from '@chakra-ui/react';

import { VocabularyItemModal } from '@/modules/vocabulary/components/vocabulary-item-modal';
import type { VocabularyItem } from '@/modules/vocabulary/vocabulary.types';

import { GameContent } from '../components/game-content';
import { KeyboardShortcutsHints } from '../components/keyboard-shortcuts-hints';
import { PlayPageErrorState } from '../components/play-page-error-state';
import { PlayPageGameCompleteState } from '../components/play-page-game-complete-state';
import { PlayPageLoadingState } from '../components/play-page-loading-state';
import { PlayPageNavigation } from '../components/play-page-navigation';
import { useDueWordsCount } from '../context/due-words-count-context';
import { useFlashCardsGame } from '../hooks/use-flash-cards-game';
import { useKeyboardShortcuts } from '../hooks/use-keyboard-shortcuts';

export const FlashcardsPage = () => {
  const {
    words,
    currentCardIndex,
    isLoading,
    error,
    isGameFinished,
    qualityScoresByWord,
    cardSide,
    cardButtonRef,
    handleNextCard,
    handleCardFlip,
  } = useFlashCardsGame();

  const { refetchDueCount } = useDueWordsCount();

  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);

  const handleOpenDetails = useCallback((word: VocabularyItem) => {
    setSelectedWord(word);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedWord(null);
  }, []);

  useEffect(() => {
    if (isGameFinished) {
      refetchDueCount();
    }
  }, [isGameFinished, refetchDueCount]);

  useKeyboardShortcuts({
    isLoading,
    error,
    isGameFinished,
    wordsLength: words.length,
    onCardFlip: handleCardFlip,
    onQualitySelect: handleNextCard,
  });

  if (isLoading) {
    return <PlayPageLoadingState />;
  }

  if (error) {
    return <PlayPageErrorState error={error} />;
  }

  if (isGameFinished) {
    return (
      <PlayPageGameCompleteState
        totalCards={words.length}
        qualityScores={qualityScoresByWord}
      />
    );
  }

  return (
    <Flex
      direction="column"
      h="100svh"
      p={4}
      pt={2}
      bgColor="gray.100"
      transition="background 0.5s ease-in-out"
    >
      <PlayPageNavigation
        currentIndex={currentCardIndex}
        totalCount={words.length}
        onClose={refetchDueCount}
      />

      {words[currentCardIndex] && (
        <GameContent
          ref={cardButtonRef}
          currentWord={words[currentCardIndex]}
          allWordIds={words.map((w) => w.id)}
          cardSide={cardSide}
          onCardFlip={handleCardFlip}
          onQualitySelect={handleNextCard}
          onOpenDetails={handleOpenDetails}
        />
      )}

      <KeyboardShortcutsHints />

      <VocabularyItemModal
        isOpen={Boolean(selectedWord)}
        savedWord={selectedWord}
        onClose={handleCloseDetails}
        allowDelete={false}
      />
    </Flex>
  );
};
