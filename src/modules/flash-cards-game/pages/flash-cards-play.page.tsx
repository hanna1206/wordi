'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Box, Flex, HStack, Kbd, Text } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';

import { SavedWord } from '@/modules/words-persistence/words-persistence.types';

import { FlashCard } from '../components/flash-card';
import { PlayPageErrorState } from '../components/play-page-error-state';
import { PlayPageGameCompleteState } from '../components/play-page-game-complete-state';
import { PlayPageLoadingState } from '../components/play-page-loading-state';
import { PlayPageNavigation } from '../components/play-page-navigation';
import { PlayPageQualityFeedbackButtons } from '../components/play-page-quality-feedback-buttons';
import {
  getWordsForGame,
  saveQualityFeedback,
} from '../flash-cards-game.actions';
import { CardSide, GameMode, QualityScore } from '../flash-cards-game.const';

export const FlashCardsPlayPage = () => {
  const searchParams = useSearchParams();
  const [words, setWords] = useState<SavedWord[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [needsReviewWords, setNeedsReviewWords] = useState<SavedWord[]>([]);
  const cardButtonRef = useRef<HTMLButtonElement | null>(null);

  const mode = searchParams.get('mode') as GameMode;
  const limit = Number(searchParams.get('limit'));
  const cardSide = (searchParams.get('cardSide') as CardSide) || CardSide.Word;

  useEffect(() => {
    const fetchWords = async () => {
      if (!mode || !limit) {
        setError('Invalid game parameters.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await getWordsForGame({ mode, limit });

        if (result.success && result.data) {
          setWords(result.data);
        } else {
          setError(result.error || 'Failed to fetch words');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, [mode, limit]);

  // Focus the card when the index changes or words are loaded
  useEffect(() => {
    if (!isLoading && !error && !isGameFinished) {
      // slight delay to ensure DOM is updated
      const id = window.setTimeout(() => {
        cardButtonRef.current?.focus();
      }, 0);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [currentCardIndex, isLoading, error, isGameFinished]);

  const focusCard = useCallback(() => {
    cardButtonRef.current?.focus();
  }, []);

  const handleNextCard = useCallback(
    (qualityScore: QualityScore) => {
      const currentWord = words[currentCardIndex];

      if (!currentWord) return;

      // Optimistically update UI first
      if (qualityScore === QualityScore.Hard) {
        setNeedsReviewWords((prev) => [...prev, currentWord]);
      }

      if (currentCardIndex < words.length - 1) {
        setCurrentCardIndex((prev) => prev + 1);
        // Move focus back to the card so Space flips instead of re-pressing the button
        setTimeout(focusCard, 0);
      } else {
        setIsGameFinished(true);
      }

      // Save quality feedback in the background (non-blocking)
      saveQualityFeedback({ wordId: currentWord.id, qualityScore })
        .then((result) => {
          if (!result.success) {
            // eslint-disable-next-line no-console
            console.error('Failed to save quality feedback:', result.error);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Failed to save quality feedback:', error);
        });
    },
    [words, currentCardIndex, focusCard],
  );

  // Global keyboard shortcuts
  useEffect(() => {
    if (isLoading || error || isGameFinished || words.length === 0) return;

    const isTypingInField = (el: Element | null) => {
      if (!el) return false;
      const tag = el.tagName.toLowerCase();
      const editable = (el as HTMLElement).isContentEditable;
      return (
        editable || tag === 'input' || tag === 'textarea' || tag === 'select'
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingInField(document.activeElement)) return;

      // Flip with Space/Enter/Arrows Up/Down
      if (
        e.key === ' ' ||
        e.key === 'Enter' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown'
      ) {
        e.preventDefault();
        cardButtonRef.current?.click();
        return;
      }

      // Numeric ratings
      if (e.code === 'Digit1' || e.code === 'Numpad1') {
        e.preventDefault();
        handleNextCard(QualityScore.Hard);
        return;
      }
      if (e.code === 'Digit2' || e.code === 'Numpad2') {
        e.preventDefault();
        handleNextCard(QualityScore.Good);
        return;
      }
      if (e.code === 'Digit3' || e.code === 'Numpad3') {
        e.preventDefault();
        handleNextCard(QualityScore.Easy);
        return;
      }

      // ArrowRight advances with Good by default
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextCard(QualityScore.Good);
        return;
      }
    };

    window.addEventListener('keydown', onKeyDown as EventListener);
    return () =>
      window.removeEventListener('keydown', onKeyDown as EventListener);
  }, [isLoading, error, isGameFinished, words.length, handleNextCard]);

  if (isLoading) {
    return <PlayPageLoadingState />;
  }

  if (error) {
    return <PlayPageErrorState error={error} />;
  }

  if (isGameFinished) {
    return <PlayPageGameCompleteState needsReviewWords={needsReviewWords} />;
  }

  return (
    <>
      <Flex direction="column" h="100svh" p={4} pt={2}>
        <PlayPageNavigation
          currentIndex={currentCardIndex}
          totalCount={words.length}
        />

        {/* Desktop-only shortcut hints */}
        <Flex
          display={{ base: 'none', lg: 'flex' }}
          justify="center"
          align="center"
          gap={6}
          color="gray.600"
          fontSize="sm"
          mb={2}
        >
          <HStack gap={2}>
            <Text fontWeight="600">Flip:</Text>
            <HStack gap={1}>
              <Kbd>Space</Kbd>
              <Text>/</Text>
              <Kbd>Enter</Kbd>
              <Text>/</Text>
              <Kbd>↑</Kbd>
              <Text>/</Text>
              <Kbd>↓</Kbd>
            </HStack>
          </HStack>
          <HStack gap={2}>
            <Text fontWeight="600">Rate:</Text>
            <HStack gap={1}>
              <Kbd>1</Kbd>
              <Text>= Hard</Text>
              <Text>·</Text>
              <Kbd>2</Kbd>
              <Text>= Good</Text>
              <Text>·</Text>
              <Kbd>3</Kbd>
              <Text>= Easy</Text>
            </HStack>
          </HStack>
          <HStack gap={2}>
            <Text fontWeight="600">Next:</Text>
            <Kbd>→</Kbd>
            <Text>(Good)</Text>
          </HStack>
        </Flex>

        {/* Game Content */}
        <Box
          w="full"
          maxW="lg"
          mx="auto"
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap={6}
        >
          <FlashCard
            ref={cardButtonRef}
            word={words[currentCardIndex]}
            cardSide={cardSide}
            allWordIds={words.map((w) => w.id)}
          />

          <PlayPageQualityFeedbackButtons onQualitySelect={handleNextCard} />
        </Box>
      </Flex>
    </>
  );
};
